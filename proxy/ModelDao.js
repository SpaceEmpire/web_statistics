var EventProxy = require('eventproxy');
var URLModel = require('../models').URLModel;
var logger = require("../util/log4jsUtil");
var RecordsModel = require('../models').RecordsModel;

var ModelDaoProxy = {};

/**
 * 添加统计
 * @param param
 * @param callback
 */
ModelDaoProxy.saveBestPayOrder = function (param, callback) {

    var ep = new EventProxy();

    ep.bind('error', function (err) {
        // 卸载掉所有handler
        ep.unbind();
        // 异常回调
        callback(err);
    });

    ep.bind("saveUrlModel", function (param) {
        var urlModelEntity = new URLModel({
            businessKey: param.businessKey,
            business: param.business,
            businessUrl: param.businessUrl,
            dynamicUrl: param.dynamicUrl,
            channel: param.channel,
            createtime: param.createtime
        });
        urlModelEntity.save(function (err, doc) {
            if (err) {
                callback(err);
            } else {
                callback(null, doc);
            }
        });
    });

    ep.emit("saveUrlModel", param);
};

/**
 * 查询统计
 * @param param
 * @param callback
 */
ModelDaoProxy.find = function (param, callback) {
    URLModel.find(param, function (error, content) {
        callback(error, content);
    });
};

/**
 * 根据条件查询数量
 * @param param
 * @param callback
 */
ModelDaoProxy.countByParam = function (param, callback) {
    URLModel.count(param, function (error, content) {
        callback(error, content);
    });
};

/**
 * 查询访问量
 * @param param
 * @param callback
 */
ModelDaoProxy.recordsCounts = function (param, callback) {
    RecordsModel.count(param, function (error, content) {
        callback(error, content);
    });
};

/**
 * 访问记录筛选
 * @param param
 * @param callback
 */
ModelDaoProxy.filterRecords = function (param, callback) {
    var temp = new Array();
    temp.push({$match: param.match});
    temp.push({$group: {_id: param.groupType, count: {$sum: 1}}});
    RecordsModel.aggregate(temp, function (error, content) {
        callback(error, content);
    });
};


/**
 * 存储访问量
 * @param param
 * @param callback
 */
ModelDaoProxy.saveRecords = function (param, callback) {

    var ep = new EventProxy();

    ep.bind('error', function (err) {
        // 卸载掉所有handler
        ep.unbind();
        // 异常回调
        callback(err);
    });

    ep.bind("saveRecordsModel", function (param) {
        var RecordsModelEntity = new RecordsModel({
            channel: param.channel,
            address: param.address,
            createtime: param.createtime,
            date: param.date
        });
        RecordsModelEntity.save(function (err, doc) {
            if (err) {
                callback(err);
            } else {
                callback(null, doc);
            }
        });
    });

    ep.emit("saveRecordsModel", param);
};

/**
 * 删除访问记录
 * @param param
 * @param callback
 */
ModelDaoProxy.removeRecords = function (param, callback) {
    RecordsModel.remove(param, function (error, content) {
        callback(error, content);
    });
};

/**
 * 删除统计
 * @param param
 * @param callback
 */
ModelDaoProxy.removeURLModel = function (param, callback) {
    URLModel.remove(param, function (error, content) {
        callback(error, content);
    });
};

module.exports = ModelDaoProxy;