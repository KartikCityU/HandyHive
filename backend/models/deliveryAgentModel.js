import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const deliveryAgentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    profileImage: { type: String, default: 'default-agent.png' },
    joiningDate: { type: Date, default: Date.now },
    activeStatus: { type: Boolean, default: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    bio: { type: String, default: "" },
    completedServices: { type: Number, default: 0 },
    currentOrderId: { type: String, default: null },
    rating: { type: Number, default: 0 }, // Changed from averageRating to just rating
    reviews: [reviewSchema],
    serviceType: { type: String, enum: ['Plumber', 'Electrician', 'Cleaning', 'HVAC', 'Landscaping', 'Appliance Repair', 'Driver', 'Home Repair'], default: 'Plumber' },
}, { timestamps: true });

// No pre-save hooks needed since rating is manually set

const DeliveryAgent = mongoose.models.deliveryAgent || mongoose.model("deliveryAgent", deliveryAgentSchema);
export default DeliveryAgent;