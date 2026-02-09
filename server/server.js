require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Immediately Invoked Function Expression
(async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log('Server is running on port', PORT);
    })
})();