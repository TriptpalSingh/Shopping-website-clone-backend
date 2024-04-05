const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const handleLogin = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const check = await User.findOne({username});
    if(!check){
        res.send({
            status: "error",
            message: "Username is incorrect"
        })
        return;
    }

    if(await bcryptjs.compare(password, check.password)){
        const token = jwt.sign({
            id: check.id,
            username: check.username
        }, process.env.ACCESS_TOKEN_SECRET)

        res.send({
            status: "ok",
            name: check.first_name,
            cart: check.cart.length,
            token
        })
        return;
    }
}


module.exports = handleLogin;