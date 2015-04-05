var request = require("request"),
	config = require("../config"),
	promise = require("bluebird"),
	async = require("async");

var filterCondition = function(asset, callback) {
	process.nextTick(function() {
		if (asset["type"] == "image\/gif") {
			callback(null, asset)
		} else {
			callback(null, null)
		}
	});
}

var filterForGifs = function(imgurAssets) {
	return new Promise(function(resolve){
		async.map(imgurAssets, filterCondition.bind(filterCondition), function(err, result){
			resolve(result)
		})
	});
}


module.exports = {
	retrieveAssets: function(queryString, sort, page) {
		return new Promise(function(resolve){
			url = "https://api.imgur.com/3/gallery/search/"
			if (sort) {
				url += sort + "/"
			} else {
				url += "viral/"
			}
			if (page) {
				url += page + "?"
			} else {
				url += "1?"
			}
			if (queryString) {
				url += "q_any=" + queryString
			} else {
				url += "q_any=justin bieber" 
			}
			options = {
				url: url,
				headers: {
					'Authorization': 'Client-ID ' + config.client_id
				}
			}
			request(options, function(error, response, body){
				body = JSON.parse(body)
				filteredResults = filterForGifs(body["data"]).then(function(response){
					response = response.filter(function(n){ return n != undefined }); 
					return resolve(response)
				})
			});
		})
	}
}