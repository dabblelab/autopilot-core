const Assistants = require('./lib/assistants'),
      Tasks = require('./lib/tasks'),
      FieldTypes = require('./lib/field-types'),
      FieldValues = require('./lib/field-values'),
      Fields = require('./lib/fields'),
      Samples = require('./lib/samples'),
      ModelBuilds = require('./lib/model-builds');

const deleteAssistant = async (assistantIdentifier,twilioClient) => {

  // Global Variables
  let tasks = [];
  return await Promise.resolve()

    //remove samples and fields
    .then( async () => {

      tasks = await Tasks.list(twilioClient, assistantIdentifier);

      for(let task of tasks){

        // task samples
        const samples = await Samples.list(twilioClient, assistantIdentifier, task.uniqueName);

        for( let sample of samples){

          await Samples.remove(twilioClient, assistantIdentifier, task.uniqueName, sample.sid);
        }

        // task fields
        const fields = await Fields.list(twilioClient, assistantIdentifier, task.uniqueName);

        for( let field of fields){

          await Fields.remove(twilioClient, assistantIdentifier, task.uniqueName, field.uniqueName);
        }
      }

      return assistantIdentifier;
    })

    //remove field type and its values
    .then(async (assistant) => {

      const fieldTypes = await FieldTypes.list(twilioClient, assistantIdentifier);

      for( let fieldType of fieldTypes){

        // field values
        const fieldValues = await FieldValues.list(twilioClient, assistantIdentifier, fieldType.uniqueName);

        for( let fieldValue of fieldValues){

          await FieldValues.remove(twilioClient, assistantIdentifier, fieldType.uniqueName, fieldValue.sid);
        }

        // field types
        await FieldTypes.remove(twilioClient, assistantIdentifier, fieldType.uniqueName);
      }

      return assistant;
    })

    //remove tasks and model builds
    .then( async (assistant) => {

      for( let task of tasks){

        await Tasks.remove(twilioClient, assistantIdentifier, task.uniqueName);
      }

      const modelBuilds = await ModelBuilds.list(twilioClient, assistantIdentifier);

      for(let modelBuild of modelBuilds){

        await ModelBuilds.remove(twilioClient, assistantIdentifier, modelBuild.uniqueName);
      }

      return assistant;
    })

    //remove assistant
    .then(async (assistant) => {

      return Assistants.remove(twilioClient, assistantIdentifier);
    })

    .catch(err => {
      throw err;
    })

}

module.exports = deleteAssistant;