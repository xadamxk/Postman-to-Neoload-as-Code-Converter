## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Install the following:
- [Node](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/en/docs/install#windows-stable)
- [NeoLoad](https://www.neotys.com/support/download-neoload)

### Install Dependencies & Configuration

- Change directory into the project directory
- Pull in dependencies with the following command:
```
yarn
```
- Copy collection & environment to project directory per config.js
- Update Neoload Commmand Location in config.js
- Create a new NeoLoad project via the UI (save and exit NeoLoad)

### Running the Project (Generating Neoload-as-Code YAML)

- Once the collection and environment are preset, running the following command will generate an output file:
```
yarn start
```

### Importing Neoload-as-Code as Project

- Change directory to NeoLoadCmd.exe (ex. C:\Program Files\NeoLoad 7.0\bin)
- Run the following command:
```
NeoLoadCmd.exe -project "C:\Users\{Username}\Documents\NeoLoad Projects\{ProjectName}\{ProjectName}.nlp" "C:\Users\{Username}\Documents\Projects\postman-to-nlascode\output.yaml"
```
- If the coversion was successful, NeoLoad UI will have the project loaded. Remember to save!

Example:
```
C:\Program Files\NeoLoad 7.0\bin>NeoLoadCmd.exe -project "C:\Users\S104445\Documents\NeoLoad Projects\MyProject\MyProject\MyProject.nlp" "C:\Users\S104445\Documents\Projects\postman-to-nlascode\output.yaml"
```