import { Schema, model } from "mongoose";

const appointmentSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "DoctorProfile",
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ["In-Person", "Video Call"],
      required: true,
      default: "In-Person",
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Appointment = model("Appointment", appointmentSchema);
