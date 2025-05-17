require('.')
const pool = require('../database/config.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { getSocketIO } = require("../socket/socket");

exports.getMessage = async (req, res) => {
    const result = await pool.query("SELECT * FROM content.messages ORDER BY date_time DESC");
    res.json(result.rows);
};
  
exports.postMessage = async (req, res) => {
    const { email, username, message } = req.body;
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress

    await pool.query("INSERT INTO content.messages (email, username, message, ip_address) VALUES ($1, $2, $3, $4)", [email, username, message, ipAddress]);
  
    const result = await pool.query("SELECT * FROM content.messages ORDER BY date_time DESC");
  
    const newMessage = result.rows[0];
  
    // Emit the new message to all connected clients
    console.log(result.rows[0])

    const io = getSocketIO();
    io.emit("newMessage", newMessage);
  
    res.status(201).send("Message added");
};