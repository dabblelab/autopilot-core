const files = require('../files'),
      Assistants = require('./lib/assistants'),
      Tasks = require('./lib/tasks'),
      FieldTypes = require('./lib/field-types'),
      FieldValues = require('./lib/field-values'),
      Fields = require('./lib/fields'),
      Samples = require('./lib/samples'),
      ModelBuilds = require('./lib/model-builds');

const exportAssistant = async (assistantSid, twilioClient, recoverSchema = false) => {

    let sampleAssistant = {
      "friendlyName": "",
      "logQueries": true,
      "uniqueName": "",
      "defaults": {},
      "styleSheet": {},
      "fieldTypes": [],
      "tasks": [],
      "modelBuild" : {}
    };

    return await Promise.resolve()

      // fetch assistant info
      .then ( async () => {

        return Assistants.info(twilioClient, assistantSid);
      })

      // fetch assistant defaults and stylesheet
      .then(async (assistant) => {

        //sampleAssistant.assistantSid = assistant.sid;
        sampleAssistant.friendlyName = assistant.friendlyName;
        sampleAssistant.uniqueName = assistant.uniqueName;

        // fetch assistant defaults
        const defaults = await Assistants.defaults(twilioClient, assistant.uniqueName);

        sampleAssistant.defaults = defaults.data;

        // fetch assistant stylesheet
        const styleSheet = await Assistants.styleSheet(twilioClient, assistant.uniqueName);

        sampleAssistant.styleSheet = styleSheet.data;

          return assistant;
      })

      // fetch assistant field types/values
      .then( async (assistant) => {

        // fetch assistant field types
        const fieldTypes = await FieldTypes.list(twilioClient, assistant.uniqueName);

        let assistant_fieldTypes = [];

        for(let fieldType of fieldTypes){

          let values = [];

            // fetch assistant field type values
            const fieldValues = await FieldValues.list(twilioClient, assistant.uniqueName, fieldType.uniqueName);

            for(let fieldValue of fieldValues){

              values.unshift({
                "language": fieldValue.language,
                "value": fieldValue.value,
                "synonymOf": fieldValue.synonymOf
              })
            }

            assistant_fieldTypes.push({
              "uniqueName": fieldType.uniqueName,
              "values": values
            });
        }

        sampleAssistant.fieldTypes = assistant_fieldTypes;
        return assistant;
      })

      // fetch assistant tasks
      .then(async (assistant) => {

        // fetch assistant tasks
        const tasks = await Tasks.list(twilioClient, assistant.uniqueName);

        let assistant_tasks = [];

        for(let task of tasks){

          let actions = {}, task_samples = [], task_fields = [];

            // fetch assistant task actions
            const taskAction = await Tasks.taskActions(twilioClient, assistant.uniqueName, task.uniqueName);

            actions = taskAction.data;
            
            // fetch assistant task samples
            const samples = await Samples.list(twilioClient, assistant.uniqueName, task.uniqueName);

            for(let sample of samples){

              task_samples.push({
                "language": sample.language,
                "taggedText": sample.taggedText
              });
            }

            // fetch assistant task field
            const fields = await Fields.list(twilioClient, assistant.uniqueName, task.uniqueName);

            for(let field of fields){

              task_fields.push({
                "uniqueName": field.uniqueName,
                "fieldType": field.fieldType
              })
            }

            await assistant_tasks.push({
              "uniqueName": task.uniqueName,
              "actions": actions,
              "fields": task_fields,
              "samples": task_samples
            })
        }

        sampleAssistant.tasks = assistant_tasks;
        return assistant;

      })

      // fetch assistant model builds
      .then( async (assistant) => {

          const model_build = await ModelBuilds.list(twilioClient, assistant.uniqueName);

          if(model_build.length){

            sampleAssistant.modelBuild = {
                "uniqueName" : model_build[0].uniqueName
            }
          }

          const filename = files.createAssistantJSONFile(assistant.uniqueName, recoverSchema);

          await files.writeAssistantJSONFile(sampleAssistant, filename, recoverSchema);

          assistant.filename = filename;
          
          return assistant;
      })
      .catch((error) => {
        throw error;
      })
        
}

module.exports = exportAssistant;