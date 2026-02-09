const express = require('express');

const app = express();

app.use(express.json());

app.get('/api/health', (req, res)=>{
    res.status(200).json({status: 'OK'});
});

app.use((err, req, res, next)=> {
    res.status(500).json({error: err.message});
})

module.exports = app;