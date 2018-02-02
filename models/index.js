var mongoose = require('mongoose');
var config = require('../config');
mongoose.Promise = global.Promise;
mongoose.connect(config.db, function (err) {
    if (err) {
        console.error('connect to %s error: ', config.db, err.message);
        process.exit(1);
    } else {
        console.log('connect %s ', config.db);
    }
});

require('./urlModel');
require('./recoredModel');


exports.URLModel = mongoose.model('URLModel');
exports.RecordsModel = mongoose.model('RecordsModel');