var mongoose = require('mongoose');
var UrlModelSchema = mongoose.Schema({
    businessKey: String,
    business: String,
    businessUrl: String,
    dynamicUrl: String,
    channel: String,
    createtime: String
    //createAt: {type: Date, default: Date.now, expires: 60}
    //createAt: {type: Date, default: Date.now, expires: 60}
});

UrlModelSchema.index({businessKey: 1});
UrlModelSchema.index({business: -1});
UrlModelSchema.index({businessUrl: -1});
UrlModelSchema.index({dynamicUrl: -1});
UrlModelSchema.index({channel: -1});
UrlModelSchema.index({createtime: -1});
//UrlModelSchema.path('createAt').index({expires: 1});

mongoose.model('URLModel', UrlModelSchema);