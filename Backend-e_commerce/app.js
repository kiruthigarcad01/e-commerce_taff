const express = require('express');
const app = express();
require('dotenv').config();
const authRoutes = require('./router/authRoutes');
const adminRoutes = require('./router/adminRoutes');
const customerRoutes = require('./router/customerRoutes');



app.use(express.json()); 

app.use('/api/auth', authRoutes);
app.use('/api/admin',adminRoutes)

app.use('/api/customers', customerRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
