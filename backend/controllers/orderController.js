import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import serviceModel from "../models/serviceModel.js";
import DeliveryAgent from "../models/deliveryAgentModel.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Config variables
const currency = "usd";
const deliveryCharge = 5;
const frontend_URL = 'http://localhost:5173';

// Find and assign available agent based on service category
const assignServiceAgent = async (orderId, serviceCategory) => {
    try {
        // Find an available agent of the matching category
        const availableAgent = await DeliveryAgent.findOne({
            serviceType: serviceCategory,
            activeStatus: true,
            currentOrderId: null
        }).sort({ rating: -1 }); // Prioritize higher-rated agents
        
        if (!availableAgent) {
            // No available agent found
            return { success: false, message: "No available agent found for this service category" };
        }
        
        // Update the agent as assigned to this order
        availableAgent.activeStatus = false;
        availableAgent.currentOrderId = orderId;
        await availableAgent.save();
        
        // Update the order with agent details
        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            {
                assignedAgentId: availableAgent._id,
                agentName: availableAgent.name,
                agentPhone: availableAgent.phone,
                agentEmail: availableAgent.email,
                agentProfileImage: availableAgent.profileImage,
                assignmentStatus: 'assigned'
            },
            { new: true }
        );
        
        return {
            success: true,
            agent: availableAgent,
            order: updatedOrder
        };
    } catch (error) {
        console.error("Error assigning service agent:", error);
        return { success: false, message: "Error assigning service agent" };
    }
};

// Determine service category from items
const getServiceCategory = async (items) => {
    try {
        if (!items || items.length === 0) return null;
        
        // Get the first item's ID (assuming most orders have one main service)
        const mainItemId = items[0]._id;
        
        // Find the service to get its category
        const service = await serviceModel.findById(mainItemId);
        if (!service) return null;
        
        // Map the service category to agent service type if needed
        // For example, "Plumbing" in service might map to "Plumber" for agents
        const categoryMap = {
            "Plumbing": "Plumber",
            "Electrical": "Electrician",
            // Add other mappings as needed
        };
        
        return categoryMap[service.category] || service.category;
    } catch (error) {
        console.error("Error determining service category:", error);
        return null;
    }
};

