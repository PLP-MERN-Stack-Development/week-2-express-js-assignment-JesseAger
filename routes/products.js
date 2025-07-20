const express = require('express');
const { v4: uuidv4 } = require('uuid');
const products = require('../data/products');
const auth = require('../middleware/auth');
const validateProduct = require('../middleware/validateProduct');
const NotFoundError = require('../errors/NotFoundError');

const router = express.Router();

// Filter, Pagination, Search
router.get('/', auth, (req, res) => {
    const { category, page = 1, limit = 5 } = req.query;
    let results = products;

    if (category) {
        results = results.filter(p => p.category === category);
    }

    const start = (page - 1) * limit;
    const paginated = results.slice(start, start + parseInt(limit));
    res.json(paginated);
});

router.get('/search', auth, (req, res) => {
    const q = req.query.q?.toLowerCase();
    if (!q) return res.json([]);
    const filtered = products.filter(p => p.name.toLowerCase().includes(q));
    res.json(filtered);
});

router.get('/stats', (req, res) => {
    const count = {};
    products.forEach(p => {
        count[p.category] = (count[p.category] || 0) + 1;
    });
    res.json(count);
});

router.get('/:id', (req, res, next) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) return next(new NotFoundError('Product not found'));
    res.json(product);
});

router.post('/', auth, validateProduct, (req, res) => {
    const newProduct = { id: uuidv4(), ...req.body };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

router.put('/:id', auth, validateProduct, (req, res, next) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) return next(new NotFoundError('Product not found'));
    products[index] = { ...products[index], ...req.body };
    res.json(products[index]);
});

router.delete('/:id', auth, (req, res, next) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) return next(new NotFoundError('Product not found'));
    const deleted = products.splice(index, 1);
    res.json(deleted[0]);
});

module.exports = router;
