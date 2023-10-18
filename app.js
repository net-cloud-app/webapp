const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/assignments'));
app.use('/', require('./routes/health'));
app.use('/api', require('./routes/users'));
app.use('/api', require('./routes/users'));




// Starting server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Loading users from CSV file
const fs = require('fs');
const csv = require('csv-parser');
const User = require('./models/User');
const bcrypt = require('bcrypt');

fs.createReadStream('./opt/user.csv')
  .pipe(csv())
  .on('data', async (row) => {
    try {
      const existingUser = await User.findOne({ where: { email: row.email } });

      if (!existingUser) {
        await User.create({
          email: row.email,
          password: bcrypt.hashSync(row.password, 10),
        });
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  })
  .on('end', () => {
    console.log('Users loaded from CSV');
  });

  module.exports = app;

  // testing again 11234567121213131311


  // const express = require('express');
  // const bodyParser = require('body-parser');
  // const { Sequelize, DataTypes } = require('sequelize'); // Import DataTypes from Sequelize
  
  // const app = express();
  // const PORT = process.env.PORT || 3000;
  
  // // Middleware
  // app.use(bodyParser.json());
  
  // // Sequelize configuration
  // const sequelize = new Sequelize({
  //   username: 'root',
  //   password: 'password',
  //   host: '127.0.0.1',
  //   dialect: 'mysql',
  // });
  
  // // Define a model for your database
  // const Assignment = sequelize.define('Assignment', {
  //   title: {
  //     type: DataTypes.STRING, // Use DataTypes here
  //     allowNull: false,
  //   },
  //   description: {
  //     type: DataTypes.TEXT, // Use DataTypes here
  //     allowNull: false,
  //   },
  //   // ... other fields ...
  // });
  
  // // Check if the database exists, and create it if it doesn't
  // sequelize.query('CREATE DATABASE IF NOT EXISTS db1')
  //   .then(() => {
  //     console.log('Database db1 created or already exists');
  //     return sequelize.sync();
  //   })
  //   .then(() => {
  //     console.log('Database synchronized with models');
  //   })
  //   .catch((error) => {
  //     console.error('Database setup error:', error);
  //   });
  
  // // Routes
  // app.use('/auth', require('./routes/auth'));
  // app.use('/api', require('./routes/assignments'));
  // app.use('/', require('./routes/health'));
  // app.use('/api', require('./routes/users'));
  
  // // Starting server
  // app.listen(PORT, () => {
  //   console.log(`Server is running on port ${PORT}`);
  // });
  
  // // Loading users from CSV file
  // const fs = require('fs');
  // const csv = require('csv-parser');
  // const User = require('./models/User');
  // const bcrypt = require('bcrypt');
  
  // fs.createReadStream('./opt/user.csv')
  //   .pipe(csv())
  //   .on('data', async (row) => {
  //     try {
  //       const existingUser = await User.findOne({ where: { email: row.email } });
  
  //       if (!existingUser) {
  //         await User.create({
  //           email: row.email,
  //           password: bcrypt.hashSync(row.password, 10),
  //         });
  //       }
  //     } catch (error) {
  //       console.error('Error creating user:', error);
  //     }
  //   })
  //   .on('end', () => {
  //     console.log('Users loaded from CSV');
  //   });
  

  //   module.exports = app;
