const {Pool} = require('pg')

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Sahill123',
    database: 'message-app-db'
})

module.exports = pool