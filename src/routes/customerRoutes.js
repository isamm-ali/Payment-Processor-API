import { createCustomer, getCustomerById } from '../controllers/customerController.js';
import { app } from '../app.js'

app.post('/customers', createCustomer);

app.get('/customers/:customer_id', getCustomerById)