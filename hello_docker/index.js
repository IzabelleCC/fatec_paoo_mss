const express = require('express');
const app = express();
app.use(express.json());

app.get('/hey-docker', (req, res) => {
    res.status(200).json({ 
        message: 'Hello Docker!'
    });
});

app.listen(200, () => {
    console.log('up and running inside Docker');
});