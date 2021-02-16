var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res) {
  var db = req.db;
  req.body.ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  req.body.time = req._startTime;
  console.log(req.body);
  var collection = db.get('entries');
  
  collection.insert(req.body, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
	
  });
  
});
router.post('/event', function(req, res) {
  var db = req.db;
  req.body.ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
  req.body.time = req._startTime;
  console.log(req.body);
  var collection = db.get('events');
  
  collection.insert(req.body, function(err, result){
    res.send(
      (err === null) ? { msg: '' } : { msg: err }
    );
	
  });
  
});

module.exports = router;
