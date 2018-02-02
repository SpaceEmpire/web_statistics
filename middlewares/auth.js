var AuthProxy = require('../proxy/auth');
var config = require('../config');
var _ = require("underscore")._;
var logger = require('../util/log4jsUtil');
var utility = require('utility');
var moment = require('moment');

/**
 * 跳转到授权地址
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.authUser = function (req, res, next) {
    var session = req.session;
    if (_.isEmpty(session.address)) {
        session.address = moment().format("YYYYMMDD") + utility.randomString(10, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
    }
    next();
};

/**
 * 核对用户是否登陆
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.checkUser = function (req, res, next) {
    var session = req.session;
    if (_.isEmpty(session.isLogin) && !session.isLogin) {
        return res.redirect("/mhcensus/login");
    } else if (!_.isEmpty(session.isLogin) && session.isLogin && session.number != "18627171801" && session.number != "18918678910" && session.number != "15150654622") {
        return res.redirect("/mhcensus/login");
    } else {
        next();
    }
};

