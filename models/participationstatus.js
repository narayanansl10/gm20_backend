const mongoose = require('mongoose');
const config = require('../config/env');
const pagination = require('mongoose-paginate');
const Schema = mongoose.Schema;
// ParticipationStatus Schema
const ParticipationStatusSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});
ParticipationStatusSchema.plugin(pagination);
const ParticipationStatus = module.exports = mongoose.model('ParticipationStatus', ParticipationStatusSchema);

module.exports.getAllParticipationStatus = (page, callback) => {
    ParticipationStatus.paginate({}, { limit: config.pagination.perPage, page: page }, callback);
}

//Reviewed By Narayanan SL on 16/12/19