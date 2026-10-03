import { Router } from 'express';
import { getHospitals, getHospitalById, searchHospitals } from '../controllers/hospitalController';

const router = Router();

router.get('/hospitals', getHospitals);
router.get('/hospitals/:id', getHospitalById);
router.get('/search/hospitals', searchHospitals);

export default router;
