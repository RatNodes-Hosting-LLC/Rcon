require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Rcon = require('rcon-client').Rcon;

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

// RCON connection settings
const rconOptions = {
    host: process.env.RCON_HOST,
    port: process.env.RCON_PORT,
    password: process.env.RCON_PASSWORD
};

// Establish RCON connection
let rcon;

async function connectRcon() {
    rcon = new Rcon(rconOptions);
    try {
        await rcon.connect();
        console.log('RCON connected successfully');
    } catch (error) {
        console.error('RCON connection error:', error);
    }
}

// API endpoint to handle RCON commands
app.post('/rcon', async (req, res) => {
    const { command } = req.body;
    
    if (!command) {
        return res.status(400).json({ error: 'Command is required' });
    }

    try {
        const result = await rcon.send(command);
        res.json({ result });
    } catch (error) {
        console.error('Error executing command:', error);
        res.status(500).json({ error: 'Failed to execute command' });
    }
});

// Graceful shutdown
process.on('SIGINT', async () => {
    if (rcon) {
        await rcon.disconnect();
        console.log('RCON disconnected');
    }
    process.exit();
});

// Start the server
app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    await connectRcon();
});
