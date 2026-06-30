import { Schema, model } from "mongoose";

const patientVitalsSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Let's keep one vital status record per patient, or a log. Let's make it unique per patient, so they can overwrite or update their current vitals, or we can make it a historical log (no unique key) and query the latest. A historical log is better, but to start we can just fetch the latest vital record. Let's allow multiple entries (no unique key) and sort by createdAt.
    },
    bloodPressure: {
      type: String,
      default: "120/80",
    },
    heartRate: {
      type: String,
      default: "72 bpm",
    },
    temperature: {
      type: String,
      default: "98.6 °F",
    },
    healthScore: {
      type: Number,
      default: 85,
    },
  },
  {
    timestamps: true,
  }
);

export const PatientVitals = model("PatientVitals", patientVitalsSchema);
