var path    = require("path");
var express = require("express");
var app     = express();
var porty   = process.env.PORT || 8080;
var months  = {"0":"January", "1":"February", "2":"March", "3":"April",
			   "4":"May", "5":"June", "6":"July", "7":"August", "8":"September",
			   "9":"October", "10":"November", "11":"December"};
var obj     = {"unix":null,"natural":null};


function dformat(date){
	return months[date.getMonth().toString()]+" "+
	date.getDate().toString()+", "+date.getFullYear().toString();
}

app.get("/",function(req,res){
	res.sendFile(path.join(__dirname +"/home.html"));
})

app.get("/:mth%:dat%:yer", function(req,res){
	var qpath = req.url.slice(1).split("%");   // month date year
	var month_ = qpath[0].slice(0,3);
	var date_  = qpath[1].slice(2,qpath[1].length);
	var year_  = qpath[2].slice(2,qpath[2].length);
	date_ = ((date_[date_.length-1] === ",")? date_.slice(0,date_.length-1) : date_);
	
	var dt = new Date(month_+" "+date_+" "+year_);
	if (isNaN(dt.getTime())){
		return res.send(obj);
	}
	obj["unix"] = dt.getTime()/1000;
	obj["natural"] = dformat(dt);
	res.set("title","TimeStamp");
	res.send(obj);
});

app.get("/:unix([0-9]+)",function(req,res){
	var date = new Date(Number(req.params.unix) * 1000);
	obj["unix"] = Number(req.params.unix);
	obj["natural"] = dformat(date);
	res.send(obj);
});

var listener = app.listen(porty,function(){
	var now = new Date();
	console.log("Time : "+ now.toString());
	console.log("Your app is listening on port "+ listener.address().port);
});