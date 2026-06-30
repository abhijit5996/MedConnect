import { Response } from "express";
import { Appointment } from "../models/Appointment";
import { DoctorProfile } from "../models/DoctorProfile";
import { AuthRequest } from "../middleware/auth";

export const bookAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { doctorId, dateTime, type, notes } = req.body;
    const patientId = req.user?.id;

    if (!doctorId || !dateTime) {
      return res.status(400).json({ message: "Doctor ID and date/time are required" });
    }

    // Verify doctor exists
    const doctor = await DoctorProfile.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appointment = new Appointment({
      patientId,
      doctorId,
      dateTime,
      type: type || "In-Person",
      notes: notes || "",
      status: "Pending",
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

export const getAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (role === "doctor") {
      // Find the doctor profile
      const doctorProfile = await DoctorProfile.findOne({ userId });
      if (!doctorProfile) {
        return res.status(404).json({ message: "Doctor profile not found" });
      }

      // Get appointments for this doctor profile
      const appointments = await Appointment.find({ doctorId: doctorProfile._id })
        .populate("patientId", "name email phone")
        .sort({ dateTime: 1 });

      const formatted = appointments.map((appt: any) => ({
        id: appt._id,
        patientName: appt.patientId?.name || "Patient",
        patientEmail: appt.patientId?.email || "",
        patientPhone: appt.patientId?.phone || "",
        dateTime: appt.dateTime,
        type: appt.type,
        status: appt.status,
        notes: appt.notes,
      }));

      return res.json(formatted);
    } else {
      // Patient (default)
      const appointments = await Appointment.find({ patientId: userId })
        .populate({
          path: "doctorId",
          populate: { path: "userId", select: "name email" },
        })
        .sort({ dateTime: 1 });

      const formatted = appointments.map((appt: any) => ({
        id: appt._id,
        doctorName: appt.doctorId?.userId?.name || "Doctor",
        specialty: appt.doctorId?.specialty || "",
        dateTime: appt.dateTime,
        type: appt.type,
        status: appt.status,
        notes: appt.notes,
      }));

      return res.json(formatted);
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

export const updateAppointmentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Confirmed, Completed, Cancelled

    if (!["Confirmed", "Completed", "Cancelled", "Pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Auth check: If doctor, they can update. If patient, they can only cancel
    const userId = req.user?.id;
    const role = req.user?.role;

    if (role === "patient" && appointment.patientId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to update this appointment" });
    }

    if (role === "doctor") {
      const doctorProfile = await DoctorProfile.findOne({ userId });
      if (!doctorProfile || appointment.doctorId.toString() !== doctorProfile._id.toString()) {
        return res.status(403).json({ message: "Unauthorized to update this appointment" });
      }
    }

    appointment.status = status;
    await appointment.save();

    res.json({ message: "Appointment status updated", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
