const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;
const sequelize = require('./config/database'); // Import the Sequelize instance
const StatsD = require('node-statsd');

const winston = require('winston');




// winston.configure({
//   level: 'info', // Logging level
//   format: winston.format.simple(), // Simple log format
//   transports: [
//     new winston.transports.File({ filename: 'app.log' }) // Log to a file
//   ]
// });


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamp to log messages
    winston.format.simple()
  ),
  transports: [
    new winston.transports.File({ filename: 'app.log' })
  ]
});

module.exports.logger = logger;

const statsd = new StatsD({
  host: 'localhost', // Replace with your StatsD server host
  port: 8125, // Replace with your StatsD server port
});



// Middleware
app.use(bodyParser.json());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/assignments'));
app.use('/', require('./routes/health'));
app.use('/api', require('./routes/users'));

// Start your server after the database connection is established
const initDatabase = async () => {
  const sequelize = require('./config/database'); // Import the Sequelize instance
  try {
    // Sync the database to create tables based on your model definitions
    await sequelize.sync({ alter: true });
    console.log('Database synchronized. Starting server...');
    startServer();
  } catch (error) {
    console.error('Unable to sync database:', error);
  }
};

app.use((req, res, next) => {
  logger.info(`Request to ${req.method} ${req.path}`);
  statsd.increment('request.total');
  next();
});


// Starting server
const startServer = () => {
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    statsd.increment('Server.run');
    console.log(`Server is running on port ${PORT}`);
  });
};

// Load users from CSV and start the database initialization
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
    // After loading users from CSV, initialize the database and start the server
    initDatabase();
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
