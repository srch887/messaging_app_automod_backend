const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const cors = require("cors");
const { initSocket } = require("./socket/socket");
const dotenv = require('dotenv')

// dot env config
dotenv.config()

const user = require('./user/index')
const messenger = require('./messenger/index')
const auth = require('./auth/index')

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true, // Enable cookies
}));

app.get("/", async (req, res) => {
  res.sendStatus(200)
})

app.use('/api',
  user,
  messenger,
  auth
)

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
