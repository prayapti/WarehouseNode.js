// Utilities&MiddleWare/fileUpload.js
import multer from "multer";
import path from "path";

// File storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // uploads folder aapke project root me
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

// Filter to accept only PDF/DOC/DOCX
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf" || 
      file.mimetype === "application/msword" || 
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF/DOC/DOCX files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB max
});

export default upload;
