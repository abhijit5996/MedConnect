import { Response } from "express";
import { DoctorProfile } from "../models/DoctorProfile";
import { AuthRequest } from "../middleware/auth";

export const getDoctors = async (req: AuthRequest, res: Response) => {
  try {
    const doctors = await DoctorProfile.find({ approved: true }).populate("userId", "name email phone");
    
    // Format response to match frontend doctor card shape
    const formatted = doctors.map((doc: any) => ({
      id: doc._id,
      name: doc.userId?.name || "Dr. Anonymous",
      email: doc.userId?.email || "",
      specialty: doc.specialty,
      experience: doc.experience,
      rating: doc.rating,
      reviews: doc.reviews,
      location: doc.location,
      availability: doc.availability,
      consultationFee: doc.consultationFee,
      videoConsult: doc.videoConsult,
      image: doc.userId?.name?.toLowerCase().includes("woman") || doc.userId?.name?.includes("Priya") || doc.userId?.name?.includes("Anita") || doc.userId?.name?.includes("Sunita") ? "👩‍⚕️" : "👨‍⚕️",
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

export const getDoctorProfile = async (req: AuthRequest, res: Response) => {
  try {
    const doctor = await DoctorProfile.findOne({ userId: req.user?.id || req.params.id }).populate("userId", "name email phone");
    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

export const updateDoctorProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== "doctor") {
      return res.status(403).json({ message: "Only doctors can update this profile" });
    }

    const { specialty, experience, location, availability, consultationFee, videoConsult } = req.body;

    const doctor = await DoctorProfile.findOneAndUpdate(
      { userId: req.user.id },
      { specialty, experience, location, availability, consultationFee, videoConsult },
      { new: true, runValidators: true }
    ).populate("userId", "name email phone");

    if (!doctor) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
