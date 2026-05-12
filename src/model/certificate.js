// Certificate model
import mongoose from "mongoose";
const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
    },
    enrollmentNumber: {
      type: String,
      required: true,
    },
    rollNumber: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    faterName: {
      type: String,
    },
    issuedDate: {
      type: Date,
      default: Date.now,
    },
    course: {
      type: String,
    },
    semester: {
      type: String,
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
  },
  { timestamps: true },
);

const Certificate = mongoose.model("Certificate", certificateSchema);
export default Certificate;
