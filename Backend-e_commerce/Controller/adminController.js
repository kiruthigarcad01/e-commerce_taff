const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const addProduct = async (req, res) => {
    const { name, description, category, price, rating, seller, stock, imageUrl } = req.body;
    const adminId = req.adminId;
  
    
    if (!name || !description || !category || !price || !rating || !seller || !stock || !imageUrl || !adminId) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        
        const newProduct = await prisma.product.create({
            data: {
              name,
              description,
              category,
              price,
              rating,
              seller,
              stock,
              imageUrl,
              admin: {
                connect: {
                  id : adminId
                },
              }
            }
          });
          
        console.log('Product added:', newProduct);  
        res.status(201).json({ message: 'Product added successfully', product: newProduct });  
    } catch (error) {
        console.error('Error adding product:', error);  
        res.status(500).json({ message: 'Internal server error' });  
    }
};

const editProduct = async (req, res) => {
  const { id } = req.params; 
  const { name, description, category, price, rating, seller, stock, imageUrl } = req.body;
  const adminId = req.adminId;

  if (!id || !adminId) {
      return res.status(400).json({ message: 'Product ID and admin ID are required' });
  }

  try {
      
      const product = await prisma.product.findUnique({
          where: { id: parseInt(id) },
      });

      if (!product || product.adminId !== adminId) {
          return res.status(403).json({ message: 'Unauthorized to edit this product' });
      }

      
      const updatedProduct = await prisma.product.update({
          where: { id: parseInt(id) },
          data: { name, description, category, price, rating, seller, stock, imageUrl },
      });

      console.log('Product updated:', updatedProduct);
      res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};


const deleteProduct = async (req, res) => {
  const { id } = req.params; 
  const adminId = req.adminId;

  if (!id || !adminId) {
      return res.status(400).json({ message: 'Product ID and admin ID are required' });
  }

  try {
      
      const product = await prisma.product.findUnique({
          where: { id: parseInt(id) },
      });

      if (!product || product.adminId !== adminId) {
          return res.status(403).json({ message: 'Unauthorized to delete this product' });
      }

      
      await prisma.product.delete({
          where: { id: parseInt(id) },
      });

      console.log('Product deleted:', id);
      res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = { addProduct,editProduct,deleteProduct};  
