import mongoose from "mongoose";

const ClientVisit = new mongoose.Schema(
  {
    ClientName: {
      type: String,
      required: true,
    },
    ClientAddress: {
      type: String,
      required: true,
    },
    ClientPhone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
    },
    ClientEmail: {
      type: String,
      required: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "warehouseModel",
      required: true,
    },
  },
  { timestamps: true }
);

const ClientVisitModel = mongoose.model("ClientVisit", ClientVisit);
export default ClientVisitModel;
