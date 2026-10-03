import { Request, Response } from 'express';
import { hospitalService } from '../services/hospitalService';

export const getHospitals = (req: Request, res: Response) => {
  try {
    const hospitals = hospitalService.getAllHospitals();
    res.json({ success: true, count: hospitals.length, data: hospitals });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch hospitals', error: error?.message });
  }
};

export const getHospitalById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const hospital = hospitalService.getHospitalById(id);
    if (!hospital) {
      return res.status(404).json({ success: false, message: 'Hospital not found' });
    }
    res.json({ success: true, data: hospital });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch hospital', error: error?.message });
  }
};

export const searchHospitals = (req: Request, res: Response) => {
  try {
    const { city, emergencyOnly, department, query } = req.query;
    const result = hospitalService.searchHospitals({
      city: city as string | undefined,
      emergencyOnly: emergencyOnly === 'true',
      department: department as string | undefined,
      query: query as string | undefined,
    });
    res.json({ success: true, total: result.total, data: result.results });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Hospital search failed', error: error?.message });
  }
};
