import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  companyId: {
    type: String,
    required: true,
    unique: true,
    default: function () {
      return 'C' + Date.now().toString().slice(-6);
    }
  },
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  contact: {
    type: String,
    required: [true, 'Contact person is required']
  },
  type: {
    type: String,
    required: [true, 'Company type is required'],
    enum: ['Technology', 'Retail', 'Manufacturing', 'Healthcare', 'Food & Beverage', 'Other']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  GSTIN: {
    type: String,
    trim: true
  },
  document: {
    type: String, // File path
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",  // <- foreign key points to User model
      required: true
    },});

// Update the updatedAt field before saving
companySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Company', companySchema);
