const pool = require('../config/db');

// Create a new task

exports.createTask = async (req, res) => {
    const { content, description, column_id, tags = [] } = req.body;

    try {
        // Insert the task
        const taskResult = await pool.query(
            'INSERT INTO tasks (content, description, column_id) VALUES ($1, $2, $3) RETURNING *',
            [content, description, column_id]
        );
        const task = taskResult.rows[0];

        // Insert tags and associate them with the task
        const tagIds = [];
        for (const tag of tags) {
            // Insert the tag if it doesn't exist
            const tagResult = await pool.query(
                'INSERT INTO tags (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id',
                [tag]
            );
            if (tagResult.rows.length > 0) {
                tagIds.push(tagResult.rows[0].id);
            } else {
                // If the tag already exists, get its ID
                const existingTagResult = await pool.query(
                    'SELECT id FROM tags WHERE name = $1',
                    [tag]
                );
                if (existingTagResult.rows.length > 0) {
                    tagIds.push(existingTagResult.rows[0].id);
                }
            }
        }

        // Associate tags with the task
        for (const tagId of tagIds) {
            await pool.query(
                'INSERT INTO task_tags (task_id, tag_id) VALUES ($1, $2) ON CONFLICT (task_id, tag_id) DO NOTHING',
                [task.id, tagId]
            );
        }

        res.status(201).json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};


// Get all tasks
exports.getAllTasks = async (req, res) => {
    try {
        // Fetch tasks with column titles
        const tasksResult = await pool.query(`
            SELECT tasks.*, columns.title AS column_title
            FROM tasks
            INNER JOIN columns ON columns.id = tasks.column_id
        `);

        // Fetch tags associated with each task
        const tasks = tasksResult.rows;
        const tasksWithTags = await Promise.all(
            tasks.map(async (task) => {
                const tagsResult = await pool.query(`
                    SELECT tags.name
                    FROM tags
                    INNER JOIN task_tags ON tags.id = task_tags.tag_id
                    WHERE task_tags.task_id = $1
                `, [task.id]);
                const tags = tagsResult.rows.map(row => row.name);
                return { ...task, tags };
            })
        );

        res.status(200).json(tasksWithTags);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};


// Get a single task by ID
exports.getTaskById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT tasks.* ,columns.title FROM tasks INNER JOIN columns ON columns.id = tasks.column_id WHERE id = $1', [id]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

// Update a task by ID
exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { content, description, column_id, tags } = req.body;  // Add tags to request

    try {
        // Update task
        const result = await pool.query(
            'UPDATE tasks SET content = $1, description = $2, column_id = $3 WHERE id = $4 RETURNING *',
            [content, description, column_id, id]
        );
        const updatedTask = result.rows[0];

        // Delete existing tags
        await pool.query('DELETE FROM task_tags WHERE task_id = $1', [id]);

        // Insert new tags
        if (tags && tags.length > 0) {
            for (const tag of tags) {
                const tagResult = await pool.query(
                    'INSERT INTO tags (name) VALUES ($1) ON CONFLICT (name) DO NOTHING RETURNING id',
                    [tag]
                );
                const tagId = tagResult.rows[0]?.id;

                if (tagId) {
                    await pool.query('INSERT INTO task_tags (task_id, tag_id) VALUES ($1, $2)', [id, tagId]);
                }
            }
        }

        res.status(200).json(updatedTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

// Delete a task by ID
exports.deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};



// Example endpoint to delete a tag
exports.deleteTag = async (req, res) => {
    const { tagName } = req.params; // Use tagName from URL parameters
    try {
        await pool.query('DELETE FROM tags WHERE name = $1', [tagName]);
        res.status(200).json({ message: 'Tag deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};
