var config = require("./config");


var apisBaseUrl = {
    mshurl: config.debug ? '' : '172.16.50.132',
    wxinfourl: config.debug ? 'http://101.95.49.5' : 'http://172.16.50.133:8096'
};

var apis = {

    //微信支付和配置相关
    wxUserInfo: "http://" + apisBaseUrl.wxinfourl + "/weixin/user/info?openid=",

    WXBaseAuthURL: "http://" + apisBaseUrl.mshurl + "/service/wxoauth/getBaseUrl",//微信基本授权地址

    //发送短信验证码
    smsSendCodeUrl: "",

    //认证短信验证码
    smsCodeVerifyUrl: "",

};

module.exports = apis;