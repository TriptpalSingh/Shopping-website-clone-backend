const express = require('express');
const app = express();
const connect = require('./db');
const cors = require('cors');
const bcryptjs = require('bcryptjs');
require('dotenv').config();
const User = require('./models/user');
const Product = require('./models/product');
const axios = require('axios');

app.use(cors());
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended:false}));

connect();


app.get('/', (req, res)=>{
    res.send({
        message:"this is the api for the ecomerce website assignment"
    })
})

app.post('/getUsers', async (req, res)=>{
    const email = req.body.email;
    const check = await User.findOne({email});
    console.log(check)

    if(!check){
        res.send(true);
    }
    else{
        res.send(false);
    }
})


app.post('/login', async (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;
    let token;
    let firstName;

    const check = await User.findOne({username});
    if(check){
        token = check.token;
        res.send({
            status: "ok",
            name: check.first_name,
            cart: check.cart.length,
            token
        })
        return;
    }

    axios.post("https://dummyjson.com/auth/login", {username, password}).then(async (response)=>{
        token = response.data.token;
        firstName = response.data.firstName;
        const newUser = new User({
            first_name: response.data.firstName,
            last_name: response.data.lastName,
            gender: response.data.gender,
            image: response.data.image,
            username: response.data.username,
            email: response.data.email,
            token: response.data.token,
        })
        await newUser.save();
    }).then(()=>{
        res.send({
            status: "ok",
            name: firstName,
            cart: 0,
            token
        })
    }).catch((e)=>{
        console.log(e.response.status);
        res.send("failed");
    })

})

app.post('/addItem', async (req,res)=>{
    const name = req.body.name;
    const desc = req.body.desc;
    const url = req.body.url;

    const newProduct = new Product({
        name: name,
        description: desc,
        image: url
    })

    await newProduct.save().then(()=>{
        res.send("product added.");
    }).catch((e)=>{
        res.send(e.message);
    })
})


app.post('/addToCart', async (req,res)=>{
    const token = req.body.token;
    const key = req.body.key;
    const name = req.body.name;
    const desc = req.body.desc;
    const url = req.body.url;
    const price = req.body.price;
    const userInfo = await User.find({token});
    const cart = userInfo[0].cart;
    let flag = false;
    cart.map((products)=>{
        if(products.key == key){
            products.quantity += 1;
            flag = true;
        }
    })
    if(flag){
        await User.updateOne({token}, {$set: {cart}});
        // const newInfo = await User.find({email});
        res.send({
            status: "ok",
            quantityChange: true
        });
    }
    else{
        const newItem = {
            key, name, desc, url, price, quantity:1
        }
        cart.push(newItem);
        await User.updateOne({token}, {$set: {cart}});
        // const newInfo = await User.find({email});
        res.send({
            status: "ok",
            quantityChange: false
        });
    }
    
})

app.post('/getCartItems', async (req, res)=>{
    const token = req.body.token;
    const userInfo = await User.find({token});
    const cart = userInfo[0].cart;
    res.send(cart);
})

app.post('/clearCart', async (req, res)=>{
    const token = req.body.token;

    const userInfo = await User.find({token});
    let cart = userInfo[0].cart;
    cart = [];
    await User.updateOne({token}, {$set: {cart}});
    res.send({
        status : "ok"
    })
})




app.listen(process.env.PORT || 4000, ()=>{
    console.log("connected" + process.env.PORT);
})

module.exports = app;
