let mongoose = require('mongoose');

let JobSchema = mongoose.Schema({
    title: String,
    description: String,
    retribution: {
        pay: Number,
        total: Boolean
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Job", JobSchema);