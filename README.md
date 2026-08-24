# Payment Processor API 💳

A payment processing simulation API built with **Node.js, Express.js, and MySQL**.

The system allows customers to be created and payments to be processed using predefined test cards. Each transaction is validated against the card's status and available balance before being marked as successful or failed.

This project simulates the core backend logic behind a payment processing system without processing real money or connecting to banking networks.

## Features

- Customer creation
- Unique customer ID generation
- Retrieve customers by ID
- Payment creation and processing
- Unique payment ID generation
- Test card validation
- Card status checking
- Card balance verification
- Automatic balance deduction after successful payments
- Successful and failed transaction tracking
- Card last-four-digit storage
- Payment lookup by ID
- Complete transaction history
- MySQL database persistence
- API error handling

## Tech Stack

- **Node.js** — JavaScript runtime
- **Express.js** — Backend framework
- **MySQL** — Relational database
- **mysql2** — MySQL driver
- **dotenv** — Environment variable management

## Project Structure

```text id="7b9hgf"
payment-processor/
│
├── src/
│   ├── app.js
│   ├── db.js
│   └── server.js
│
├── routes/
│   ├── customerRoutes.js
│   └── paymentRoutes.js
│
├── controllers/
│   ├── customerController.js
│   └── paymentController.js
│
├── models/
│   ├── customerModel.js
│   └── paymentModel.js
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

## API Endpoints

### Customers

| Method | Endpoint                  | Description               |
| ------ | ------------------------- | ------------------------- |
| `POST` | `/customers`              | Create a new customer     |
| `GET`  | `/customers/:customer_id` | Retrieve a customer by ID |

### Payments

| Method | Endpoint        | Description                  |
| ------ | --------------- | ---------------------------- |
| `POST` | `/payments`     | Create and process a payment |
| `GET`  | `/payments`     | Retrieve all transactions    |
| `GET`  | `/payments/:id` | Retrieve a payment by its ID |

## Creating a Customer

### Request

```http id="76opcw"
POST /customers
Content-Type: application/json
```

```json id="zzf5ho"
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Response

```json id="tgkp54"
{
  "customer_id": "a8X91k",
  "customer_name": "John Doe",
  "customer_email": "john@example.com"
}
```

Each customer receives a randomly generated unique identifier.

The API also prevents multiple customers from registering with the same email address.

## Creating a Payment

### Request

```http id="ml58js"
POST /payments
Content-Type: application/json
```

```json id="g4p10n"
{
  "customer": "a8X91k",
  "card": "4242424242424242",
  "amount": 499
}
```

The processor then validates the transaction before completing it.

## Payment Processing Flow

```text id="l4uec7"
Payment Request
      │
      ▼
Validate Customer
      │
      ▼
Find Test Card
      │
      ▼
Check Card Status
      │
      ▼
Check Available Balance
      │
      ├──── Invalid / Expired ────► Failed
      │
      ├──── Insufficient Balance ─► Failed
      │
      ▼
Payment Successful
      │
      ▼
Store Transaction
      │
      ▼
Deduct Card Balance
```

Payments are processed immediately rather than using an asynchronous pending state.

## Test Card System

Cards are predefined inside the database and contain information such as:

```text id="r8mqva"
card_number
card_balance
card_status
```

During payment processing, the API retrieves the submitted card and checks its current state.

A payment can fail when:

- The card does not exist
- The card is invalid
- The card is expired
- The card has insufficient balance

If all checks pass, the transaction succeeds and the payment amount is deducted from the card's available balance.

## Transaction Records

Both successful and failed payment attempts are stored in the `payments` table.

A transaction contains information such as:

```text id="cif2dg"
payment_id
customer_id
payment_amount
card
status
```

Only the **last four digits** of the submitted card are stored with the payment rather than the complete card number.

Example:

```json id="o68k82"
{
  "payment_id": "K9x82LmPq1",
  "customer_id": "a8X91k",
  "payment_amount": 499,
  "card": "4242",
  "status": "Success"
}
```

## Transaction History

All recorded transactions can be retrieved using:

```http id="72nuea"
GET /payments
```

This includes both successful and failed payment attempts.

Individual transactions can be retrieved using:

```http id="iz9whs"
GET /payments/:id
```

## Payment IDs

Every payment receives a randomly generated 10-character identifier.

Example:

```text id="fypvws"
K9x82LmPq1
```

This ID can later be used to retrieve the transaction.

## Error Handling

The API returns appropriate errors for situations such as:

```json id="1e7tbj"
{
  "error": "Customer with that ID is not found"
}
```

Other handled cases include:

- Duplicate customer emails
- Unknown customers
- Unknown cards
- Invalid cards
- Expired cards
- Insufficient card balance
- Unknown payment IDs
- Internal server errors

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database
```

## Running the Project

Install dependencies:

```bash
npm install
```

Start the server:

```bash
node --watch src/server.js
```

The API will then be ready to receive requests through tools such as Postman.

## Disclaimer

This project is a **payment processing simulator built for educational and development purposes**.

It does not process real payments, communicate with banks, or use real card information.
