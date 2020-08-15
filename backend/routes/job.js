const router = require('express').Router();
const Job = require('../models/Job');
const verify = require('./verifytoken');
const User = require('../models/User');


router.get('/job/:id', verify, (req, res) => {
    Job.findOne({_id : req.params.id}, (err, job)=> {
        if(err) res.send(err);
        else res.send(job);
    });
});

router.get('/userjobs/:userId', verify, (req, res) => {
    Job.find({author : req.params.userId}, (err, jobs) => {
        if(err) res.send(err);
        else res.send(jobs);
    })
    .sort({date : -1});
});

router.get('/jobs/:number', verify, (req, res) => {
    
    if(req.params.number == "all")
    {
        Job.find({author : { $ne: req.user._id }}, (err, jobs) => {
            if(err) res.send(err);
            else res.send(jobs);
        });
    } else {

        let limit = parseInt(req.params.number);

        Job.find({author : { $ne: req.user._id }}, (err,jobs)=>{
            if(err) res.send(err);
            else res.send(jobs);
        }).limit(limit)
        .sort({date : -1});
    }

});

router.get('/findjob/:location', verify, (req,res) =>{
    Job.find({location: req.params.location, author : { $ne: req.user._id }}, (err, jobs)=>{
        if(err) res.send(err);
        else res.send(jobs);
    });
});

router.get('/searchjob/:keyword', verify, (req,res) => {

    Job.find({title : new RegExp(req.params.keyword, 'i'), author : { $ne: req.user._id }}, (err,jobs)=>{
        if(err) res.send(err);
        else res.send(jobs);
    });
    
});


router.post('/addjob', verify, async (req, res) => {

    const currentDate = new Date(Date.now());

    const job = new Job({
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
        author: req.user._id,
        date: currentDate
    });

    console.log(job);
	
	try {
        const savedJob = await job.save();
		res.send(savedJob);
	}
	catch(err) {
		res.status(400).send(err);
	}

});

router.put('/applyjob/:jobId', verify, (req,res) => {
    
    const userId = req.user._id;

    Job.findByIdAndUpdate(req.params.jobId, { $push : {applicants : userId} }, (err, result) => {
        if(err) res.send(err);
        else res.send("Your application was successfully sent!");
    });

});

router.put('/updatejob/:jobId', verify, (req, res) => {

    const jobUpdate = {
        title: req.body.title,
        description: req.body.description,
        location: req.body.location,
    };

    Job.findByIdAndUpdate(req.params.jobId, jobUpdate, (err, result) => {
        if(err) res.send(err);
        else res.send("Job was updated successfully!");
    });

});

module.exports = router;