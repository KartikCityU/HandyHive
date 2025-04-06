import express from 'express';
import { 
  getAllAgents, 
  getAgentById, 
  addAgent, 
  updateAgent, 
  deleteAgent 
} from '../controllers/deliveryAgentController.js';

const router = express.Router();

// Routes
router.get('/', getAllAgents);
router.get('/:id', getAgentById);
router.post('/add', addAgent);
router.put('/:id', updateAgent);
router.delete('/:id', deleteAgent);

export default router;