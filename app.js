var fs = require('fs');
const config = require("./config.js");
var TransactionHelper = require("./Classes/TransactionHelper");
var NeoLoadAsCodeHelper = require("./Classes/NeoLoadAsCodeHelper");
var ConfigHelper = require("./Classes/ConfigHelper");

// Instantiate configuration
let configuration = new ConfigHelper(config);
// Read given collection
fs.readFile(configuration.getInputCollection(), 'utf8', function (err1, contents) {
    if (err1) return console.log("COULD NOT READ COLLECTION: " + err1);
    var collection = JSON.parse(contents);
    var userpaths = collection["item"];
    // Read given environment
    fs.readFile(configuration.getInputEnvironment(), 'utf8', function (err2, contents) {
        if (err2) return console.log("COULD NOT READ ENVIRONMENT: " + err2);
        let env = JSON.parse(contents);
        // Filter variables by enabled, if option is enabled
        if (configuration.getOnlyUseEnabledVariables()) {
            env["values"].filter(variables => variables["enabled"] == true);
        }
        let environmentVariables = env["values"];
        // ----- GETTING ENVIRONMENT FILES LOGIC IS COMPLETE HERE -----

        // Instantiate NLAC Helper w/ environment file
        let output = new NeoLoadAsCodeHelper(configuration.getInputEnvironment(), environmentVariables);
        // Loop Userpaths
        userpaths.forEach(userpath => {
            // Loop items in transactions
            let transactions = userpath["item"];
            // If Userpath has content
            if (transactions.length > 0) {
                output.addUserpath(userpath["name"]);
                transactions.forEach((transaction, index) => {
                    let myTransaction = new TransactionHelper(transaction);
                    // If item has "request" key, then is request, if not - folder
                    if (myTransaction.isRequest()) {
                        output.addRequestToSteps(userpath["name"], myTransaction.getRequestUrl(), myTransaction.getRequestMethod(), transaction);
                    } else {
                        // Add transaction to object and parse everything in it - 1 level deep
                        output.addTransactionContentsToSteps(userpath["name"], transaction, index)
                    }
                });
            }
        });
        // Add variables
        output.addVariablesToOutput();

        var yaml = require('write-yaml');
        yaml(configuration.getOutputOutYaml(), output["output"], function (err) {
            // catch error?
        });
    });
});