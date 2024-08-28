const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/routes');
const { middleWare } = require('./routes/middleware');

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
    origin: '*', // Replace with the URL of the frontend app or a list of URLs
    methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(middleWare);

// Routes
app.use('/api', routes);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
