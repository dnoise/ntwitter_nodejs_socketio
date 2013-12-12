var express = require("express"), 
http = require("http"),
app = express(),
server = http.createServer(app),
path = require('path'),
twitter = require('ntwitter');
 
app.use(express.static(path.join(__dirname, 'public')));
 
app.set("views",__dirname + "/views");
app.configure(function(){
    app.use(express.static(__dirname));
});
 
server.listen(3000);
 
var io = require("socket.io").listen(server);

//configuración de los datos de nuestra app de twitter
var credentialsTwitter = new twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret:''
});


app.get("/", function(req,res)
{
    res.render("index.jade", {title : "Twitter in stream with NodeJS, Socket.IO and jQuery"});
});

//más info de status/filter en 
//https://dev.twitter.com/docs/streaming-apis/parameters
io.sockets.on('connection', function(socket) 
{
  credentialsTwitter.stream('statuses/filter', 
  	{
	  	'track':'playstation',//filtramos por la palabra playstation
	  	'filter_level':'medium',//el nivel del filtro
	  	'language':'es,en'//filtramos solo en español y en inglés
	},
    function(stream) 
    {
	    stream.on('data',function(data)
	    {
	      	socket.emit('twitter',data);
	    });
    });
});

