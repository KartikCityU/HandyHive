import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { 
    listOrders, 
    placeOrder, 
    updateStatus, 
    userOrders, 
    verifyOrder, 
    placeOrderCod, 
    deleteOrder,
    assignAgent,
    unassignAgent,
    getOrderAgent
} from '../controllers/orderController.js';

const orderRouter = express.Router();

// Existing routes
orderRouter.get("/list", listOrders);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/status", updateStatus);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/placecod", authMiddleware, placeOrderCod);
orderRouter.post("/delete", deleteOrder);

// New routes for agent assignment
orderRouter.post("/assign-agent", assignAgent);
orderRouter.post("/unassign-agent", unassignAgent);
orderRouter.post("/order-agent", getOrderAgent);

export default orderRouter;