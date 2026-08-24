import { createPayment, getAllPayments, getPaymentById } from '../controllers/paymentController.js';
import { app } from '../app.js'

app.post('/payments', createPayment)

app.get('/payments', getAllPayments)

app.get('/payments/:id', getPaymentById)