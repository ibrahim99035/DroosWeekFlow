const express = require('express');
const db = require('../database');

const router = express.Router();

router.post('/task', async (req, res) => {   
    const {description, state, degree, day_id} = req.body;
    if (!description || !state || !degree || !day_id) {
      return res.status(400).json({ message: 'Please provide all required information.' });
    }
    try {
        await db.execute('INSERT INTO tasks (description, state, degree, day_id) VALUES (?, ?, ?, ?)', [description, state, degree, day_id]);       
        
        res.status(201).json({ message: 'Task Initiated' });
    } catch (error) {
        res.status(500).json({ error: 'Error Initiating The Task :(.' + error});
    }
});

router.delete('/task/delete/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    try {
        await db.execute('DELETE FROM tasks WHERE id = ?', [taskId]);
        res.status(200).json({ message: 'Task deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting task: ' + error });
    }
});

router.put('/task/update/description/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    const newDescription = req.body.newDescription;

    if (!newDescription) {
        return res.status(400).json({ message: 'Please provide the new description.' });
    }

    try {
        await db.execute('UPDATE tasks SET description = ? WHERE id = ?', [newDescription, taskId]);
        res.status(200).json({ message: 'Description updated successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating description: ' + error });
    }
});

router.put('/task/update/state/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    const newState = req.body.newState;

    if (!newState) {
        return res.status(400).json({ message: 'Please provide the new state.' });
    }

    try {
        await db.execute('UPDATE tasks SET state = ? WHERE id = ?', [newState, taskId]);
        res.status(200).json({ message: 'State updated successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating state: ' + error });
    }
});

router.put('/task/update/degree/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    const newDegree = req.body.newDegree;

    if (!newDegree) {
        return res.status(400).json({ message: 'Please provide the new degree.' });
    }

    try {
        await db.execute('UPDATE tasks SET degree = ? WHERE id = ?', [newDegree, taskId]);
        res.status(200).json({ message: 'Degree updated successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating degree: ' + error });
    }
});

router.get('/tasks/in-progress-uncompleted', async (req, res) => {
    try {
        const result = await db.execute('SELECT * FROM tasks WHERE state IN (?, ?)', ['in progress', 'uncompleted']);
        
        if (result[0].length === 0) {
            return res.status(404).json({ message: 'No tasks found with the specified states.' });
        }

        res.status(200).json({ tasks: result[0] });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching tasks: ' + error });
    }
});

module.exports = router;