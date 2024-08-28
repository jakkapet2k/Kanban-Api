const AuthenUtil = require('../util/authenUtil');
const pool = require('../config/db'); // Assuming you're using a pool for database connections
const bcrypt = require('bcrypt');

// Function for user login
exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Query to get user details
        const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        if (user.status === 0) {
            return res.status(403).json({ 
                error: 'User has been deactivated', 
                status: 'deactivated' 
            });
        }

        const payload = {
            id: user.id,
            username: user.username,
        };

        const accessToken = AuthenUtil.getGenerateAccessToken(payload);

        res.json({
            accessToken,
            userId: user.id,
            username: user.username,
        });
    } catch (err) {
        console.error('Login error:', err); // Log error for debugging
        res.status(500).json({ error: 'An internal error occurred' });
    }
};



// Function for user registration
exports.register = async (req, res) => {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ error: 'Username, password, and email are required' });
    }

    try {
        // Check if user already exists
        const { rows: existingUser } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (existingUser.length > 0) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        const { rows: result } = await pool.query(
            'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *',
            [username, hashedPassword, email]
        );
        
        console.log('User inserted:', result);

        const newUser = result[0];

        // Generate an access token (optional, if you want to log the user in immediately)
        const payload = {
            id: newUser.id,
            username: newUser.username,
        };
        const accessToken = AuthenUtil.getGenerateAccessToken(payload);

        res.status(201).json({
            accessToken,
            userId: newUser.id,
            username: newUser.username,
        });
    } catch (err) {
        console.error('Registration error:', err); // Log error for debugging
        res.status(500).json({ error: 'An internal error occurred' });
    }
};
