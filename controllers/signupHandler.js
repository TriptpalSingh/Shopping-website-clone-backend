const User = require('../models/user');
const bcryptjs = require('bcryptjs');

const signupHandler = async (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const check = await User.findOne({$or: [{username}, {email}]});
    if(check){
        res.send({
            status: "error",
            message: "User already exists"
        })
        return;
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const user = new User({
        first_name: firstName,
        last_name: lastName,
        username,
        email,
        password: hashedPassword
    });

    user.save().then(() => {
        res.send({
            status: "ok",
            name: firstName,
            cart: 0
        })
    }).catch((err)=>{
        res.send({
            status: "error",
            message: err.message
        })
    })

}

module.exports = signupHandler;