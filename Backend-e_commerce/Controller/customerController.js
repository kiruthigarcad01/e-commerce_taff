const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const browseProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error browsing products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const addToCart = async (req, res) => {
  const { productId, quantity, customerId } = req.body;  
  if (!productId || !quantity || !customerId) {
      return res.status(400).json({ message: 'Product ID, quantity, and customer ID are required' });
  }

  try {
      const product = await prisma.product.findUnique({
          where: { id: parseInt(productId) },
      });

      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      let cart = await prisma.cart.findUnique({
          where: { customerId: customerId },
      });

      if (!cart) {
          cart = await prisma.cart.create({
              data: { customerId: customerId },
          });
      }

      const cartItem = await prisma.cartItem.create({
          data: {
              cartId: cart.id,
              productId: parseInt(productId),
              quantity: quantity,
          },
      });

      res.status(201).json({ message: 'Product added to cart', cartItem });
  } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

const viewCart = async (req, res) => {
  const { customerId } = req.body; 

  if (!customerId) {
      return res.status(400).json({ message: 'Customer ID is required' });
  }

  try {
      const cart = await prisma.cart.findUnique({
          where: { customerId: customerId },
          include: { items: { include: { product: true } } },
      });

      if (!cart) {
          return res.status(404).json({ message: 'Cart not found' });
      }

      res.status(200).json(cart.items);  
  } catch (error) {
      console.error('Error viewing cart:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};



const removeFromCart = async (req, res) => {
  const { cartItemId, customerId } = req.body; 

  if (!cartItemId || !customerId) {
      return res.status(400).json({ message: 'Cart item ID and customer ID are required' });
  }

  try {
      const cartItem = await prisma.cartItem.findUnique({
          where: { id: parseInt(cartItemId) },
      });

      if (!cartItem) {
          return res.status(404).json({ message: 'Cart item not found' });
      }

      const cart = await prisma.cart.findUnique({
          where: { id: cartItem.cartId },
      });

      if (cart.customerId !== customerId) {
          return res.status(403).json({ message: 'You do not have permission to remove this item' });
      }

      await prisma.cartItem.delete({
          where: { id: parseInt(cartItemId) },
      });

      res.status(200).json({ message: 'Product removed from cart' });
  } catch (error) {
      console.error('Error removing from cart:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

const addToWishlist = async (req, res) => {
  const { productId, customerId } = req.body;

  if (!productId || !customerId) {
      return res.status(400).json({ message: 'Product ID and Customer ID are required' });
  }

  try {
      const product = await prisma.product.findUnique({
          where: { id: parseInt(productId) },
      });

      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      const existingWishlist = await prisma.wishlist.findUnique({
          where: { customerId_productId: { customerId: customerId, productId: parseInt(productId) } },
      });

      if (existingWishlist) {
          return res.status(409).json({ message: 'Product already in wishlist' });
      }

      const wishlist = await prisma.wishlist.create({
          data: {
              customerId: customerId,
              productId: parseInt(productId),
          },
      });

      res.status(201).json({ message: 'Product added to wishlist', wishlist });
  } catch (error) {
      console.error('Error adding to wishlist:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

const checkout = async (req, res) => {
  const { customerId } = req.body;

  try {
    
    const cart = await prisma.cart.findUnique({
      where: { customerId: customerId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    
    const order = await prisma.order.create({
      data: {
        customerId: customerId,
        products: {  
          create: cart.items.map(item => ({
            product: {  
              connect: { id: item.productId }
            }
          })),
        },
      },
      include: {  
        products: {
          include: {
            product: true
          }
        }
      }
    });

    
    await prisma.cart.update({
      where: { customerId: customerId },
      data: { items: { deleteMany: {} } },
    });

    res.status(201).json({ 
      message: 'Checkout successful', 
      order 
    });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message 
    });
  }
};

module.exports = { browseProducts, addToCart, viewCart, removeFromCart, addToWishlist, checkout };

  
  
