require('.')
const pool = require('../database/config.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const hashPassword = async (password) => {
    const salt = 10
    return await bcrypt.hash(password, salt)
}

const decryptPassword = async(password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword)
}

exports.login = async (req, res) => {
    const { email, password } = req.body

    if( !email || !password ) {
        return res.status(400).json({message: 'Missing Credentials'})
    }
    try{
        const client = await pool.connect()

        const userInfo = await client.query(
            'SELECT * FROM user_mgmt.user_list WHERE email=$1',
            [email]
        )

        const userData = userInfo?.rows

        if (userInfo?.rows.length > 0) {
            const match = await decryptPassword(password, userData[0]?.password)

            if(match){
                const ac_token = jwt.sign(
                    { email: email },
                    process.env.ACCESS_KEY
                )

                const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress

                // SQL code here
                // res.cookie('access_token', ac_token)

                return res.status(200).cookie('access_token', ac_token).cookie('username', userData[0]?.username).json({
                    message: 'Login Successful',
                    result: {
                                email: userData[0]?.email,
                                username: userData[0]?.username,
                            }
                })
            } else {
                return res.status(400).json({ message: 'Invalid Password' })
            }
        } else {
            return res.status(400).json({ message: 'Invalid Email' })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Internal Server Error'})
    }
}

exports.signup = async (req, res) => {
    try{
        const { email, username, password } = req.body

        const client = await pool.connect()

        const emailInfo = await client.query(
            'SELECT * FROM user_mgmt.user_list WHERE email=$1',
            [email]
        )

        const userInfo = await client.query(
            'SELECT * FROM user_mgmt.user_list WHERE username=$1',
            [username]
        )

        if(emailInfo?.rows.length > 0){
            return res.status(409).json({ message: 'Email already in use' })
        } else if(userInfo?.rows.length > 0){
            return res.status(409).json({ message: 'Username already in use' })
        }else{
            try {
                query = await pool.query('INSERT INTO user_mgmt.user_list (email, username, password) VALUES ($1, $2, $3)', [email, username, await hashPassword(password)])

                client.release()

                return res.status(201).json({message: 'User Registered Successfully'})
            } catch (error) {
                console.error(error)
                return res.status(500).json({message: 'Internal Server Error'})
            }
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({error: 'Internal Server Error'})
    }
}