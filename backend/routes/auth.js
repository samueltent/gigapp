const router = require('express').Router();
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../validation/validation')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.post('/register', async (req, res) => {
	
	const { error } = registerValidation(req.body);
	if(error) { 
		
		res.status(400).send(error.details[0].message)
		
	} else {
		
		const emailExist = await User.findOne({ email: req.body.email });
		
		if(emailExist) {
			return res.status(400).send("Email already registered!")
		}
		
		//hash password
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		const currentDate = new Date(Date.now());
	
		const user = new User({
			email: req.body.email, 
			password: hashPassword,
			date: currentDate
		});
	
		console.log(user);
	
		try {
			const savedUser = await user.save();
			res.send(savedUser);
		}
		catch(err) {
			res.status(400).send(err);
		}
		
	}
	
});

router.post('/login', async (req, res) => {
	
	const { error } = loginValidation(req.body);
	if(error) {
		res.status(400).send(error.details[0].message);
	} else {
		
		const user = await User.findOne({ email: req.body.email });
		
		if(!user) {
			return res.status(400).send("Email or password is wrong!");
		}
		
		const validPassword = await bcrypt.compare(req.body.password, user.password);
		if(!validPassword) {
			return res.status(400).send("Email or password is wrong!");
		}
		
		const _id = user._id;
		const email = user.email;
		
		//create and assign jsonwebtoken
		const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
		res.header('auth-token', token).send({token, _id, email});
		
	}
	
});


module.exports = router;