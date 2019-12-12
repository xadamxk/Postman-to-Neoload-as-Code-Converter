'use strict';
module.exports = class Transaction {
    constructor(transaction) {
        this.transaction = transaction;
    }

    isRequest() {
        return this.transaction.hasOwnProperty("request");
    }

    getRequestUrl() {
        try {
            return this.transaction["request"]["url"]["raw"];
        } catch {
            return null;
        }
    }

    getRequestMethod() {
        try {
            return this.transaction["request"]["method"];
        } catch {
            return null;
        }
    }

    getHeaders() {
        try {
            return this.transaction["request"]["header"];
        } catch {
            return null;
        }
    }

    getBody() {
        // TODO: Logic for different types of request bodies


        try {
            let bodyRaw = this.transaction["request"]["body"]["raw"];
            if (!bodyRaw) {
                return;
            } else {
                return JSON.parse(bodyRaw);
            }
        } catch {
            return null;
        }
    }
}