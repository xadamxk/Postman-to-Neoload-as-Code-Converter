var EnvironmentHelper = require("./EnvironmentHelper");
var TransactionHelper = require("./TransactionHelper");
var config = require("../config.js");
var ConfigHelper = require("./ConfigHelper");

'use strict';
module.exports = class NeoLoadAsCode {
    constructor(environmentLocation, environmentVariables) {
        this.output = {
            name: "name",
            user_paths: [],
        };
        this.environment = new EnvironmentHelper(environmentLocation, environmentVariables);
        this.configuration = new ConfigHelper(config);
    }

    addUserpath(name) {
        this.output.user_paths.push({
            name: name,
            actions: {
                steps: []
            }
        });
    }

    addTransactionContentsToSteps(userpathName, transaction, index) {
        // Find appropriate userpath
        let userpath = this.output.user_paths.filter(userpath => userpath.name == userpathName)[0];
        // Throw error if can't find matching userpath
        if (userpath == null)
            throw "Failed to find matching userpath (addTransactionContentsToSteps): " + userpathName;

        // Add transaction to userpath
        let currentTransactions = userpath.actions.steps;
        currentTransactions.push({
            transaction: {
                name: transaction["name"],
                steps: []
            }
        });
        // Add all requests within transaction
        let transactionContents = transaction["item"];
        // Loop contents of transaction
        transactionContents.forEach(transactionItem => {
            let myTransaction = new TransactionHelper(transactionItem);
            let requestHeaders = [];
            if (myTransaction.getHeaders()) {
                myTransaction.getHeaders().forEach(header => {
                    requestHeaders.push({
                        [this.environment.replaceVariables(header["key"])]:
                            this.environment.replaceVariables(header["value"])
                    });
                })
            }
            currentTransactions[index]["transaction"]["steps"].push({
                request: {
                    url: this.environment.replaceVariables(myTransaction.getRequestUrl()),
                    method: this.environment.replaceVariables(myTransaction.getRequestMethod()),
                    headers: requestHeaders, // already repalced variables
                    body: this.environment.replaceVariables(JSON.stringify(myTransaction.getBody()))
                }
            });

        });
    }

    addRequestToSteps(userpathName, url, method, transaction) {
        // Find appropriate userpath
        let userpath = this.output.user_paths.filter(userpath => userpath.name == userpathName)[0];
        // Throw error if can't find matching userpath
        if (userpath == null)
            throw "Failed to find matching userpath (addRequestToSteps): " + userpathName;

        //
        let myTransaction = new TransactionHelper(transaction);
        let requestHeaders = [];
        if (myTransaction.getHeaders()) {
            myTransaction.getHeaders().forEach(header => {
                requestHeaders.push({
                    [this.environment.replaceVariables(header["key"])]:
                        this.environment.replaceVariables(header["value"])
                });
            })
        }

        // Add request to userpath 
        let currentTransactions = userpath.actions.steps;
        currentTransactions.push({
            request: {
                url: this.environment.replaceVariables(url),
                method: this.environment.replaceVariables(method),
                headers: requestHeaders,
                body: this.environment.replaceVariables(JSON.stringify(myTransaction.getBody()))
            }
        })
    }

    addVariablesToOutput() {
        let onlyUseEnabledVariables = this.configuration.getOnlyUseEnabledVariables();
        let variableOutput = [];
        let variableList = this.environment["variables"];
        if (Array.isArray(variableList) && variableList.length) {
            if (onlyUseEnabledVariables) {
                variableList = variableList.filter(variableEntry => {
                    return (variableEntry["enabled"] == true)
                })
            }
            variableList.forEach(variable => {
                variableOutput.push({
                    constant: {
                        name: variable["key"],
                        value: (variable["value"] ? variable["value"] : "null")
                    }
                });
            })
            // Append to output
            this.output.variables = variableOutput;
        }
    }

    getOutput() {
        return this.output;
    }

    getSteps() {
        return this.output.user_paths.actions.steps;
    }
}