import { Router } from 'express';
import { getDoctors, getDoctorById, searchDoctors } from '../controllers/doctorController';

const router = Router();

router.get('/doctors', getDoctors);
router.get('/doctors/:id', getDoctorById);
router.get('/search/doctors', searchDoctors);

export default router;
