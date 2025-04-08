import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    items: { type: Array, required: true}, 
    amount: { type: Number, required: true},
    address: {type: Object, required: true},
    status: {type: String, default: "Order Processing"},
    date: {type: Date, default: Date.now()},
    payment: {type: Boolean, default: false},
    
    // Service booking fields
    customerName: {type: String},
    // Store dates as strings to avoid timezone issues and parsing problems
    deliveryDate: {type: String}, 
    serviceDate: {type: String},
    deliveryTime: {type: String},
    serviceTime: {type: String},
    specialRequests: {type: String},
    
    // Agent assignment fields
    assignedAgentId: {type: String, default: null},
    agentName: {type: String, default: null},
    agentPhone: {type: String, default: null},
    agentEmail: {type: String, default: null},
    agentProfileImage: {type: String, default: null},
    assignmentStatus: {type: String, enum: ['pending', 'assigned', 'completed', 'cancelled'], default: 'pending'},
    serviceCategory: {type: String, default: null}, // To store which category service was ordered
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add virtual for formatted delivery/service date
orderSchema.virtual('formattedDate').get(function() {
    const dateStr = this.serviceDate || this.deliveryDate;
    if (!dateStr) return 'Not specified';
    
    try {
        const date = new Date(dateStr);
        return date instanceof Date && !isNaN(date) 
            ? date.toLocaleDateString() 
            : dateStr; // Return original string if parsing fails
    } catch (e) {
        return dateStr;
    }
});

// Add virtual for formatted time
orderSchema.virtual('formattedTime').get(function() {
    return this.serviceTime || this.deliveryTime || 'Not specified';
});

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;