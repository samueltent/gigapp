const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    location : {
        type: String,
        required: true
    },
    author : {
        type: mongoose.Schema.Types.ObjectId,
        required: true 
    },
    applicants : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Applicant'
        }
    ],
    selectedApplicant : {
        type: mongoose.Schema.Types.ObjectId
    },
    date : {
		type: Date,
		required: true
	}
});

module.exports = mongoose.model('Job', JobSchema);