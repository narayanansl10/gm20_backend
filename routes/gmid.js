// Created By : Aravind 
// Added Routes for GMID
// Date : 29-January-2019

const express = require('express');
const router = express.Router();
const gmid = require('../models/gmid')
var ObjectId = require('mongoose').Types.ObjectId;
const EventRegistration = require('../models/registration')
const gm = require('../models/gmid')
const Certificate = require('../models/certificate')

router.get('/getRegisteredParticipants', (req, res) => {
    gm.find({}).populate('user_id').exec((err, docs) => {
        docs.forEach((val) => {
            console.log(val.user_id.name + "," + val.user_id.email_id + "," + val.user_id.mobile_number);
        })
    })
})

router.post('/markPresent', (req, res) => {
    gmid.find({
        gm_id: req.body.gm_id
    }).exec((err, docs) => {
        if (!err) {
            if (docs.length == 0) {
                res.json({
                    error: false,
                    msg: 'Participant has not Registered'
                })
            } else {
                EventRegistration.find({
                    user_id: docs[0].user_id,
                    event_id: req.body.event_id
                }).exec((error, response) => {
                    if (error) {
                        res.json({
                            error: true,
                            msg: error
                        })
                    } else {
                        if (response.length == 0) {
                            EventRegistration.create({
                                event_id: req.body.event_id,
                                user_id: docs[0].user_id,
                                registration_type: 'Single',
                                participation: 'Present',
                                status: 'Paid'
                            }, (createError, createResponse) => {
                                if (createError) {
                                    res.json({
                                        error: true,
                                        msg: createError
                                    })
                                } else {
                                    gm.find({
                                        gm_id: req.body.gm_id
                                    }).exec((gmError, gmDocs) => {
                                        if (gmDocs.length == 0) {
                                            res.json({
                                                error: false,
                                                msg: 'gm id is not Registered'
                                            })
                                        } else {
                                            Certificate.find({
                                                user_id: gmDocs[0].user_id
                                            }).exec((certErr, certDoc) => {
                                                if (certDoc.length == 0) {
                                                    let newCertificate = new Certificate({
                                                        user_id: docs[0].user_id,
                                                        event_id: req.body.event_id,
                                                        written: false,
                                                        issued: false
                                                    });
                                                    newCertificate.save((err, doc) => {
                                                        if (err) {
                                                            res.json({
                                                                error: true,
                                                                msg: 'Failed to Create Certficate Entry' + err
                                                            });
                                                        } else {
                                                            res.json({
                                                                error: false,
                                                                msg: 'Registration Successful. Certificate should be written. Check Certificate Table'
                                                            });
                                                        }
                                                    });
                                                } else {
                                                    res.json({
                                                        error: false,
                                                        msg: 'Registration Successful. Certificate need not be written.'
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })

                        } else {
                            EventRegistration.updateOne({
                                user_id: docs[0].user_id,
                                event_id: req.body.event_id
                            }, {
                                    $set: {
                                        participation: 'Participated'
                                    }
                                }).exec((updateError, updateRes) => {
                                    if (updateError) {
                                        res.json({
                                            error: true,
                                            msg: updateError
                                        })
                                    } else {
                                        gm.find({
                                            gm_id: req.body.gm_id
                                        }).exec((gmError, gmDocs) => {
                                            if (gmDocs.length == 0) {
                                                res.json({
                                                    error: false,
                                                    msg: 'gm id is not Registered'
                                                })
                                            } else {
                                                Certificate.find({
                                                    user_id: gmDocs[0].user_id
                                                }).exec((certErr, certDoc) => {
                                                    if (certDoc.length == 0) {
                                                        let newCertificate = new Certificate({
                                                            user_id: docs[0].user_id,
                                                            event_id: req.body.event_id,
                                                            written: false,
                                                            issued: false
                                                        });
                                                        newCertificate.save((err, doc) => {
                                                            if (err) {
                                                                res.json({
                                                                    error: true,
                                                                    msg: 'Failed to Create Certficate Entry' + err
                                                                });
                                                            } else {
                                                                res.json({
                                                                    error: false,
                                                                    msg: 'Registration Successfull. Certificate should be written. Check Certificate Table'
                                                                });
                                                            }
                                                        });
                                                    } else {
                                                        res.json({
                                                            error: false,
                                                            msg: 'Registration Successfull. Certificate need not be written.'
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                        }
                    }
                })
            }
        } else {
            res.json({
                error: true,
                msg: error
            })
        }
    })
})

router.post('/createMap', (req, res) => {
    gmid.find({
        gm_id: req.body.gm_id
    }).exec((gmError, gmResponse) => {
        if (gmError) {
            res.json({
                error: true,
                msg: error
            })
        } else {
            if (gmResponse.length == 0) {
                gmid.find({
                    user_id: req.body.user_id
                }).exec((error, result) => {
                    if (error) {
                        res.json({
                            error: true,
                            msg: error
                        })
                    } else {
                        if (result.length == 0) {
                            gmid.create({
                                gm_id: req.body.gm_id,
                                user_id: req.body.user_id
                            }, (err, docs) => {
                                if (err) {

                                    res.json({
                                        error: true,
                                        msg: err
                                    })
                                } else {
                                    res.json({
                                        error: false,
                                        msg: 'Participant Successfully Registered'
                                    })
                                }
                            })
                        } else {
                            res.json({
                                error: false,
                                msg: 'User has been already issued an ID Card'
                            })
                        }
                    }
                })
            } else {
                res.json({
                    error: false,
                    msg: 'gm id already Registered'
                })
            }
        }
    })
})


module.exports = router;

//Reviewed By Narayanan SL on 16/12/19