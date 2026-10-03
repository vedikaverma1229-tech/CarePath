import { Request, Response } from 'express';
import { appointmentService } from '../services/appointmentService';

export const createAppointment = (req: Request, res: Response) => {
  try {
    const { doctorId, doctorName, patientName, patientPhone, date, timeSlot, notes } = req.body;
    if (!doctorId || !patientName || !patientPhone || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Missing required booking fields (doctorId, patientName, patientPhone, date, timeSlot)',
      });
    }

    const appointment = appointmentService.createAppointment({
      doctorId,
      doctorName,
      patientName,
      patientPhone,
      date,
      timeSlot,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Appointment scheduled successfully.',
      data: appointment,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to create appointment', error: error?.message });
  }
};

export const createBedRequest = (req: Request, res: Response) => {
  try {
    const { hospitalId, hospitalName, patientName, contact, department, bedType } = req.body;
    if (!hospitalId || !patientName || !contact || !department || !bedType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required bed request fields (hospitalId, patientName, contact, department, bedType)',
      });
    }

    const bedRequest = appointmentService.createBedRequest({
      hospitalId,
      hospitalName,
      patientName,
      contact,
      department,
      bedType,
    });

    res.status(201).json({
      success: true,
      message: 'Bed reservation request submitted successfully to hospital desk.',
      data: bedRequest,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Failed to submit bed request', error: error?.message });
  }
};
