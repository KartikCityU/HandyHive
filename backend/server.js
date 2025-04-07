import express  from "express"
import cors from 'cors'
import { connectDB } from "./config/db.js"
import userRouter from "./routes/userRoute.js"
import foodRouter from "./routes/foodRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import deliveryAgentRoutes from './routes/deliveryAgentRoutes.js';
import serviceRouter from './routes/serviceRoute.js';

// app config
const app = express()
const port = process.env.PORT || 4000;


// middlewares
app.use(express.json())
app.use(cors())

// db connection
connectDB()

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/food", foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/cart", cartRouter)
app.use("/api/order",orderRouter)
app.use('/api/agents', deliveryAgentRoutes);
app.use('/api/services', serviceRouter);
app.use("/images", express.static('uploads'));
app.use("/images/agents", express.static('uploads/agents'));


app.get("/", (req, res) => {
    res.send("API Working")
  });

app.listen(port, () => console.log(`Server started on http://localhost:${port}`))

// // Temporary debug route - remove in production
// app.get('/debug-images', (req, res) => {
//   const fs = require('fs');
//   const path = require('path');
  
//   try {
//     const uploadsExists = fs.existsSync('uploads');
//     const agentsExists = fs.existsSync('uploads/agents');
    
//     const files = agentsExists ? fs.readdirSync('uploads/agents') : [];
    
//     res.json({
//       uploadsDirectoryExists: uploadsExists,
//       agentsDirectoryExists: agentsExists,
//       files: files,
//       uploadPath: path.resolve('uploads/agents')
//     });
//   } catch (error) {
//     res.json({ error: error.message });
//   }
// });