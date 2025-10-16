const helmet = require('helmet');
const compression = require('compression');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const cookieParser = require("cookie-parser");

const userRoutes = require('./routes/users');

require('dotenv').config();
const app = express();

const allowedOrigins = [
    process.env.CLIENT_URL,
];



// app.use(cors({
//     origin: function (origin, callback) {
//         // Allow requests with no origin (like mobile apps, curl, Postman)
//         if (!origin) return callback(null, true);
//         if (allowedOrigins.includes(origin)) {
//             return callback(null, true);
//         } else {
//             return callback(new Error('Not allowed by CORS'));
//         }
//     },
//     credentials: true
// }));

app.use(cors({
  origin: '*', // allow all
}));
// app.set('trust proxy', true);

app.use((req, res, next) => {
  const xff = req.headers['x-forwarded-for'];
  const ip = xff ? xff.split(',')[0].trim() : req.ip;
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} from ${ip} UA=${req.headers['user-agent']}`);
  next();
});

app.use(helmet());
app.use(bodyParser.json());
app.use(compression());
app.use(cookieParser());


// Database
connectDB();

// Routes
app.use('/v0/users', userRoutes);

app.get('/', (req, res) => {
    console.log('Root endpoint hit');
    return res.status(200).send('Ride Karo API is running...');
});

const PORT = process.env.PORT || 400;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
