var validator = require('validator');
var httpUtil = require('../util/HttpUtil');
var urlKit = require('../apis');

var SmsProxy = {};

/**
 * 根据设备号码进行信息发送
 * @param data 需要发送的模板数据
 * @param callback
 */
SmsProxy.send = function (data, callback) {
    if (validator.isMobilePhone(data.number, "zh-CN")) {
        //调用Rest api 接口
        callback(null, 'ok');
    }
};

/**
 * 发送手机验证码
 * @param number
 * @param callback
 */
SmsProxy.sendCode = function (number, callback) {
    if (validator.isMobilePhone(number, "zh-CN")) {
        //调用Rest api 接口
        var data = {mobile: number};
        httpUtil.post(urlKit.smsSendCodeUrl, data, function (err, res, data) {
            callback(null, data);
        });
    } else {
        callback("手机号码错误");
    }
};

/**
 * 验证手机验证码
 * @param number
 * @param code
 * @param callback
 */
SmsProxy.codeVerifyUrl = function (number, code, callback) {
    if (validator.isMobilePhone(number, "zh-CN")) {
        //调用Rest api 接口
        var data = {mobile: number, code: code};
        httpUtil.post(urlKit.smsCodeVerifyUrl, data, function (err, res, data) {
            callback(null, data);
        });
    } else {
        callback("手机号码错误");
    }
};

module.exports = SmsProxy;
