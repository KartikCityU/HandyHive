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

export { listServices, addService, removeService };