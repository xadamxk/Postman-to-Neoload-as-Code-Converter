'use strict';
module.exports = class ConfigHelper {
    constructor(config) {
        this.config = config;
    }

    getInputCollection() {
        return this.config["options"]["input_files"]["postman_collection"];
    }

    getInputEnvironment() {
        return this.config["options"]["input_files"]["postman_environment"];
    }

    getOutputOutYaml() {
        return this.config["options"]["output_files"]["out_yaml"];
    }

    getOnlyUseEnabledVariables() {
        return this.config["options"]["postman"]["environment"]["onlyUseEnabledVariables"];
    }


}