const pool = require('../config/db');
const authenUtil = require('../util/authenUtil')

exports.inviteMember = async (req, res) => {
    const { boardId, email } = req.body;
    const payload = {
        boardId,
        email,
    };
    const token = authenUtil.getGenerateAccessToken(payload); // Function to generate a unique token

    try {
        // Check if user already has an account
        const user = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

        if (user.rows.length > 0) {
            // User exists, add directly to board
            await pool.query('INSERT INTO board_members (board_id, user_id) VALUES ($1, $2)', [boardId, user.rows[0].id]);
        } else {
            // User does not exist, create an invitation
            await pool.query('INSERT INTO invitations (board_id, email, token, status) VALUES ($1, $2, $3, $4)', [boardId, email, token, 'pending']);
            // Send email with invitation link including token
        }

        res.status(200).json({ message: 'Invitation sent!' });
    } catch (error) {
        console.error("Error inviting member", error);
        res.status(500).json({ error: 'Failed to send invitation' });
    }
};

exports.getBoardMembers = async (req, res) => {

    try {
        // Fetch members based on board ID
        const result = await pool.query('SELECT board_members.*,boards.name, users.email FROM board_members JOIN users ON board_members.user_id = users.id  INNER JOIN boards ON board_members.board_id = boards.id');
        
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching board members", error);
        res.status(500).json({ error: 'Failed to fetch board members' });
    }
};