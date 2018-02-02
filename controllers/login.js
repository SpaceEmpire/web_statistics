var moment = require('moment');
var EventProxy = require('eventproxy');
var logger = require("../util/log4jsUtil");
var ModelDaoProxy = require("../proxy/ModelDao");
var _ = require('underscore')._;
var utility = require('utility');
var async = require("async");
var SmsProxy = require('../proxy/sms');


/**
 * 首页
 */
exports.index = function (req, res) {
    res.render("login");
};


/**
 * 发送手机验证码
 * @param req
 * @param res
 */
exports.sendCode = function (req, res) {
    var number = req.body.number;

    SmsProxy.sendCode(number, function (error, content) {
        try {
            if (error) {
                res.json({status: 40005, errMsg: "验证码发送失败"});
            } else {
                if (content.status == 200) {
                    res.json({status: 200, result: content.data});
                } else {
                    res.json({status: 0, result: content.data});
                }
            }
        } catch (e) {
            res.json({status: 40005, result: "验证码发送失败"});
        }
    });
};

/**
 * 登陆
 * @param req
 * @param res
 */
exports.login = function (req, res) {
    var number = req.body.number;
    var codeNum = req.body.codeNum;
    // SmsProxy.codeVerifyUrl(number, codeNum, function (error, content) {
    //     try {
    //         if (error) {
    //             res.json({status: 40005, errMsg: "登陆失败"});
    //         } else {
    //             if (content.status == 200) {
    //                 req.session.isLogin = true;
    //                 req.session.number = number;
    //                 res.json({status: 200, result: ""});
    //             } else {
    //                 res.json({status: 201, result: "验证码错误"});
    //             }
    //         }
    //     } catch (e) {
    //         res.json({status: 40005, result: "登陆失败"});
    //     }
    // });
  req.session.isLogin = true;
  req.session.number = number;
  res.json({status: 200, result: ""});
};

/**
 * 退出
 * @param req
 * @param res
 */
exports.loginExit = function (req, res) {
    req.session.destroy();
    res.redirect("/mhcensus/login");
};