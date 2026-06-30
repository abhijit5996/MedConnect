import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { DoctorProfile } from "../models/DoctorProfile";
import { PatientVitals } from "../models/PatientVitals";
import { AuthRequest } from "../middleware/auth";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount > 0) {
        return res.status(400).json({ message: "An administrator account already exists. Sign up is disabled." });
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone: phone || "",
      role,
    });

    await user.save();

    // If doctor, seed a default profile
    if (role === "doctor") {
      const doctorProfile = new DoctorProfile({
        userId: user._id,
        specialty: "General Physician",
        experience: "5 years",
        rating: 5.0,
        reviews: 1,
        location: "Mumbai, Maharashtra",
        availability: "Available Today",
        consultationFee: "₹500",
        videoConsult: true,
      });
      await doctorProfile.save();
    } else if (role === "patient") {
      // If patient, seed default vital details
      const vitals = new PatientVitals({
        patientId: user._id,
        bloodPressure: "120/80",
        heartRate: "72 bpm",
        temperature: "98.6 °F",
        healthScore: 85,
      });
      await vitals.save();
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "supersecret_medconnect_key_123!@#",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "supersecret_medconnect_key_123!@#",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

export const getAdminCheck = async (req: Request, res: Response) => {
  try {
    const adminCount = await User.countDocuments({ role: "admin" });
    res.json({ hasAdmin: adminCount > 0 });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
