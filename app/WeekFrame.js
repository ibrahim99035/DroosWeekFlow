const express = require('express');
const db = require('../database');
const week = require('./Week');
const days = require('./Days');

const router = express.Router();

router.post('/week', async (req, res) => {   
    const user_id = req.userId
    let order = 1 
    const weekRes = week.calculateWeekend(order);
    
    const firstDate = weekRes.start;
    const lastDate = weekRes.end;
    const newOrder = weekRes.newOrder;

    const startData = new Date(firstDate);
    const daysArray = days.getDaysOfWeek(startData);

    try {
        await db.execute('INSERT INTO weeks (start_date, end_date, week_order, rank, user_id) VALUES (?, ?, ?, ?, ?)', [firstDate, lastDate, newOrder, 0, user_id]);
        let  weekId;
        try {
            const [rows] = await db.execute('SELECT * FROM weeks WHERE start_date = ?', [firstDate]);
            if (rows.length === 0) {
              return res.status(401).json({ error: 'Week Not Found in The Database' });
            }
            const TheWeek = rows[0];
            weekId = TheWeek.id; 
        } catch (error) {
            res.status(500).json({ error: 'Cant Catch The Week ID' });
        }
        daysArray.forEach( async ({day, date}) => {
            await db.execute('INSERT INTO days (name, date, rank, week_id) VALUES (?, ?, ?, ?)', [day, date, 0, weekId]);
        });
        
        res.status(201).json({ message: 'Week & Days had been Assigned' });
    } catch (error) {
        res.status(500).json({ error: 'Error assigning week and days' + error});
    }
});

module.exports = router;