const express = require('express')

const router = express.Router();

const { browseProducts, addToCart, viewCart,
   removeFromCart, addToWishlist, checkout } = require('../Controller/customerController');  
  

  router.get('/getproducts', browseProducts);
  router.post('/cart/add', addToCart);
  router.get('/viewcart', viewCart);
  router.delete('/cart/remove', removeFromCart);
  router.post('/wishlist/add', addToWishlist);
  router.post('/cart/checkout', checkout);
  

module.exports = router;
