var request = require('request');
var fs = require('fs');

var path = require('path');
var Crawler = require("simplecrawler");

Crawler.maxDepth = 1;

Crawler.crawl("http://www.processing.org/reference/images/")
    .on("fetchcomplete", function(queueItem) {
        console.log("Completed fetching resource:", queueItem.url);
        var file_name = queueItem.url.split("/").reverse()[0];

        if (file_name.split(".").reverse()[0] === "png") {
            download(queueItem.url, file_name, function() {
                console.log("Downloaded " + file_name);
            });
        }

    });





var download = function(uri, filename, callback) {
    request.head(uri, function(err, res, body) {
        // Set the filename
        var file_name = "./imgs/" + path.sep + filename;
        // Request
        request(uri)
            .pipe(fs.createWriteStream(file_name))
            .on('close', callback);
    });
};