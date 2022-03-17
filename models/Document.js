const mongoose = require('mongoose')

const documentSchema = mongoose.Schema({
    value: {
        type: String,
        required: true,
    },
    shortId: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model("Document", documentSchema)