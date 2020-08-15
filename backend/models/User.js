const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	email : {
		type: String,
		required: true
	},
	password : {
		type: String,
		required: true
	},
	cv : {
		firstName: String,
		lastName: String,
		dateOfBirth: String,
		address: String,
		telephone: String,
		about: String,
		education: {
			institution: String,
			beginDate: String,
			finishDate: String
		},
		experience : [
			{
				startDate: String,
				endDate: String,
				position: String,
				company: String
			}
		]
	},
	date : {
		type: Date,
		required: true
	}
});

module.exports = mongoose.model('User', UserSchema);