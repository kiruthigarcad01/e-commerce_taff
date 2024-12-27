const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const registerUser = async (req, res) => {
  try {
    const { username, emailAddress, password, confirmPassword, age, dateOfBirth, country, phoneNumber, location } = req.body;

    if (!username || !emailAddress || !password || !age  || !dateOfBirth || !country || !phoneNumber || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.customer.findUnique({
      where: { emailAddress: emailAddress },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    const user = await prisma.customer.create({
      data: {
        username,
        emailAddress,
        password: hashedPassword,
        age,
        dateOfBirth: new Date(dateOfBirth),
        country,
        phoneNumber,
        location,
      },
    });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const loginUser = async (req, res) => {
    const { username, emailAddress, password } = req.body;
  
    if (!username || !emailAddress || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }
  
    try {
     
      if (username === 'admin' && emailAddress === 'admin@yahoo.com') {
       
        let admin = await prisma.admin.findUnique({
          where: { emailAddress }
        });
  
        
        if (!admin && password === 'admin@1234') {
          const hashedPassword = await bcrypt.hash(password, 10);
          admin = await prisma.admin.create({
            data: {
              username,
              emailAddress,
              password: hashedPassword
            }
          });
        } else if (admin) {
          
          const isValidAdmin = await bcrypt.compare(password, admin.password);
          if (!isValidAdmin) {
            return res.status(401).json({ error: 'Invalid credentials' });
          }
        }
  
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
          throw new Error('JWT_SECRET is not defined');
        }
  
        const token = jwt.sign({ id: admin.id }, jwtSecret, {
          expiresIn: '1h',
        });
  
        return res.json({ message: 'Admin login successful', token });
      }
  
      
      const user = await prisma.customer.findUnique({ where: { emailAddress } });
  
      if (!user) {
        return res.status(404).json({ error: 'Customer not found' });
      }
  
      const isValid = await bcrypt.compare(password, user.password);
  
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined');
      }
  
      const token = jwt.sign({ id: user.id, name: user.username }, jwtSecret, {
        expiresIn: '1h',
      });
  
      return res.json({ message: 'Customer login successful', token });
  
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Login failed', details: error.message });
    }
  };




module.exports = {
  registerUser,
  loginUser,
 
};