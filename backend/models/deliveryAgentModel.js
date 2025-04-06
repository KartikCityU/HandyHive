import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now() }
});

const deliveryAgentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    profileImage: { type: String, default: 'default-agent.png' },
    joiningDate: { type: Date, default: Date.now() },
    activeStatus: { type: Boolean, default: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    bio: { type: String, default: "" },
    completedServices: { type: Number, default: 0 },
    currentOrderId: { type: String, default: null },
    averageRating: { type: Number, default: 0 },
    reviews: [reviewSchema],
    serviceType: { type: String, enum: ['Plumber', 'Electrician', 'Cleaner', 'HVAC', 'Hairdresser', 'Pest Control'], default: 'Plumber' },
}, { timestamps: true });

// Calculate average rating whenever a review is added or modified
deliveryAgentSchema.pre('save', function(next) {
    if (this.reviews && this.reviews.length > 0) {
        const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        this.averageRating = (totalRating / this.reviews.length).toFixed(1);
    } else {
        this.averageRating = 0;
    }
    next();
});

const DeliveryAgent = mongoose.models.deliveryAgent || mongoose.model("deliveryAgent", deliveryAgentSchema);
export default DeliveryAgent;