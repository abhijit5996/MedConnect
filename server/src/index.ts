import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth";
import doctorRoutes from "./routes/doctors";
import appointmentRoutes from "./routes/appointments";
import vitalsRoutes from "./routes/vitals";
import adminRoutes from "./routes/admin";
import { User } from "./models/User";
import { DoctorProfile } from "./models/DoctorProfile";
import { PatientVitals } from "./models/PatientVitals";
import bcrypt from "bcryptjs";

import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:8080", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/vitals", vitalsRoutes);
app.use("/api/admin", adminRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

import fs from "fs";

// Serve static files from React build directory
const clientBuildPath = path.join(__dirname, "../../client/dist");
console.log("📂 Resolved Client Build Path:", clientBuildPath);
console.log("📂 Does Client Build Path exist?:", fs.existsSync(clientBuildPath));
if (fs.existsSync(clientBuildPath)) {
  console.log("📂 Contents of Client Build Path:", fs.readdirSync(clientBuildPath));
}

app.use(express.static(clientBuildPath));

// Serve React index.html for all non-API paths (SPA fallback)
app.get("*", (req, res) => {
  const indexPath = path.join(clientBuildPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.error("❌ index.html not found at:", indexPath);
    res.status(404).send("Frontend assets not found or still building.");
  }
});

const startServer = async () => {
  await connectDB();

  // Database Migration: Ensure all existing doctor profiles have the 'approved' field set
  try {
    const result = await DoctorProfile.updateMany(
      { approved: { $exists: false } },
      { $set: { approved: true } }
    );
    if (result.modifiedCount > 0) {
      console.log(`🔧 Migrated ${result.modifiedCount} doctor profiles to set approved=true.`);
    }
  } catch (err) {
    console.error("⚠️ Failed to run doctor profile migration:", (err as Error).message);
  }

  // Clear default seeded admin to allow fresh admin registration
  try {
    const deleted = await User.deleteOne({ email: "admin@test.com", name: "System Administrator" });
    if (deleted.deletedCount > 0) {
      console.log("🧹 Removed default seeded admin 'admin@test.com' to allow custom registration.");
    }
  } catch (err) {
    console.error("⚠️ Failed to remove default seed admin:", (err as Error).message);
  }

  // Seeding
  try {
    const patientCount = await User.countDocuments({ role: "patient" });
    const doctorProfileCount = await DoctorProfile.countDocuments();

    const defaultPassword = await bcrypt.hash("password123", 10);

    if (patientCount === 0) {
      console.log("🌱 Patient list is empty. Seeding default patient...");
      let patientUser = await User.findOne({ email: "patient@test.com" });
      if (!patientUser) {
        patientUser = new User({
          name: "Rahul Verma",
          email: "patient@test.com",
          password: defaultPassword,
          phone: "+91 98765 43210",
          role: "patient",
        });
        await patientUser.save();
      }

      const vitalsCount = await PatientVitals.countDocuments({ patientId: patientUser._id });
      if (vitalsCount === 0) {
        const vitals = new PatientVitals({
          patientId: patientUser._id,
          bloodPressure: "120/80",
          heartRate: "72 bpm",
          temperature: "98.6 °F",
          healthScore: 85,
        });
        await vitals.save();
      }
      console.log("🌱 Patient seeded successfully.");
    }

    if (doctorProfileCount === 0) {
      console.log("🌱 Doctor profile list is empty. Seeding default doctors...");
      const seededDoctors = [
        {
          name: "Dr. Priya Sharma",
          email: "doctor@test.com",
          phone: "+91 99999 11111",
          specialty: "Cardiologist",
          experience: "15 years",
          rating: 4.9,
          reviews: 342,
          location: "Mumbai, Maharashtra",
          availability: "Available Today",
          consultationFee: "₹800",
          videoConsult: true,
        },
        {
          name: "Dr. Rajesh Kumar",
          email: "rajesh@test.com",
          phone: "+91 99999 22222",
          specialty: "General Physician",
          experience: "12 years",
          rating: 4.7,
          reviews: 256,
          location: "Delhi NCR",
          availability: "Available Tomorrow",
          consultationFee: "₹600",
          videoConsult: true,
        },
        {
          name: "Dr. Anita Desai",
          email: "anita@test.com",
          phone: "+91 99999 33333",
          specialty: "Dermatologist",
          experience: "10 years",
          rating: 4.8,
          reviews: 198,
          location: "Bangalore, Karnataka",
          availability: "Available Today",
          consultationFee: "₹700",
          videoConsult: false,
        },
        {
          name: "Dr. Vikram Patel",
          email: "vikram@test.com",
          phone: "+91 99999 44444",
          specialty: "Neurologist",
          experience: "18 years",
          rating: 4.9,
          reviews: 412,
          location: "Pune, Maharashtra",
          availability: "Available Tomorrow",
          consultationFee: "₹1000",
          videoConsult: true,
        },
        {
          name: "Dr. Sunita Menon",
          email: "sunita@test.com",
          phone: "+91 99999 55555",
          specialty: "Pediatrician",
          experience: "14 years",
          rating: 4.8,
          reviews: 287,
          location: "Chennai, Tamil Nadu",
          availability: "Available Today",
          consultationFee: "₹650",
          videoConsult: true,
        },
        {
          name: "Dr. Amit Singh",
          email: "amit@test.com",
          phone: "+91 99999 66666",
          specialty: "Orthopedic",
          experience: "16 years",
          rating: 4.7,
          reviews: 301,
          location: "Hyderabad, Telangana",
          availability: "Next Week",
          consultationFee: "₹900",
          videoConsult: false,
        },
      ];

      for (const docData of seededDoctors) {
        let docUser = await User.findOne({ email: docData.email });
        if (!docUser) {
          docUser = new User({
            name: docData.name,
            email: docData.email,
            password: defaultPassword,
            phone: docData.phone,
            role: "doctor",
          });
          await docUser.save();
        }

        const existingProfile = await DoctorProfile.findOne({ userId: docUser._id });
        if (!existingProfile) {
          const docProfile = new DoctorProfile({
            userId: docUser._id,
            specialty: docData.specialty,
            experience: docData.experience,
            rating: docData.rating,
            reviews: docData.reviews,
            location: docData.location,
            availability: docData.availability,
            consultationFee: docData.consultationFee,
            videoConsult: docData.videoConsult,
            approved: true,
          });
          await docProfile.save();
        }
      }
      console.log("🌱 Doctor profiles seeded successfully.");
    }
  } catch (err) {
    console.error("⚠️ Failed database seeding:", (err as Error).message);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();
