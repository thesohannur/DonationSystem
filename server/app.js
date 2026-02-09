const express = require('express');
const cors    = require('cors');

const app = express();

app.use(cors({
  origin: "http://localhost:3002", // React dev server
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Request logger (middleware)
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});

app.get('/api/health', (req, res)=>{
    res.status(200).json({status: 'OK'});
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ error: err.message });
});

module.exports = app;