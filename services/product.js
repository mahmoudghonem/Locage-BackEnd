const Product = require('../models/product');

const add = async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save()
    .then(result => res.json(result))
    .catch(error => res.status(400).json(error));
}

module.exports = {
    add
}