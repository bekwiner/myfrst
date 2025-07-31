import mongoose from 'mongoose';

const clientRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  region: { type: String },
  comment: { type: String },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
}, { timestamps: true });

const ClientRequest = mongoose.model('ClientRequest', clientRequestSchema);
export default ClientRequest;
