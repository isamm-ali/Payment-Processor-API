import { db } from '../db.js';
import { customerIdGenerator } from '../models/customerModel.js';

export const createCustomer = async (req, res) => {
    try {
        const customer_name = req.body.name;
        const customer_email = req.body.email;
        const [row] = await db.execute(`select customer_email from customers where customer_email = ?`, [customer_email]);
        if ( row.length > 0 ) {     
            return res.status(400).json({ error: "Customer with that email already exists" });
        }
        const customer_id = customerIdGenerator(); 
        await db.execute(`insert into customers (customer_id, customer_name, customer_email) values (?, ?, ?)`, [customer_id, customer_name, customer_email]);
        return res.status(201).json({
            customer_id,
            customer_name,
            customer_email
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}

export const getCustomerById = async (req, res) => {
    try {
        const customer_id = req.params.customer_id;
        const [row] = await db.execute(`select customer_id, customer_name, customer_email from customers where customer_id = ?`,[customer_id]);
        if ( row.length == 0 ) {     
            return res.status(404).json({
                error: "Customer with that ID does not exist" 
            });
        }
        return res.status(200).json(row[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}