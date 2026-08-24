import { db } from "../db.js";
import { paymentIdGenerator } from '../models/paymentModel.js';

export const createPayment = async (req, res) => {
  try {
    const payment_id = paymentIdGenerator();
    const customer_id = req.body.customer;
    const card_number = req.body.card;
    const payment_amount = req.body.amount;
    const [row1] = await db.execute(
      `select * from customers where customer_id = ?`,
      [customer_id],
    );
    if (row1.length == 0) {
      return res
        .status(404)
        .json({ error: "Customer with that ID is not found" });
    }
    const [row2] = await db.execute(
      `select * from cards where card_number = ?`,
      [card_number],
    );
    if (row2.length == 0) {
      await db.execute(
        `insert into payments (payment_id, customer_id, payment_amount, card, status) values (?, ?, ?, ?, ?)`,
        [
          payment_id,
          customer_id,
          payment_amount,
          card_number.slice(-4),
          "Failed",
        ],
      );
      return res
        .status(404)
        .json({ error: "Card with that number is not found" });
    }
    if (
      row2[0].card_status === "invalid" ||
      row2[0].card_status === "expired"
    ) {
      await db.execute(
        `insert into payments (payment_id, customer_id, payment_amount, card, status) values (?, ?, ?, ?, ?)`,
        [
          payment_id,
          customer_id,
          payment_amount,
          card_number.slice(-4),
          "Failed",
        ],
      );
      return res.status(400).json({ error: "The card is Invalid or Expired" });
    }
    if (row2[0].card_balance < payment_amount) {
      await db.execute(
        `insert into payments (payment_id, customer_id, payment_amount, card, status) values (?, ?, ?, ?, ?)`,
        [
          payment_id,
          customer_id,
          payment_amount,
          card_number.slice(-4),
          "Failed",
        ],
      );
      return res.status(400).json({ error: "Insufficient Balance" });
    }
    await db.execute(
      `insert into payments (payment_id, customer_id, payment_amount, card, status) values (?, ?, ?, ?, ?)`,
      [
        payment_id,
        customer_id,
        payment_amount,
        card_number.slice(-4),
        "Success",
      ],
    );
    await db.execute(
      `update cards set card_balance = card_balance - ? where card_number = ?`,
      [payment_amount, card_number],
    );
    return res.status(201).json({
      payment_id,
      customer_id,
      payment_amount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const [rows] = await db.execute(`select * from payments`);
    return res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const payment_id = req.params.id;
    const [row] = await db.execute(
      `select * from payments where payment_id = ?`,
      [payment_id],
    );
    if (row.length === 0) {
      return res.status(404).json({
        error: "Payment with that ID does not exist",
      });
    }
    return res.status(200).json(row[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
