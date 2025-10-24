import WarehouseModel from "../model/warehouse.js";
import { validationResult } from "express-validator";

export const AddWarehouse=async(req, res) =>{
 try {
    console.log(req.body)
    const {
      WarehouseCompany_Name,
      WarehouseCompany_Address,
      WarehouseCompany_City,
      WarehouseCompany_State,
      WarehouseCompany_Pincode,
      WarehouseCompany_Contact,
      WarehouseCompany_Email,
      WarehouseCompany_GSTIN,
      WarehouseCompany_Type,
    } = req.body;

    console.log(req.user)

    const warehouse = new WarehouseModel({
      name: WarehouseCompany_Name,
      email: WarehouseCompany_Email,
      address: WarehouseCompany_Address,
      city: WarehouseCompany_City,
      state: WarehouseCompany_State,
      pincode: WarehouseCompany_Pincode,
      phone: WarehouseCompany_Contact,
      GSTIN: WarehouseCompany_GSTIN,
      type: WarehouseCompany_Type,
      user:req.user.id
      
    });

    await warehouse.save();

    res.status(201).json({ message: "Warehouse registered successfully", warehouse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server Error" });
  }

}



