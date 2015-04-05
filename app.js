var application_root = __dirname, 
	express = require("express"),
	http = require("http"),
	path = require("path"),
	imgur = require("./helpers/imgur"),
	config = require("./config.json"),
	bodyParser = require('body-parser');

var app = express();

app.use(express.static(path.join(application_root, "public")));
app.use(bodyParser.json());

app.get('/search', function (req, res){
	sort = req.query.sort
	page = req.query.page
	query_string = req.query.query_string
	imgur.retrieveAssets(query_string, sort, page).then(function(filteredAssets){
		res.send(filteredAssets)
	});
})

app.get('/', function(req, res){
	res.sendFile(__dirname+'/public/index.html');
})

var server = http.createServer(app);

server.listen(3000);