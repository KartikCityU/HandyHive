import express from 'express';
import { 
  getAllAgents, 
  getAgentById, 
  addAgent, 
  updateAgent, 
  deleteAgent 
} from '../controllers/deliveryAgentController.js';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();

// Create uploads/agents directory if it doesn't exist
if (!fs.existsSync('uploads/agents')) {
  fs.mkdirSync('uploads/agents', { recursive: true });
}

// Image Storage Engine for agent profile photos
const storage = multer.diskStorage({
    destination: 'uploads/agents',
    filename: (req, file, cb) => {
        return cb(null, `agent_${Date.now()}${file.originalname.substring(file.originalname.lastIndexOf('.'))}`);
    }
});

const upload = multer({ storage: storage });

// Routes
router.get('/', getAllAgents);
router.get('/:id', getAgentById);
router.post('/add', upload.single('profileImage'), addAgent);
router.put('/:id', upload.single('profileImage'), updateAgent);
router.delete('/:id', deleteAgent);

export default router;