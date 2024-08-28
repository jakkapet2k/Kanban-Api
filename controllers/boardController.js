const pool = require('../config/db');
const authenUtil = require('../util/authenUtil')

// Create a new board
exports.createBoard = async (req, res) => {
    const { name, user_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO boards (name, user_id) VALUES ($1, $2) RETURNING *',
            [name, user_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

// Get all boards
exports.getAllBoards = async (req, res) => {
    const authenCheck = authenUtil.checkAuthentication(req);
	const userId = authenCheck.id;
    console.log('userId',userId);
    
    try {
        const result = await pool.query('SELECT * FROM boards WHERE user_id=$1',[userId]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

// Get a single board by ID
exports.getBoardById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM boards WHERE id = $1', [id]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

// Update a board by ID
exports.updateBoard = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const result = await pool.query(
            'UPDATE boards SET name = $1 WHERE id = $2 RETURNING *',
            [name, id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

// Delete a board by ID
exports.deleteBoard = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM boards WHERE id = $1 RETURNING *', [id]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};
