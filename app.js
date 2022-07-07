const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const url = "mongodb+srv://Ashish12345:Ashish12345@cluster0.mwbjoet.mongodb.net/?retryWrites=true&w=majority"
const app = express()

app.use(cors())

mongoose.connect(url, { useNewUrlParser: true })
const con = mongoose.connection


// *******Connection with data Base**********
con.on('open', () => {
    console.log('connected...')
})

// ****use of Json for data in json form*****
app.use(express.json())

// *******routing for user request for add data delete update *******
const itemRouter = require('./routers/item')
app.use('/item', itemRouter)

app.listen(9000, () => {
    console.log("server StartedS")
})