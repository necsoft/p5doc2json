var request = require('request');
var cheerio = require('cheerio');
var chalk = require('chalk');

var reference_link = 'https://www.processing.org/reference/';
var reference_link_html;

clearConsole();
chalk_log("title", "Processing Documentation to JSON");

// Request the reference html
chalk_log("info", "Requesting the documentation");

// Hago el request a la pagina para traerme el string del html
request(reference_link, function(error, response, html) {
    if (!error && response.statusCode == 200) {
        reference_link_html = html;
        chalk_log("ok", "Received the HTML of the index");
        getLinks();
    }
});

// Pido todos los links
function getLinks() {
    var $ = cheerio.load(reference_link_html);

    chalk_log("info", "Requesting the links");
    chalk_log("info", "There are " + $('.ref-link').length + " elements");

    $('.ref-link').each(function(i, elem) {
        // Chequeo si no es el error que estaba llegando
        if ($(this).text().length < 200) {
            console.log("\n");
            console.log(chalk.white.bgCyan.bold("Nombre: " + $(this).text()));
            console.log(chalk.gray.bgCyan.bold("Link: " + reference_link + $(this).attr('href')));
        }
    })
}

/*
  clearConsole()

  Limpia la consola.

 */

function clearConsole() {
    process.stdout.write("\u001b[2J\u001b[0;0H"); // Clear Console
}

/*
  chalk_log()

  Arma el log del chalk

 */

function chalk_log(type, message) {

    if (type === "title") {
        console.log(chalk.black.bgCyan.bold(message));
    }

    if (type === "info") {
        console.log(chalk.cyan.bgBlack.bold(message));
    }

    if (type === "ok") {
        console.log(chalk.green.bgBlack.bold(message));
    }

}