// Placing User Order for Frontend using stripe
const placeOrder = async (req, res) => {
    try {
        // Determine the service category for agent assignment
        const serviceCategory = await getServiceCategory(req.body.items);
        
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            customerName: req.body.customerName,
            serviceDate: req.body.serviceDate || req.body.deliveryDate,
            deliveryDate: req.body.deliveryDate || req.body.serviceDate,
            serviceTime: req.body.serviceTime || req.body.deliveryTime,
            deliveryTime: req.body.deliveryTime || req.body.serviceTime,
            specialRequests: req.body.specialRequests,
            serviceCategory: serviceCategory
        });
        
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
        
        // Try to assign an agent if we have a service category
        if (serviceCategory) {
            await assignServiceAgent(newOrder._id, serviceCategory);
        }

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 
            },
            quantity: item.quantity
        }));

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: "Delivery Charge"
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder._id}`,
            line_items: line_items,
            mode: 'payment',
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Placing User Order for Frontend using COD
const placeOrderCod = async (req, res) => {
    try {
        // Determine the service category for agent assignment
        const serviceCategory = await getServiceCategory(req.body.items);
        
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: true,
            customerName: req.body.customerName,
            serviceDate: req.body.serviceDate || req.body.deliveryDate,
            deliveryDate: req.body.deliveryDate || req.body.serviceDate,
            serviceTime: req.body.serviceTime || req.body.deliveryTime,
            deliveryTime: req.body.deliveryTime || req.body.serviceTime,
            specialRequests: req.body.specialRequests,
            serviceCategory: serviceCategory
        });
        
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
        
        // Try to assign an agent if we have a service category
        let assignmentResult = { success: false };
        if (serviceCategory) {
            assignmentResult = await assignServiceAgent(newOrder._id, serviceCategory);
        }

        res.json({ 
            success: true, 
            message: "Order Placed", 
            agentAssigned: assignmentResult.success,
            agentDetails: assignmentResult.success ? {
                name: assignmentResult.agent.name,
                phone: assignmentResult.agent.phone,
                email: assignmentResult.agent.email
            } : null
        });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Listing Order for Admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// User Orders for Frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.body.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }
        
        // If the order is being marked as completed
        if (status === "Completed" && order.assignedAgentId) {
            // Update the agent
            const agent = await DeliveryAgent.findById(order.assignedAgentId);
            if (agent) {
                agent.activeStatus = true;
                agent.currentOrderId = null;
                agent.completedServices = (agent.completedServices || 0) + 1;
                await agent.save();
                
                // Update order assignment status
                order.assignmentStatus = 'completed';
            }
        }
        
        // Update the order status
        order.status = status;
        await order.save();
        
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error" });
    }
};

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Paid" });
        }
        else {
            // Get the order to check for an assigned agent
            const order = await orderModel.findById(orderId);
            
            // If there's an assigned agent, free them up
            if (order && order.assignedAgentId) {
                await DeliveryAgent.findByIdAndUpdate(order.assignedAgentId, {
                    activeStatus: true,
                    currentOrderId: null
                });
            }
            
            // Delete the order
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Not Paid" });
        }
    } catch (error) {
        res.json({ success: false, message: "Not Verified" });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        
        // Find the order first
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }
        
        // If there's an assigned agent, free them up
        if (order.assignedAgentId) {
            await DeliveryAgent.findByIdAndUpdate(order.assignedAgentId, {
                activeStatus: true,
                currentOrderId: null
            });
        }
        
        // Delete the order
        await orderModel.findByIdAndDelete(orderId);
        
        res.json({ success: true, message: "Order deleted successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error deleting order" });
    }
};

// New API to manually assign an agent to an order
const assignAgent = async (req, res) => {
    try {
        const { orderId, agentId } = req.body;
        
        // Check if order exists
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }
        
        // Check if agent exists and is available
        const agent = await DeliveryAgent.findById(agentId);
        if (!agent) {
            return res.json({ success: false, message: "Agent not found" });
        }
        
        if (!agent.activeStatus || agent.currentOrderId) {
            return res.json({ success: false, message: "Agent is not available" });
        }
        
        // If order already has an agent, free up that agent
        if (order.assignedAgentId) {
            await DeliveryAgent.findByIdAndUpdate(order.assignedAgentId, {
                activeStatus: true,
                currentOrderId: null
            });
        }
        
        // Assign new agent
        agent.activeStatus = false;
        agent.currentOrderId = orderId;
        await agent.save();
        
        // Update order
        order.assignedAgentId = agent._id;
        order.agentName = agent.name;
        order.agentPhone = agent.phone;
        order.agentEmail = agent.email;
        order.agentProfileImage = agent.profileImage;
        order.assignmentStatus = 'assigned';
        await order.save();
        
        res.json({ 
            success: true, 
            message: "Agent assigned successfully",
            agentDetails: {
                name: agent.name,
                phone: agent.phone,
                email: agent.email
            }
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error assigning agent" });
    }
};

// New API to unassign an agent from an order
const unassignAgent = async (req, res) => {
    try {
        const { orderId } = req.body;
        
        // Check if order exists
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }
        
        // If no agent assigned, nothing to do
        if (!order.assignedAgentId) {
            return res.json({ success: false, message: "No agent assigned to this order" });
        }
        
        // Free up the agent
        await DeliveryAgent.findByIdAndUpdate(order.assignedAgentId, {
            activeStatus: true,
            currentOrderId: null
        });
        
        // Update order
        order.assignedAgentId = null;
        order.agentName = null;
        order.agentPhone = null;
        order.agentEmail = null;
        order.agentProfileImage = null;
        order.assignmentStatus = 'pending';
        await order.save();
        
        res.json({ success: true, message: "Agent unassigned successfully" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error unassigning agent" });
    }
};

// Get agent details for an order
const getOrderAgent = async (req, res) => {
    try {
        const { orderId } = req.body;
        
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }
        
        if (!order.assignedAgentId) {
            return res.json({ 
                success: true, 
                assigned: false,
                message: "No agent assigned to this order" 
            });
        }
        
        const agent = await DeliveryAgent.findById(order.assignedAgentId);
        if (!agent) {
            return res.json({ 
                success: false, 
                message: "Assigned agent not found in database" 
            });
        }
        
        res.json({
            success: true,
            assigned: true,
            agent: {
                id: agent._id,
                name: agent.name,
                phone: agent.phone,
                email: agent.email,
                profileImage: agent.profileImage,
                rating: agent.rating,
                serviceType: agent.serviceType,
                completedServices: agent.completedServices
            }
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error fetching order agent" });
    }
};

export { 
    placeOrder, 
    listOrders, 
    userOrders, 
    updateStatus, 
    verifyOrder, 
    placeOrderCod, 
    deleteOrder,
    assignAgent,
    unassignAgent,
    getOrderAgent
};