import express from 'express';
import {
  createClientRequest,
  getAllClientRequests
} from '../controllers/clientRequest.controller.js';
import isAdmin from '../guards/isadmin.js';

const router = express.Router();

router.post('/', createClientRequest);
router.get('/', isAdmin, getAllClientRequests);

export default router;
