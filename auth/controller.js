require('.')

exports.authenticate = async (req, res) => {
    res.status(200).json({
        message: "Token verified"
    })
}