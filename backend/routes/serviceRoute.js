import express from 'express';
import { addService, listServices, removeService } from '../controllers/serviceController.js';
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

serviceRouter.get("/list", listServices);
serviceRouter.post("/add", upload.single('image'), addService);
serviceRouter.post("/remove", removeService);

export default serviceRouter;