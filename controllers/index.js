var moment = require('moment');
var EventProxy = require('eventproxy');
var logger = require("../util/log4jsUtil");
var ModelDaoProxy = require("../proxy/ModelDao");
var _ = require('underscore')._;
var utility = require('utility');
var async = require("async");


/**
 * 首页
 */
exports.index = function (req, res) {
    var channel = req.query.channel;
    var ipAddress;
    var forwardedIpsStr = req.header('x-forwarded-for');

    if (forwardedIpsStr) {
        var forwardedIps = forwardedIpsStr.split(',');
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    if (ipAddress.lastIndexOf(":") > 0) {
        ipAddress = ipAddress.substring(ipAddress.lastIndexOf(":") + 1, ipAddress.length);
    }

    if (_.isEmpty(channel)) {
        return res.redirect("http://127.0.0.1/html/system/505.html");
    }
    console.log(req.session.address);

    //访问记录
    ModelDaoProxy.saveRecords({
        channel: channel,
        address: req.session.address,
        createtime: moment().format("YYYY-MM-DD HH:mm:ss"),
        date: moment().format("YYYY-MM-DD")
    }, function (error, content) {

    });

    //根据渠道查询访问链接
    ModelDaoProxy.find({"channel": channel}, function (error, content) {
        if (error || _.isEmpty(content)) {
            res.redirect("http://127.0.0.1/html/system/505.html");
        } else {
            res.redirect(content[0].businessUrl);
        }
    });
};


/**
 * 统计主页面
 * @param req
 * @param res
 */
exports.home = function (req, res) {
    ModelDaoProxy.find({}, function (error, content) {
        if (error || _.isEmpty(content)) {
            res.render("home", {"title": "Mohoo统计", dataList: [], number: req.session.number});
        } else {
            res.render("home", {"title": "Mohoo统计", dataList: content, number: req.session.number});
        }
    });
};


/**
 * 添加统计页面
 * @param req
 * @param res
 */
exports.add = function (req, res) {
    var channel = utility.randomString(6, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
    res.render("add", {"title": "添加统计", "channel": channel, number: req.session.number});
};

/**
 * 添加统计
 * @param req
 * @param res
 */
exports.saveModel = function (req, res) {
    var business = req.body.business;
    var businessUrl = req.body.businessUrl;
    var dynamicUrl = req.body.dynamicUrl;
    var channel = req.body.channel;

    if (_.isEmpty(business) || _.isEmpty(businessUrl) || _.isEmpty(dynamicUrl) || _.isEmpty(channel)) {
        return res.json({"status": 40005, result: "系统繁忙"});
    }
    var param = {
        channel: channel,
        businessKey: moment().format("YYYYMMDDHHmmss") + utility.randomString(16, "1234567890"),
        business: business,
        businessUrl: businessUrl,
        dynamicUrl: dynamicUrl,
        createtime: moment().format("YYYY-MM-DD HH:mm:ss")
    };

    ModelDaoProxy.saveBestPayOrder(param, function (error, content) {
        if (error || _.isEmpty(content)) {
            res.json({"status": 40005, result: "系统繁忙"});
        } else {
            res.json({"status": 200, result: "添加成功"});
        }
    });
};

/**
 *
 * @param req
 * @param res
 */
exports.find = function (req, res) {
    var channel = req.query.channel;
    ModelDaoProxy.find({"channel": channel}, function (error, content) {
        if (error || _.isEmpty(content)) {
            res.json({"status": 40005, result: "系统繁忙"});
        } else {
            res.json({"status": 200, result: content});
        }
    });
};

/**
 * 删除统计
 * @param req
 * @param res
 */
exports.remove = function (req, res) {
    var channel = req.body.channel;
    var ep = new EventProxy();

    var param = {"channel": channel};

    //访问记录
    ep.bind("removeRecords", function () {
        ModelDaoProxy.removeRecords(param, function (error, content) {
        });
    });

    ModelDaoProxy.removeURLModel(param, function (error, content) {
        if (error || _.isEmpty(content)) {
            res.json({"status": 40005, result: "系统繁忙"});
        } else {
            ep.emit("removeRecords");
            res.json({"status": 200, result: content});
        }
    });
};


/**
 * 柱状图统计
 * @param req
 * @param res
 */
exports.zhuZhuangTu = function (req, res) {
    var channel = req.query.channel;
    var param = {match: {"channel": channel}, groupType: "$date"};
    ModelDaoProxy.filterRecords(param, function (error, content) {
        //logger.info(JSON.stringify(content));
        if (error || _.isEmpty(content)) {
            res.json({"status": 40005, result: "系统繁忙"});
        } else {
            res.json({"status": 200, result: content});
        }
    });
};

/**
 * 折线图统计
 * @param req
 * @param res
 */
exports.zheXianTu = function (req, res) {
    var channel = req.query.channel;

    var ep = new EventProxy();

    ep.bind("QueryUV", function (paramData) {
        async.map(paramData.dateArr, function (item, callback) {
            ModelDaoProxy.filterRecords({
                match: {"channel": channel, "date": item},
                groupType: "$address"
            }, function (error, content) {
                if (error || _.isEmpty(content)) {
                    callback(null, []);
                } else {
                    callback(null, {"date": item, "count": content.length});
                }
            });
        }, function (error, result) {
            if (error || result.length < 0) {
                res.json({"status": 40005, result: "系统繁忙"});
            } else {
                var uvDataArr = new Array();
                for (var i = 0; i < result.length; i++) {
                    uvDataArr.push(result[i].count);
                }
                res.json({
                    status: 200,
                    dateArr: paramData.dateArr,
                    pvDataArr: paramData.pvDataArr,
                    uvDataArr: uvDataArr
                });
            }
        });
    });

    ModelDaoProxy.filterRecords({match: {"channel": channel}, groupType: "$date"}, function (error, content) {
        if (error || _.isEmpty(content)) {
            res.json({"status": 40005, result: "系统繁忙"});
        } else {
            if (content.length > 0) {
                var pvDataArr = new Array();
                var dateArr = new Array();
                for (var i = content.length - 1; i > -1; i--) {
                    dateArr.push(content[i]["_id"]);
                    pvDataArr.push(content[i]["count"]);
                }
                ep.emit("QueryUV", {pvDataArr: pvDataArr, dateArr: dateArr});
            } else {
                res.json({"status": 0, result: "无数据"});
            }
        }
    });
};


/**
 * 统计pv
 * @param req
 * @param res
 */
exports.PvCount = function (req, res) {
    var channel = req.query.channel;
    ModelDaoProxy.recordsCounts({"channel": channel}, function (error, content) {
        //console.log("PV: " + JSON.stringify(content));
        if (error) {
            res.json({status: 40005, channel: channel, PvCount: 0});
        } else {
            res.json({status: 200, channel: channel, PvCount: content});
        }
    });
};

/**
 * 统计uv
 * @param req
 * @param res
 * @constructor
 */
exports.UvCount = function (req, res) {
    var channel = req.query.channel;
    ModelDaoProxy.filterRecords({match: {"channel": channel}, groupType: "$address"}, function (error, content) {
        //console.log("UV: " + JSON.stringify(content));
        if (error) {
            res.json({status: 40005, channel: channel, UvCount: 0});
        } else {
            res.json({status: 200, channel: channel, UvCount: content.length});
        }
    });
};