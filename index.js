var config = require('./config');

/**
 * Module dependencies
 */
var logger = require("./util/log4jsUtil");
var path = require('path');
var express = require('express');
var session = require('express-session');

var bodyParser = require('body-parser');
var moment = require('moment');
var router = require('./router');
var ModelDao = require('./proxy/ModelDao');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require('underscore')._;
var MongoStore = require('connect-mongo')(session);

var urlinfo = require('url').parse(config.host);
config.hostname = urlinfo.hostname || config.host;
app.set('/views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.set('x-powered-by', false);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(require('cookie-parser')(config.session_secret));
app.use(session({
    secret: config.session_secret,
    name: "session-name-socket-io",
    store: new MongoStore({
        url: config.db
    }),
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 1000 * 60 * 60}
}));

//静态文件目录
var staticDir = path.join(__dirname, 'static');

app.use(function (req, res, next) {
    app.locals.app = config.app;
    next();
});
app.use('/' + config.app + '/static', express.static(staticDir));
app.use('/', router);


//在线用户
var onlineUsers = {};
//当前在线人数
var onlineCount = 0;

io.on('connection', function (socket) {
    console.log('a user connected');
    ////监听新用户加入
    //socket.on('login', function (obj) {
    //    //将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
    //    socket.name = obj.userid;
    //
    //    //检查在线列表，如果不在里面就加入
    //    if (!onlineUsers.hasOwnProperty(obj.userid)) {
    //        onlineUsers[obj.userid] = obj.username;
    //        //在线人数+1
    //        onlineCount++;
    //    }
    //
    //    //向所有客户端广播用户加入
    //    io.emit('login', {onlineUsers: onlineUsers, onlineCount: onlineCount, user: obj});
    //
    //    console.log(obj.username + '加入了排队');
    //});

    ////监听用户退出
    //socket.on('disconnect', function () {
    //    //将退出的用户从在线列表中删除
    //    if (onlineUsers.hasOwnProperty(socket.name)) {
    //        //退出用户的信息
    //        var obj = {userid: socket.name, username: onlineUsers[socket.name]};
    //
    //        //删除
    //        delete onlineUsers[socket.name];
    //
    //        //在线人数-1
    //        onlineCount--;
    //
    //        //向所有客户端广播用户退出
    //        io.emit('logout', {onlineUsers: onlineUsers, onlineCount: onlineCount, user: obj});
    //        console.log(obj.username + '退出了排队');
    //    }
    //});

    socket.on('getUVRecordsCount', function (channel) {
        ModelDao.filterRecords({match: {"channel": channel}, groupType: "$address"}, function (error, content) {
            //logger.info(JSON.stringify(content));
            if (error || _.isEmpty(content)) {
                io.emit('getUVRecordsCount', {channel: channel, UvCount: 0});
            } else {
                io.emit('getUVRecordsCount', {channel: channel, UvCount: content.length});
            }
        });
    });

    //返回当前在线人数
    socket.on('getRecordsCount', function (channel) {
        ModelDao.recordsCounts({"channel": channel}, function (error, content) {
            //logger.info(JSON.stringify(content));
            if (error) {
                io.emit('getRecordsCount', {channel: channel, PvCount: 0});
            } else {
                io.emit('getRecordsCount', {channel: channel, PvCount: content});
            }
        });
    });
});


http.listen(config.port, function () {
    console.log('listening on *:' + config.port);
});

module.exports = app;