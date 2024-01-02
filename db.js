const mongoose = require('mongoose');

const connect = ()=>{
    mongoose.connect(process.env.CONNECTION_STRING).then(()=>{
        console.log("connected to bd.");
    }).catch((e)=>{
        console.log("some error occured");
        console.log(e.message);
    });
}

module.exports = connect;