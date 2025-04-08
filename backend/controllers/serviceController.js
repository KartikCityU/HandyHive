import serviceModel from "../models/serviceModel.js";
import fs from 'fs';

// Get all services list
const listServices = async (req, res) => {
    try {
        const services = await serviceModel.find({})
        res.json({ success: true, data: services })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching services" })
    }
}

// Add a new service
const addService = async (req, res) => {
    try {
        let image_filename = `${req.file.filename}`

        const service = new serviceModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: image_filename,
            duration: req.body.duration,
            priceType: req.body.priceType,
            minimumCharge: req.body.minimumCharge,
            tags: req.body.tags ? JSON.parse(req.body.tags) : [],
            availableDaysInWeek: req.body.availableDaysInWeek ? JSON.parse(req.body.availableDaysInWeek) : [],
            requiresConsultation: req.body.requiresConsultation === 'true'
        })

        await service.save();
        res.json({ success: true, message: "Service Added Successfully" })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error adding service" })
    }
}

// Delete a service
const removeService = async (req, res) => {
    try {
        const service = await serviceModel.findById(req.body.id);
        
        // Delete the image file if it exists
        if (service && service.image) {
            fs.unlink(`uploads/${service.image}`, (err) => {
                if (err) console.log("Error deleting image:", err);
            });
        }

        await serviceModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Service Removed Successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error removing service" });
    }
}

// Get a single service by ID
const getServiceById = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const service = await serviceModel.findById(serviceId);
        
        if (!service) {
            return res.json({ success: false, message: "Service not found" });
        }
        
        res.json({ success: true, data: service });
    } catch (error) {
        console.error("Error fetching service:", error);
        res.json({ success: false, message: "Error fetching service details" });
    }
};
  
// Update a service
const updateService = async (req, res) => {
    try {
        const { id, name, category, price, priceType, description } = req.body;
        
        // Check if service exists
        const service = await serviceModel.findById(id);
        if (!service) {
            return res.json({ success: false, message: "Service not found" });
        }
        
        // Create update object
        const updateData = {
            name,
            category,
            price,
            priceType,
            description
        };
        
        // If a new image was uploaded
        if (req.file) {
            // Delete old image if not default
            if (service.image) {
                const imagePath = `uploads/${service.image}`;
                if (fs.existsSync(imagePath)) {
                    fs.unlink(imagePath, (err) => {
                        if (err) console.log("Error deleting old image:", err);
                    });
                }
            }
            
            // Set new image
            updateData.image = req.file.filename;
        }
        
        // Update the service
        const updatedService = await serviceModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true } // Return the updated document
        );
        
        res.json({ 
            success: true, 
            message: "Service updated successfully",
            data: updatedService
        });
    } catch (error) {
        console.error("Error updating service:", error);
        res.json({ success: false, message: "Error updating service" });
    }
};

export { listServices, addService, removeService, getServiceById, updateService };