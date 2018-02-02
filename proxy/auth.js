var httpUtil = require('../util/HttpUtil');
var logger = require('../util/log4jsUtil');
var apis = require('../apis');

var AuthProxy = {};

/**
 * 获取基本授权URL
 * @param state
 * @param callback
 */
AuthProxy.getBaseAuthURL = function (state, callback) {
    httpUtil.post(apis.WXBaseAuthURL, {state: state}, function (error, response, content) {
        logger.info("获取微信基本授权回调地址：" + JSON.stringify(content));
        if (!error) {
            callback(null, content.redirect);
        } else {
            callback(null, "获取微信基本授权回调地址/服务器繁忙请稍候重试");
        }
    });
};

module.exports = AuthProxy;