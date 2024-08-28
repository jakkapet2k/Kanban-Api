const pool = require('../config/db');

// Create a new column
exports.createColumn = async (req, res) => {
    const { title, board_id } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO columns (title, board_id) VALUES ($1, $2) RETURNING *',
            [title, board_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

// Get all columns
exports.getAllColumns = async (req, res) => {

    try {
        const result = await pool.query('SELECT columns.*,boards.name FROM columns INNER JOIN boards ON  boards.id = columns.board_id ');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

// Get a single column by ID
exports.getColumnById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT columns.*,boards.name FROM columns INNER JOIN boards ON  boards.id = columns.board_id id = $1', [id]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

// Update a column by ID
exports.updateColumn = async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    try {
        const result = await pool.query(
            'UPDATE columns SET title = $1 WHERE id = $2 RETURNING *',
            [title, id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

// Delete a column by ID
exports.deleteColumn = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM columns WHERE id = $1 RETURNING *', [id]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};
