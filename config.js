var path = require('path');

var config = {
    debug: false,
    app: 'mhcensus',
    name: 'Mohoo统计',//项目名称
    description: '',
    keywords: '',
    timeout: 10000,
    // wap 的域名
    host: '',

    wxstate: 'http://127.0.0.1:3001',

    db: "mongodb://127.0.0.1/statistics",

    //程序运行端口
    port: 3001,

    session_secret: 'gudaoxuan_wx_secret',

};

module.exports = config;
