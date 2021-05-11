const express = require('express');
const router = express.Router();




router.use('/', (req, res) => {
    res.send("Hello to Logace Ecommerce REST APIS, The Backend is under development")
});
module.exports = router;