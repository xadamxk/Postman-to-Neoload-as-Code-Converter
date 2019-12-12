module.exports = {
    options: {
        input_files: {
            postman_collection: "./collection.json", // Collection file location (default: ./collection.json)
            postman_environment: "./environment.json", // Environment file location (default: ./environment.json)
        },
        output_files: {
            out_yaml: "output.yaml", // Output file name (default: output.yaml)
        },
        postman: {
            collection_schema: "v2.1.0", // Postman collection schema (default: v2.1.0)
            environment: {
                onlyUseEnabledVariables: true, // Omit disabled variables (default: true)
            },
        },
        neoload: {
            neoloadCommandLocation: "C:\\Program Files\\NeoLoad 7.0\\bin"
        }
    }
};