import { Schema, model } from "mongoose";

const doctorProfileSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    specialty: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 5.0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      required: true,
    },
    availability: {
      type: String,
      default: "Available Today",
    },
    consultationFee: {
      type: String,
      required: true,
    },
    videoConsult: {
      type: Boolean,
      default: false,
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const DoctorProfile = model("DoctorProfile", doctorProfileSchema);
