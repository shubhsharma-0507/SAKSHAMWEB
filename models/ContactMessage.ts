import mongoose, { Schema } from 'mongoose';

const ContactMessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
    topic: { type: String, default: 'general' },
    message: { type: String, required: true, maxlength: 4000 },
  },
  { timestamps: true }
);

export const ContactMessage =
  mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema);
export default ContactMessage;
