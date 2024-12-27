const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middleware/auth'); 
const { addProduct } = require('../Controller/adminController'); 
const {editProduct } = require('../Controller/adminController')
const { deleteProduct} = require('../Controller/adminController')


router.post('/addProduct', verifyAdmin, addProduct);
router.put('/products/:id', verifyAdmin, editProduct);
router.delete('/products/:id', verifyAdmin, deleteProduct);

module.exports = router;
