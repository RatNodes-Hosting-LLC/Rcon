const express = require('express');
const bodyParser = require('body-parser');
const Rcon = require('rcon-client').Rcon;
require('dotenv').config(); // Load .env file

const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

const rconConfig = {
    host: process.env.RCON_HOST,
    port: process.env.RCON_PORT,
    password: process.env.RCON_PASSWORD
};

// Serve index.html at the root
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/rcon', async (req, res) => {
    const { command } = req.body;

    try {
        const rcon = await Rcon.connect(rconConfig);
        const response = await rcon.send(command);
        rcon.end();
        res.json({ result: response });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
