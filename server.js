const express = require('express');
const favicon = require('serve-favicon');
require('dotenv').config();

const mongoose = require('mongoose');
const Document = require('./models/Document')

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log("Connected to MongoDB")
    })
    .catch((err) => {
        console.log(err)
    })

function generateId() {
    return Math.random().toString(36).substr(5);
}

const app = express();


app.set("view engine", "ejs");

app.use(express.static("public"))
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    const code = `
# Codebin

A simple and easy to use code snippet sharer. 

Source Code: [Here](https://git.pogr.cc/root/codebin)
Example: https://codebin.jamesz.dev/14pgcjk

## Installation

You can either use the online version or self host your own with your own domain and control your own data!

All you need is [Node.Js](https://nodejs.org/en/) and [MongoDB](https://www.mongodb.com/).


#Clone this repo
git clone https://git.pogr.cc/root/codebin.git
#Install Dependencies 
npm i
#Edit environment variables shown below.

## Environment Variables

#Create an .env file and enter:
PORT=3000 # whatever port you would like the webserver to run on

MONGO_URI= #Your MongoDB URI

## Contributing
Feel free to suggest new features by opening Issues or Pull Requests!
    
    `

    res.render('code', { code, language: "plaintext" })
})

app.get("/create", (req, res) => {
    res.render('create')
})

app.post("/save", async (req, res) => {
    const value = req.body.value
    try {
        let id = generateId()
        const doc = await Document.create({ value: value, shortId: id })
        res.redirect(`/${doc.shortId}`)
    } catch (err) {
        console.error(err)
        res.render('create', { value })
    }
})

app.get("/:id/duplicate", async (req, res) => {
    const id = req.params.id
    try {
        const document = await Document.findOne({ shortId: id })

        res.render('create', { value: document.value })
    } catch (err) {
        console.error(err)
        res.redirect(`/${id}`)
    }

})

app.get("/:id", async (req, res) => {
    const id = req.params.id
    try {
        const document = await Document.findOne({ shortId: id })

        res.render('code', { code: document.value, id })
    } catch (err) {
        console.error(err)
        res.redirect("/")
    }

})

app.listen(process.env.PORT, () => {
    console.log("Webserver listening on port:", process.env.PORT);
})
