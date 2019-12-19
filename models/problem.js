const mongoose = require('mongoose');

const ProblemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    resolved:{
        type:Boolean,
        required: true
    }
});
module.exports = mongoose.model('Problem', ProblemSchema);

//Reviewed By Narayanan SL on 16/12/19