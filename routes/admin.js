const express = require('express');
const router = express.Router();
const adminUserRouter = require('./admin/usersAdmin');
const adminStaffRouter = require('./admin/staffAdmin');
const adminVendorRouter = require('./admin/vendorAdmin');
const adminDiscountRouter = require('./admin/discount');

// TODO: Track and Management OF all Orders (Single and Multi Select) and Get Summaries
/*
Ordered Product Detail
You Receive a Summary of the Product ordered by your Customers with 
Multiple Product Name, Quantity, price, Taxes, Total Amount, Inventory, SKU etc...
/Customer Details 
Customer Summary shows your Customers Name, Shipping and Billing Address,
Email and Mobile Number. Customers can Create an Account to automate future transactions 
/Payment and Fulfillment 
You Can view the Payment Details with your preferred payment methods
and know have you received the payment or the payment is pending.
You Can easily fulfil the orders with partnered couriers by adding the tracking numbers or ship on your own
/Create Draft Orders 
Create Draft orders directly from your E commerce Admin Panel.
Manually Create Customers Orders with they're Requirements and Send an email orders to customers
to Order it and process the payment.
/Abandoned checkouts
Track Abandoned Checkouts using your Admin Panel.
As a Customers Creates and orders and leaves without Completing the order.
you Can view the Customers Details to Reach them to complete their orders.
*/
// TODO: Track and Management OF all Products (Single and Multi Select) (Delete) and Get Summaries  (Why Admin Edit Store Products)
// TODO: Track and Management of all Discount Codes
// TODO: Track and Management of all Compliments 
// TODO: Analytics

// MAIN REQUIREMENTS Manage Users
router.use(adminUserRouter);

router.use(adminStaffRouter);

router.use(adminVendorRouter);

router.use(adminDiscountRouter);




module.exports = router;