import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Order Processing" },
    date: { type: Date, default: Date.now() },
    payment: { type: Boolean, default: false },
    // Customer details fields
    customerName: { type: String },
    deliveryDate: { type: Date },
    deliveryTime: { type: String },
    specialRequests: { type: String },
    // Delivery agent fields
    deliveryAgentId: { type: String, default: null },
    deliveryAgentName: { type: String, default: null },
    deliveryAssignedAt: { type: Date, default: null },
    deliveryCompletedAt: { type: Date, default: null },
    agentRating: { type: Number, default: null },
    agentReviewed: { type: Boolean, default: false }
});

// Pre-save middleware to set deliveryAssignedAt when an agent is assigned
orderSchema.pre('save', function(next) {
    // If deliveryAgentId is set and deliveryAssignedAt is not set
    if (this.deliveryAgentId && !this.deliveryAssignedAt) {
        this.deliveryAssignedAt = new Date();
    }
    
    // If status is changed to "Delivered" and deliveryCompletedAt is not set
    if (this.status === "Delivered" && !this.deliveryCompletedAt) {
        this.deliveryCompletedAt = new Date();
    }
    
    next();
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;