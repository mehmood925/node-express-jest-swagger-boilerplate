import mongoose from 'mongoose'

const customerInvoiceSchema = new mongoose.Schema({
    customerID: { type: String, require: true },
    customerEmail: { type: String, require: true },
    customerName: { type: String, require: true },
    invoiceAmount: { type: Number, require: true },
    isPaid: { type: Boolean, default: false, require: true },
});

const customerInvoice = mongoose.model('customerInvoices', customerInvoiceSchema);

export default customerInvoice; 