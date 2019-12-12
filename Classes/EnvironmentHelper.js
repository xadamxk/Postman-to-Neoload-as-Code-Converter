var fs = require('fs');
const config = require("../config.js");

'use strict';
module.exports = class EnvironmentHelper {
    constructor(envLocation, variables) {
        this.location = envLocation;
        this.variables = variables;
    }

    // private
    getVarValue(desiredVariableName) {
        let desiredVariableValue = null;
        try {
            desiredVariableValue = this.variables.filter(values => values.key == desiredVariableName)[0];
        } catch {
            throw "Unable to filter environment variables by provided variable: " + desiredVariableName
        }
        if (desiredVariableValue == null) {
            // TODO: How to format for variables not found in environment file
            //     - Consider adding to list and give user list afterwards
            return "${" + desiredVariableName + "}";
        }
        // Hacky workaround to only replace URLs
        if (desiredVariableValue["value"].includes("http")) {
            return desiredVariableValue["value"];
        }
        return ("${" + desiredVariableName + "}");
    }

    // public
    replaceVariables(dataString) {
        if (!dataString) return dataString;
        const startSeperator = "{{";
        const endSeperator = "}}";
        // Credit: https://stackoverflow.com/a/17606289
        String.prototype.replaceAll = function (search, replacement) {
            var target = this;
            return target.replace(new RegExp(search, 'g'), replacement);
        };
        // Credit: https://stackoverflow.com/a/38885885
        var getFromBetween = {
            results: [],
            string: "",
            getFromBetween: function (sub1, sub2) {
                if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
                var SP = this.string.indexOf(sub1) + sub1.length;
                var string1 = this.string.substr(0, SP);
                var string2 = this.string.substr(SP);
                var TP = string1.length + string2.indexOf(sub2);
                return this.string.substring(SP, TP);
            },
            removeFromBetween: function (sub1, sub2) {
                if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return false;
                var removal = sub1 + this.getFromBetween(sub1, sub2) + sub2;
                this.string = this.string.replace(removal, "");
            },
            getAllResults: function (sub1, sub2) {
                // first check to see if we do have both substrings
                if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

                // find one result
                var result = this.getFromBetween(sub1, sub2);
                // push it to the results array
                this.results.push(result);
                // remove the most recently found one from the string
                this.removeFromBetween(sub1, sub2);

                // if there's more substrings
                if (this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
                    this.getAllResults(sub1, sub2);
                }
                else return;
            },
            get: function (string, sub1, sub2) {
                this.results = [];
                this.string = string;
                this.getAllResults(sub1, sub2);
                return this.results;
            }
        };
        // Loop variables found in string and replace with matching value
        getFromBetween.get(dataString, startSeperator, endSeperator).forEach(foundVariable => {
            dataString = dataString.replaceAll(startSeperator + foundVariable + endSeperator, this.getVarValue(foundVariable))
        });
        return dataString;
    }
}