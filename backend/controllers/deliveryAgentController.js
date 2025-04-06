import DeliveryAgent from "../models/deliveryAgentModel.js";

// Get all delivery agents
export const getAllAgents = async (req, res) => {
  try {
    const agents = await DeliveryAgent.find({});
    res.json({ success: true, data: agents });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching agents" });
  }
};

// Get agent by ID
export const getAgentById = async (req, res) => {
  try {
    const agentId = req.params.id;
    const agent = await DeliveryAgent.findById(agentId);
    
    if (!agent) {
      return res.json({ success: false, message: "Agent not found" });
    }
    
    res.json({ success: true, data: agent });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching agent details" });
  }
};

// Add a new delivery agent
export const addAgent = async (req, res) => {
  try {
    const { name, email, phone, address, city, bio, vehicleType, vehicleNumber } = req.body;
    
    const newAgent = new DeliveryAgent({
      name,
      email,
      phone,
      address,
      city,
      bio: bio || "",
      vehicleType: vehicleType || "Bike",
      vehicleNumber: vehicleNumber || ""
    });
    
    await newAgent.save();
    res.json({ success: true, message: "Agent added successfully", data: newAgent });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding agent" });
  }
};

// Update agent information
export const updateAgent = async (req, res) => {
  try {
    const agentId = req.params.id;
    const updateData = req.body;
    
    const updatedAgent = await DeliveryAgent.findByIdAndUpdate(
      agentId,
      updateData,
      { new: true } // Return the updated document
    );
    
    if (!updatedAgent) {
      return res.json({ success: false, message: "Agent not found" });
    }
    
    res.json({ success: true, message: "Agent updated successfully", data: updatedAgent });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating agent" });
  }
};

// Delete an agent
export const deleteAgent = async (req, res) => {
  try {
    const agentId = req.params.id;
    
    const deletedAgent = await DeliveryAgent.findByIdAndDelete(agentId);
    
    if (!deletedAgent) {
      return res.json({ success: false, message: "Agent not found" });
    }
    
    res.json({ success: true, message: "Agent deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error deleting agent" });
  }
};