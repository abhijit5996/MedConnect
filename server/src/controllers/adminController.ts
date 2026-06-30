import { Response } from "express";
import { User } from "../models/User";
import { DoctorProfile } from "../models/DoctorProfile";
import { Appointment } from "../models/Appointment";
import { PatientVitals } from "../models/PatientVitals";
import { AuthRequest } from "../middleware/auth";

export const getAdminStats = async (req: AuthRequest, res: Response) => {
  try {
    const patientsCount = await User.countDocuments({ role: "patient" });
    const doctorsCount = await User.countDocuments({ role: "doctor" });
    const appointmentsCount = await Appointment.countDocuments();
    const pendingApprovalsCount = await DoctorProfile.countDocuments({ approved: false });

    res.json({
      patientsCount,
      doctorsCount,
      appointmentsCount,
      pendingApprovalsCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

export const getAdminUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } }).select("-password");
    const doctorProfiles = await DoctorProfile.find();

    const usersWithProfiles = users.map((user: any) => {
      const docProfile = doctorProfiles.find(
        (profile: any) => profile.userId.toString() === user._id.toString()
      );
      return {
        ...user.toObject(),
        doctorProfile: docProfile ? {
          id: docProfile._id,
          specialty: docProfile.specialty,
          experience: docProfile.experience,
          rating: docProfile.rating,
          reviews: docProfile.reviews,
          location: docProfile.location,
          availability: docProfile.availability,
          consultationFee: docProfile.consultationFee,
          videoConsult: docProfile.videoConsult,
          approved: docProfile.approved,
        } : null,
      };
    });

    res.json(usersWithProfiles);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

export const toggleDoctorApproval = async (req: AuthRequest, res: Response) => {
  try {
    const { doctorId } = req.params; // doctorId could be the User ID or DoctorProfile ID
    const { approved } = req.body;

    if (typeof approved !== "boolean") {
      return res.status(400).json({ message: "Approved field must be a boolean" });
    }

    // Try finding by _id first, then by userId
    let profile = await DoctorProfile.findOneAndUpdate(
      { _id: doctorId },
      { approved },
      { new: true }
    );

    if (!profile) {
      profile = await DoctorProfile.findOneAndUpdate(
        { userId: doctorId },
        { approved },
        { new: true }
      );
    }

    if (!profile) {
      return res.status(404).json({ message: "Doctor profile not found" });
    }

    res.json({ message: `Doctor approval status updated successfully`, profile });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "doctor") {
      // Find DoctorProfile
      const profile = await DoctorProfile.findOne({ userId: user._id });
      if (profile) {
        // Delete appointments associated with doctor
        await Appointment.deleteMany({ doctorId: profile._id });
        // Delete profile
        await DoctorProfile.findByIdAndDelete(profile._id);
      }
    } else if (user.role === "patient") {
      // Delete vitals
      await PatientVitals.deleteMany({ patientId: user._id });
      // Delete appointments
      await Appointment.deleteMany({ patientId: user._id });
    }

    // Finally delete user
    await User.findByIdAndDelete(user._id);

    res.json({ message: "User and associated records deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

export const getAdminAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const appointments = await Appointment.find()
      .populate("patientId", "name email phone")
      .populate({
        path: "doctorId",
        populate: {
          path: "userId",
          select: "name email phone",
        },
      })
      .sort({ dateTime: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

export const cancelAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
