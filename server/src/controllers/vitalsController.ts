import { Response } from "express";
import { PatientVitals } from "../models/PatientVitals";
import { AuthRequest } from "../middleware/auth";

export const getVitals = async (req: AuthRequest, res: Response) => {
  try {
    const patientId = req.params.patientId || req.user?.id;

    // Retrieve latest vitals record
    const vitals = await PatientVitals.findOne({ patientId }).sort({ createdAt: -1 });
    
    if (!vitals) {
      // Return a standard baseline if not found
      return res.json({
        bloodPressure: "120/80",
        heartRate: "72 bpm",
        temperature: "98.6 °F",
        healthScore: 85,
      });
    }

    res.json(vitals);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

export const updateVitals = async (req: AuthRequest, res: Response) => {
  try {
    const patientId = req.user?.id;
    const { bloodPressure, heartRate, temperature, healthScore } = req.body;

    let vitals = await PatientVitals.findOne({ patientId });

    if (vitals) {
      vitals.bloodPressure = bloodPressure ?? vitals.bloodPressure;
      vitals.heartRate = heartRate ?? vitals.heartRate;
      vitals.temperature = temperature ?? vitals.temperature;
      vitals.healthScore = healthScore ?? vitals.healthScore;
    } else {
      vitals = new PatientVitals({
        patientId,
        bloodPressure: bloodPressure || "120/80",
        heartRate: heartRate || "72 bpm",
        temperature: temperature || "98.6 °F",
        healthScore: healthScore || 85,
      });
    }

    await vitals.save();
    res.json(vitals);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
