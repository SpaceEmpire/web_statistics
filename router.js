var express = require('express');
var router = express.Router();
var auth = require('./middlewares/auth');
var indexContr = require('./controllers/index');
var loginContr = require('./controllers/login');
var serviceName = "/mhcensus";

router.get(serviceName + "/index", auth.authUser, indexContr.index);

router.get(serviceName + "/home", auth.checkUser, indexContr.home);

router.get(serviceName + "/add", auth.checkUser, indexContr.add);

router.post(serviceName + "/saveModel", auth.checkUser, indexContr.saveModel);

router.get(serviceName + "/find", auth.checkUser, indexContr.find);

router.get(serviceName + "/zhuZhuangTu", auth.checkUser, indexContr.zhuZhuangTu);

router.post(serviceName + "/remove", auth.checkUser, indexContr.remove);

router.get(serviceName + "/zheXianTu", auth.checkUser, indexContr.zheXianTu);

router.get(serviceName + "/PvCount", auth.checkUser, indexContr.PvCount);

router.get(serviceName + "/UvCount", auth.checkUser, indexContr.UvCount);

router.get(serviceName + "/login", loginContr.index);

router.post(serviceName + "/sendCode", loginContr.sendCode);

router.post(serviceName + "/login", loginContr.login);

router.get(serviceName + "/loginExit", loginContr.loginExit);

module.exports = router;