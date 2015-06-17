var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

// Link
var test_link = "http://www.processing.org/reference/point_.html";
var p5_img_host = "http://processing.org/reference/";

// Requesting
request(test_link, function(error, response, html) {
    if (!error && response.statusCode == 200) {
        scrapPage(html);
    }
});

// Scrap page
function scrapPage(html) {
    var $ = cheerio.load(html);

    // Empty object
    var doc = {};

    // Doc name
    doc.name = $(".name-row").find("h3").text();

    // Doc description
    doc.description = $("th:contains('Description')").next().text();

    // Doc syntax
    doc.syntax = $("th:contains('Syntax')").next().text();

    // Doc returns
    doc.returns = $("th:contains('Returns')").next().text();

    // Examples
    doc.examples = [];
    $('.example').each(function(i, elem) {
        doc.examples.push($(this).text());
    });

    // Examples img
    doc.examples_img = [];
    $('.example img').each(function(i, elem) {
        doc.examples_img.push(p5_img_host + $(this).attr('src'));
    });

    // Parameters
    doc.parameters = [];
    $("th:contains('Parameters')").next().find('.code').each(function(i, elem) {
        var this_param = {}
        this_param.name = $(this).text();
        this_param.description = $(this).next().text();
        doc.parameters.push(this_param);
    });

    // Write the JSON
    fs.writeFileSync("./docs/" + doc.name + ".json", JSON.stringify(doc));
};