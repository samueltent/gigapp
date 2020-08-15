const router = require('express').Router();
const User = require('../models/User');
const verify = require('./verifytoken');
const bcrypt = require('bcrypt');

router.get('/user/:id', verify, (req, res) => {
    User.findOne({_id : req.params.id}, (err, user)=> {
        if(err) res.send(err);
        else res.send(user);
    });
});

router.get('/cv/:userId', verify, (req,res) => {
    User.findOne({_id : req.params.userId}, (err, user) => {
        if(err) res.send(err);
        else {
            console.log(user.cv);
            res.send(user.cv);
        }
    });
});

router.get('/users/:number', verify, (req, res) => {

    
    if(req.params.number == "all")
    {
        User.find({}, (err, users) => {
            if(err) res.send(err);
            else res.send(users);
        });
    } else {

        let limit = parseInt(req.params.number);

        User.find({}, (err,users)=>{
            if(err) res.send(err);
            else res.send(users);
        }).limit(limit)
        .sort({date : -1});
    }

});

router.put('/updatecv/:userId', verify, (req, res) => {

    const cv = {
        firstName: req.body.firstName,
		lastName: req.body.lastName,
		dateOfBirth: req.body.dateOfBirth,
		address: req.body.address,
		telephone: req.body.telephone,
        about: req.body.about,
        education: {
            beginDate: req.body.education.beginDate,
            finishDate: req.body.education.finishDate,
            institution: req.body.education.institution
        },
		experience : [
			{
				startDate: req.body.experience[0].startDate,
				endDate: req.body.experience[0].endDate,
                position: req.body.experience[0].position,
                company: req.body.experience[0].company
			}
		]
    }

    console.log(cv);

    User.findOneAndUpdate({_id: req.params.userId}, { $set: { cv: cv }}, (err, result)=> {
        if(err) res.send(err);
        else { 
            res.send("User updated successfully!");
            console.log(result);
        }
    });

});

router.put('/changeemail/:userId', verify, (req, res) => {
    
    User.findOneAndUpdate({_id: req.params.userId}, { $set: { email: req.body.newemail }}, (err, result)=> {
        if(err) res.send(err);
        else { 
            res.send({message: "Your email was successfully changed!"});
        }
    });

});

router.put('/changepassword/:userId', verify, async (req, res) => {

    console.log(req.body);
    
    var user = await User.findOne({_id : req.params.userId});
    const validPassword = await bcrypt.compare(req.body.oldpassword, user.password);
	if(!validPassword) {
		return res.status(400).send({message: "Old password not matching!"});
    }
    
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.newpassword, salt);
        user.password = hashPassword;
        const savedUser = await user.save();
        if(savedUser) {
            res.send({message: "Your password was successfully changed!"});
        }
    }
    catch(err) {
        res.status(400).send(err);
    }

});

router.delete('/deleteuser/:userId', verify, async (req, res) => {

    const user = await User.findOne({_id: req.params.userId});
    const result = user.remove();
    res.send(result);

});

module.exports = router;