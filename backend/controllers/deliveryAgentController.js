import DeliveryAgent from "../models/deliveryAgentModel.js";
import fs from 'fs';

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
    // Get file information from multer
    console.log("File received:", req.file); // Debug log
    let profileImage = req.file ? req.file.filename : 'default-agent.png';
    console.log("Profile image name:", profileImage); // Debug log
    
    // Extract ALL data from request body
    const { 
      name, 
      email, 
      phone, 
      address, 
      city, 
      bio, 
      serviceType,
      activeStatus,
      completedServices,
      rating
    } = req.body;
    
    // Parse numeric fields
    const parsedCompletedServices = parseInt(completedServices) || 0;
    const parsedRating = parseFloat(rating) || 0;
    
    // Debug
    console.log("Completed Services (raw):", completedServices);
    console.log("Rating (raw):", rating);
    console.log("Completed Services (parsed):", parsedCompletedServices);
    console.log("Rating (parsed):", parsedRating);
    
    const newAgent = new DeliveryAgent({
      name,
      email,
      phone,
      address,
      city,
      bio: bio || "",
      serviceType: serviceType || "Plumber",
      profileImage: profileImage,
      // Add the missing fields with proper conversion
      activeStatus: activeStatus === 'true' || activeStatus === true,
      completedServices: parsedCompletedServices,
      rating: parsedRating
    });
    
    const savedAgent = await newAgent.save();
    console.log("Agent saved:", savedAgent); // Debug log
    
    res.json({ success: true, message: "Agent added successfully", data: savedAgent });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding agent: " + error.message });
  }
};

// Update agent information
export const updateAgent = async (req, res) => {
  try {
    const agentId = req.params.id;
    const updateData = {...req.body};
    
    // Handle numeric fields
    if (updateData.completedServices !== undefined) {
      updateData.completedServices = parseInt(updateData.completedServices) || 0;
    }
    
    if (updateData.rating !== undefined) {
      updateData.rating = parseFloat(updateData.rating) || 0;
    }
    
    // Handle boolean fields
    if (updateData.activeStatus !== undefined) {
      updateData.activeStatus = updateData.activeStatus === 'true' || updateData.activeStatus === true;
    }
    
    // Add profile image if a new one was uploaded
    if (req.file) {
      updateData.profileImage = req.file.filename;
    }
    
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
    
    // Delete the profile image if it exists and is not the default
    if (deletedAgent.profileImage && deletedAgent.profileImage !== 'default-agent.png') {
      fs.unlink(`uploads/agents/${deletedAgent.profileImage}`, (err) => {
        if (err) console.log("Error deleting profile image:", err);
      });
    }
    
    res.json({ success: true, message: "Agent deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error deleting agent" });
  }
};