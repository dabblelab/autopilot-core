const fs = require('fs'),
        fieldValue = require('./fieldType/fieldValue'),
        Assistants = require('./lib/assistants');


const bulkUploadFieldValues = async (assistantSid, fieldUniqueName, csvFile, twilioClient) => {

  if (!fs.existsSync(csvFile)) {

    throw new Error(`The file ${csvFile} was not be found.`)
  }

  return await Promise.resolve()

    
    
    //assistant info
    .then ( async () => {

      return Assistants.info(twilioClient, assistantSid);
    })

    .then( async (assistant) => {

      await fieldValue.addFieldValues(twilioClient, assistant.uniqueName, fieldUniqueName, csvFile)
      return assistant;
    })

    .catch(err => {
      throw err;
    })

}

module.exports = bulkUploadFieldValues;