const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

// In-memory "database" (for demonstration only)
const users = [];

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Registration endpoint
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Check if user already exists
        if (users.find(user => user.username === username)) {
            return res.status(400).send('User already exists');
        }
        
        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Store user
        users.push({ username, password: hashedPassword });
        
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(500).send('Error registering user');
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Find user
        const user = users.find(user => user.username === username);
        if (!user) {
            return res.status(401).send('Invalid credentials');
        }
        
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Invalid credentials');
        }
        
        res.send('Login successful');
    } catch (error) {
        res.status(500).send('Error during login');
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});