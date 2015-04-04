var request = require("request"),
	config = require("../config"),
	promise = require("bluebird"),
	async = require("async");

var filterCondition = function(asset, callback) {
	process.nextTick(function() {
		if (asset["type"] == "image\/gif") {
			callback(null, asset)
		} else {
			err = "no asset"
			callback(err, null)
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
	retrieveAssets: function(section, sort, page) {
		return new Promise(function(resolve){
			url = "https://api.imgur.com/3/gallery/"
			if (section) {
				url += section + "/"
			} else {
				url += "hot/"
			}
			if (sort) {
				url += sort + "/"
			} else {
				url += "viral/"
			}
			if (page) {
				url += page + "/"
			} else {
				url += "1/"
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
					console.log(response)
					return resolve(response)
				})
			});
		})
	}
}