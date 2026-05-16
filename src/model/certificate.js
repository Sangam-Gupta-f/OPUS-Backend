// Certificate model
import mongoose from "mongoose";
const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
    },
    issuedDate: {
      type: Date,
      default: Date.now,
    },
    verificationUrl: {
      type: String,
    },
    qrCode: {
      type: String,
    },
    internshipStartDate: {
      type: Date,
    },
    internshipEndDate: {
      type: Date,
    },
    collegeName: {
      type: String,
    },
    timing: {
      type: String,
    },
    shedule: {
      type: String,
    },
    internshipHours: {
      type: Number,
    },
  },
  { timestamps: true },
);

const Certificate = mongoose.model("Certificate", certificateSchema);
export default Certificate;
