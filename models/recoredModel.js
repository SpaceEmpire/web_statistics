var mongoose = require('mongoose');
var RecordsModelSchema = mongoose.Schema({
    channel: String,
    address: String,
    createtime: String,
    date: String
    //createAt: {type: Date, default: Date.now, expires: 60000}
});

RecordsModelSchema.index({channel: 1});
RecordsModelSchema.index({address: -1});
RecordsModelSchema.index({createtime: -1});
RecordsModelSchema.index({date: -1});
//RecordsModelSchema.path('createAt').index({expires: 1});

mongoose.model('RecordsModel', RecordsModelSchema);