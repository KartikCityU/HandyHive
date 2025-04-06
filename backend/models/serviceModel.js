import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    
    // Additional fields for home services
    duration: { type: Number, default: 60 },             // Estimated duration in minutes
    priceType: { type: String, enum: ['fixed', 'hourly', 'estimate'], default: 'fixed' },
    minimumCharge: { type: Number },                     // Minimum service charge
    tags: [{ type: String }],                            // Tags for better searchability
    availableDaysInWeek: [{ type: String }],             // Days when this service is available
    requiresConsultation: { type: Boolean, default: false }  // If true, price is just an estimate
}, { timestamps: true });

const serviceModel = mongoose.models.service || mongoose.model("service", serviceSchema);
export default serviceModel;