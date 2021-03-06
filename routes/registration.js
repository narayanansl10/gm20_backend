const express = require('express');
const router = express.Router();
const config = require('../config/env');
const User = require('../models/user');
var nodemailer = require("nodemailer");
var ObjectId = require('mongoose').Types.ObjectId;
//Fill up mail details and proceed
let smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "",//gm20 - changes need to be accomodated
        pass: ""
    }
});

//Create Registration User
router.post('/create', (req, res, next) => {
    User.find({
        email_id: req.body.email_id
    }, (err, docs) => {
        if (docs.length == 0) {
            console.log("No Already Registered User")
            let newUser = new User({
                name: req.body.name,
                college_id: req.body.college_id,
                department_id: req.body.department_id,
                degree_id: req.body.degree_id,
                email_id: req.body.email_id,
                year_id: req.body.year_id,
                gender: req.body.gender,
                mobile_number: req.body.mobile_number,
                activated: true,
                type: req.body.type,
                password: req.body.password,
                registration_mode: req.body.registration_mode,
                cart_paid: false,
                cart_confirmed: false,
                gmID:""
            });

            User.addUser(newUser, (err, user) => {
                if (err) {
                    console.log("Add User Phase1")
                    res.json({
                        success: false,
                        msg: 'Failed to register user' + err
                    });
                } else {
                    User.activationCode(newUser, (err2, activationUser) => {
                        if (err) {
                            console.log("Add User Phase2")
                            res.json({
                                success: false,
                                msg: 'Failed to add activtion Code to user' + err2
                            });
                        } else {
                            link = "localhost:3000/registration/" + "activate/" + activationUser._id + "/" + activationUser.activation_code;
                            let mailOptions = {
                                to: req.body.email_id,
                                subject: "Welcome To Gyanmitra2020",
                                //html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to Activate</a>"
                                html: "Hello, "+activationUser.name+"Thank you for showing interest to participate in Gyanmitra 2020. Please visit <a href=gyanmitra20.mepcoeng.ac.in>gyanmitra20.mepcoeng.ac.in</a> for more details. " 
                            }
                            console.log("Add User Phase Mail")
                            smtpTransport.sendMail(mailOptions, function (error, response) {
                                console.log(error)
                                res.json({
                                    success: true,
                                    msg: 'User Registered Successfully'
                                });
                            });
                        }
                    })
                }
            });
        } else {
            res.json({
                success: false,
                msg: 'Mail id is already registered'
            })
        }
    });
});

// router.post('/createOfflineUser', (req, res, next) => {
//     User.find({
//         email_id: req.body.email_id
//     }, (err, docs) => {
//         if (docs.length == 0) {
//             let newUser = new User({
//                 name: req.body.name,
//                 college_id: req.body.college_id,
//                 department_id: req.body.department_id,
//                 degree_id: req.body.degree_id,
//                 email_id: req.body.email_id,
//                 year_id: req.body.year_id,
//                 gender: req.body.gender,
//                 mobile_number: req.body.mobile_number,
//                 type: req.body.type,
//                 registration_mode: "offline",
//                 gmID: '',
//                 cart_paid: false
//             });

//             User.addUser(newUser, (err, user) => {
//                 if (err) {
//                     res.json({
//                         success: false,
//                         msg: 'Failed to register user' + err
//                     });
//                 } else {
//                     User.activationCode(newUser, (err2, activationUser) => {
//                         if (err) {
//                             res.json({
//                                 success: false,
//                                 msg: 'Failed to add activtion Code to user' + err2
//                             });
//                         } else {
//                             link = "http://www.gyanmitra19.mepcoeng.ac.in/user/" + "activate/" + activationUser._id + "/" + activationUser.activation_code;
//                             let mailOptions = {
//                                 to: req.body.email_id,
//                                 subject: "Please confirm your Email account",
//                                 html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to Activate</a>"
//                             }
//                             smtpTransport.sendMail(mailOptions, function (error, response) {
//                                 if (!error) {
//                                     res.json({
//                                         success: true,
//                                         msg: 'User Registered Activation Mail has been sent'
//                                     });
//                                 } else {
//                                     res.json({
//                                         success: true,
//                                         msg: error
//                                     });
//                                 }
//                             });
//                         }
//                     })
//                 }
//             });
//         } else {
//             res.json({
//                 success: false,
//                 msg: 'Mail id is already registered'
//             })
//         }
//     });
// });


