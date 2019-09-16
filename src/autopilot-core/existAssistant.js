const Assistants = require('./lib/assistants');

const existAssistant = async (modelPath, twilioClient) => {

    const fs = require('fs');

    if (!fs.existsSync(modelPath)) {

        throw new Error(`The file ${modelPath} was not be found.`)
    }
    
    const schema = require(modelPath);

    if (!schema.hasOwnProperty('friendlyName') && !schema.hasOwnProperty('uniqueName')) {

        throw new Error(`A 'friendlyName' and/or 'uniqueName' must be defined in your schema.`)
    }


    return await Promise.resolve()

        .then(async() => {

            const assistant = await Assistants.info(twilioClient, schema.uniqueName);
            return true;
        })
        .catch((error) => {

            if(error.exitCode === 20404){

                return false;
            }else{

                throw error;
            }
        })
    
}

module.exports = existAssistant;