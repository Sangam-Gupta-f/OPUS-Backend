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
    faterName: {
      type: String,
    },
    issuedDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
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
