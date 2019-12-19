const mongoose = require('mongoose');
const config = require('../config/env');
const pagination = require('mongoose-paginate');
const Schema = mongoose.Schema;

// GMID Mapping Schema
const gmid = mongoose.Schema({
    gm_id: {
        type: String,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

gmid.plugin(pagination);
module.exports = mongoose.model('gmid', gmid);

//Edited By Narayanan SL on 16/12/19