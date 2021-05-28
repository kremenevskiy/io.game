const express = require('express');
const mongoose = require('mongoose')
const authRouter =  require('./authRouter')
const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.use('/auth', authRouter)
const start = async () => {
    try {
        await mongoose.connect("mongodb+srv://krem:qwerty123@cluster0.oape2.mongodb.net/Authorization?retryWrites=true&w=majority")
        app.listen(PORT, () => {console.log(`\nserver started on port ${PORT}`)})
    }
    catch (e) {
        console.log(e);
    }
}

start()