router.get('/generateGMID', (req, res) => {
    User.find({
        cart_paid:true,
        gmID: ""
    }).exec((err, docs) => {
        var respo = []
        //console.log(docs)
       /* docs.forEach(element => {
            var _id = element._id.toString()
            User.updateOne({
                _id: ObjectId(_id)
            }, {
                    $set: {
                        gmID: 'GM20_' + element.name.substring(0, 4) + element.mobile_number.substring(0,4)
                    }
                })
        })*/
        var isAlpha = function(ch){
            return /^[A-Z]$/i.test(ch);
        }
        for(i=0;i<docs.length;i++)
        {
            //var name = docs[i].name.toUpperCase().substring(0, 4)
            var name="";
            var count = 0;
            for(j=0;count<3;j++){
                if(isAlpha(docs[i].name[j])){
                    name+=docs[i].name[j].toUpperCase();
                    count+=1;
                }
            }
            var _id = docs[i]._id.toString()
            console.log(docs[i].name+": "+ "GM20_" + name + docs[i].mobile_number.substring(docs[i].mobile_number.length-5,docs[i].mobile_number.length))
            User.updateOne({
                _id: ObjectId(docs[i]._id)
            }, {
                    $set: {
                        //gmID: "GM20_" + name + docs[i].mobile_number.substring(docs[i].mobile_number.length-5,docs[i].mobile_number.length)
                        gmID: "GM20_"
                    }
                },(err,docs)=>{console.log(err)})
        }
        res.json({
            error: false,
            msg: 'GM ID Generated'
        })
    })
});

router.post('/activate', function (req, res, next) {
    const user_id = req.body._id;
    const activation_code = req.body.activation_code;
    console.log("Activation Function");
    if (!ObjectId.isValid(user_id))
        return res.status(400).send(`NO RECORD WITH GIVEN ID : ${user_id}`);

    User.findById(user_id, (err, user) => {
        if (err) throw err;
        if (user.activated) {
            console.log("Already Activated");
            res.json({
                success: true,
                msg: 'You are Already Activated'
            });
        } else {
            if (user.activation_code == activation_code) {
                user.activated = true;
                var id = user._id.toString();
                console.log(user.activation_code)
               // user.gmID = "GM20_" + user.name.toLowerCase().substring(0, 4) + user.mobile_number.substring(user.mobile_number.length-5,user.mobile_number.length);
                user.save(function (err, newUser) {
                    if (err) {
                        res.json({
                            success: false,
                            msg: 'Not Updated'
                        });
                    } else {
                        res.json({
                            success: true,
                            msg: 'Activated ThankYou!!'
                        });
                    }
                })
            }
        }


    });
});
//Read Registered User
router.get('/', function (req, res, next) {
    let page = req.query.page ? req.query.page : 1;
    User.find({
        type: 'user'
    }).limit(config.pagination.perPage).skip(page).exec((err, docs) => {
        if (!err) {
            res.send(docs);
        } else {
            res.send(err);
        }
    });
});

router.get('/hasConfirmed/:id', function (req, res, next) {
    if (!ObjectId.isValid(req.params.id))
        return res.status(400).send(`NO RECORD WITH GIVEN ID : ${req.params.id}`);
    User.findById(req.params.id, (err, user) => {
        if (err) throw err;
        if (user.cart_confirmed) {
            res.json({
                error: true,
                data: user,
                msg: "Confirmed"
            })
        }
    })
})

module.exports = router;
//Reviewed By Narayanan SL on 16/12/19