import mongoose, { Schema } from 'mongoose';

const ContactSchema = new Schema({
	name: { type: String, trim: true, maxlength: 80 },
	email: { type: String, trim: true, maxlength: 120 },
	message: { type: String, required: true, trim: true, maxlength: 280 },
	ip: { type: String, index: true },
	ua: { type: String },
	createdAt: { type: Date, default: Date.now, index: true },
	// honeypot field to catch bots
	website: { type: String, default: '' },
});

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
