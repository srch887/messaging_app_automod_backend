require('.')
const pool = require('../database/config.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const { getSocketIO } = require("../socket/socket");
const { spawnSync } = require('child_process');

exports.getMessage = async (req, res) => {
    const result = await pool.query("SELECT * FROM content.messages ORDER BY date_time DESC");
    return res.json(result.rows);
};

exports.postMessage = async (req, res) => {
    const { email, username, message } = req.body;
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress

    try {
        result = await axios.post(url = 'http://127.0.0.1:8000/moderate', data = { 'message': message })

        if (result?.data) {
            if (result?.data?.offensive == true) {
                const now = new Date();
                const formatter = new Intl.DateTimeFormat('en-US', {
                    timeZone: 'Asia/Kolkata', // e.g., IST
                    dateStyle: 'full',
                    timeStyle: 'long'
                });

                const io = getSocketIO();
                io.emit("newMessage", {
                    email: email,
                    username: username,
                    message: '<i>Offensive language detected</i>',
                    datetime: formatter.format(now)
                })

                return res.status(201).send("Offensive language detected");
            } else if (result?.data?.offensive == false) {
                await pool.query("INSERT INTO content.messages (email, username, message, ip_address) VALUES ($1, $2, $3, $4)", [email, username, message, ipAddress]);

                const result = await pool.query("SELECT * FROM content.messages ORDER BY date_time DESC");
                const newMessage = result.rows[0];

                console.log(newMessage)

                // Emit the new message to all connected clients
                const io = getSocketIO();
                io.emit("newMessage", newMessage);

                return res.status(201).send("Message added");
            } else {
                const io = getSocketIO();
                io.emit("newMessage", 'Error');

                throw new Error("Error validating message")
            }
        } else {
            const io = getSocketIO();
            io.emit("newMessage", 'Error');

            throw new Error("Error validating message")
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send("Internal server error");
    }
};