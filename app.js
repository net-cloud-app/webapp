const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
const sequelize = require('./config/database'); // Import the Sequelize instance


// Middleware
app.use(bodyParser.json());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/assignments'));
app.use('/', require('./routes/health'));
app.use('/api', require('./routes/users'));

// Start your server after the database connection is established
const startServer = async () => {
  try {
    await sequelize.sync({ alter: true }); // This will create or update tables based on your model definitions
    console.log('Database synchronized. Starting server...');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to sync database:', error);
  }
};

startServer();

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


// Call the function to start the server and perform migrations

// const express = require('express');
// const bodyParser = require('body-parser');
// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(bodyParser.json());

// // Routes
// app.use('/auth', require('./routes/auth'));
// app.use('/api', require('./routes/assignments'));
// app.use('/', require('./routes/health'));
// app.use('/api', require('./routes/users'));
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
