import { Router } from 'express';
import { createAppointment, createBedRequest } from '../controllers/appointmentController';

const router = Router();

router.post('/appointments', createAppointment);
router.post('/bed-requests', createBedRequest);

export default router;
