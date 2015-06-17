// Dependencies
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var reference_link = 'https://www.processing.org/reference/';
var doc_links = [];
var documentation = [];
var scrapped = 0;

// Request the index of the documentation
request(reference_link, function(error, response, html) {
    if (!error && response.statusCode == 200) {
        getLinks(html);
    }
});

// Get the links
function getLinks(html) {

    var $ = cheerio.load(html);
    var base_url = "http://processing.org/reference/"

    // Iterate the links
    $('.ref-link').each(function(i, elem) {
        // Fix
        if ($(this).text().length < 200) {
            // Push the link to the array
            doc_links.push(base_url + $(this).attr('href'));
        }
    });

    // Debug
    console.log(doc_links);

    for (var i = 0; i < doc_links.length; i++) {
        scrap_doc(doc_links[i], function() {
            scrapped++;
            console.log(scrapped);
            if (scrapped > doc_links.length - 2) {
                fs.writeFileSync("./docs/p5doc.json", JSON.stringify(documentation));
            }
        });
    }

}




// Scrap one doc
function scrap_doc(link, callback) {

    // Request the html
    request(link, function(error, response, html) {
        if (!error && response.statusCode == 200) {
            getData(html);
        }
    });

    // function escapeRegExp(str) {
    //     return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    // }

    function getData(html) {
        var $ = cheerio.load(html);
        var doc = {};
        doc.name = $(".name-row").find("h3").text();
        doc.description = $("th:contains('Description')").next().text();
        doc.syntax = $("th:contains('Syntax')").next().text();
        doc.returns = $("th:contains('Returns')").next().text();
        doc.examples = [];
        $('.example').each(function(i, elem) {
            doc.examples.push($(this).text());
        });
        doc.examples_img = [];
        $('.example img').each(function(i, elem) {
            doc.examples_img.push(reference_link + $(this).attr('src'));
        });
        doc.parameters = [];
        $("th:contains('Parameters')").next().find('.code').each(function(i, elem) {
            var this_param = {}
            this_param.name = $(this).text();
            this_param.description = $(this).next().text();
            doc.parameters.push(this_param);
        });

        documentation.push(doc);
        callback();

        //fs.writeFileSync("./docs/" + doc.name + ".json", JSON.stringify(doc));
        //console.log(doc);
    }

}