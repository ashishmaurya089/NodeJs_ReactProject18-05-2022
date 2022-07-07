const express = require('express');
const router = express.Router()
const Item = require("../models/item")

// ******Get All data from Data Base*********
router.get('/getItems', async (req, res) => {
    const data = await Item.find({})
    res.send({ success: true, data })
})

// ******Get data BY ID in Query from Data Base*********
router.get('/getItemsById', async (req, res) => {
    const id = req.query.id;
    const data = await Item.find({ _id: id })
    res.send({ success: true, data })
})

// ******Get data BY ID in Params from Data Base*********
router.get('/getItemsId/:id', async (req, res) => {
    const id = req.params.id;
    const data = await Item.find({ _id: id })
    res.send({ success: true, data })
})

// ******Post new data in data base*********
router.post('/insertItems', async (req, res) => {
    try {
        const { title, amount } = req.body;
        const insertedData = await Item.insertMany({
            title,
            amount,
            date: new Date()
        })
        res.send({ success: true, insertedData })
    } catch (error) {
        res.send({ success: false, data })
    }
})

// ******Update data in data base*********
router.post('/updateItem', async (req, res) => {
    try {
        const { id, title, amount } = req.body
        const updatedItem = await Item.updateOne({ _id: id }, {
            $set: {
                title,
                amount
            }
        })
        res.send({ success: true, updatedItem })

    } catch (error) {
        res.send({ success: false, data })
    }
})

// ******Delete Data By id from Data base ********
router.post('/deleteItemById', async (req, res) => {
    try {
        const id = req.query.id;
        const data = await Item.deleteOne({ _id: id })
        res.send({ success: true, data })
    } catch (error) {
        res.send({ success: false, data })
    }
})

// ******Delete All Data from Data base ********
router.get('/deleteAllItem', async (req, res) => {
    try {
        const id = req.query.id;
        const data = await Item.deleteMany()
        res.send({ success: true, data })
    } catch (error) {
        res.send({ success: false, data })
    }
})

module.exports = router