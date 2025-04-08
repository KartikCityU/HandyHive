import express from 'express';
import { addService, listServices, removeService, getServiceById, updateService } from '../controllers/serviceController.js';
import multer from 'multer';
const serviceRouter = express.Router();

// Image Storage Engine (Saving Image to uploads folder & rename it)
const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
})

const upload = multer({ storage: storage })

// Note: Fix the path structure - you're already in the /api/services/ route
serviceRouter.get("/list", listServices);
serviceRouter.post("/add", upload.single('image'), addService);
serviceRouter.post("/remove", removeService);
// GET a single service - fix path
serviceRouter.get('/:id', getServiceById);
// POST update a service - fix path
serviceRouter.post("/update", upload.single('image'), updateService);

export default serviceRouter;