import { Request, Response } from 'express';
import { doctorService } from '../services/doctorService';

export const getDoctors = (req: Request, res: Response) => {
  try {
    const doctors = doctorService.getAllDoctors();
    res.json({ success: true, count: doctors.length, data: doctors });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch doctors', error: error?.message });
  }
};

export const getDoctorById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doctor = doctorService.getDoctorById(id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    res.json({ success: true, data: doctor });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to fetch doctor', error: error?.message });
  }
};

export const searchDoctors = (req: Request, res: Response) => {
  try {
    const { city, specialty, maxFee, availability, query } = req.query;
    const result = doctorService.searchAndMatch({
      city: city as string | undefined,
      specialty: specialty as string | undefined,
      maxFee: maxFee ? Number(maxFee) : undefined,
      availability: availability as string | undefined,
      query: query as string | undefined,
    });
    res.json({ success: true, total: result.total, data: result.results });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Search query failed', error: error?.message });
  }
};
