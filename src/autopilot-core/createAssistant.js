const fs = require('fs'),
      Assistants = require('./lib/assistants'),
      Tasks = require('./lib/tasks'),
      FieldTypes = require('./lib/field-types'),
      FieldValues = require('./lib/field-values'),
      Fields = require('./lib/fields'),
      Samples = require('./lib/samples'),
      ModelBuilds = require('./lib/model-builds');

const createAssistant = async (schemaFile, twilioClient) => {

  if (!fs.existsSync(schemaFile)) {

    throw new Error(`The file ${schemaFile} was not be found.`)
  }

  const schema = require(schemaFile);

  if (!schema.hasOwnProperty('friendlyName') && !schema.hasOwnProperty('uniqueName')) {

    throw new Error(`A 'friendlyName' and/or 'uniqueName' must be defined in your schema.`)
  }

  let assistant_Obj = {
    friendlyName: schema.friendlyName || schema.uniqueName,
    uniqueName: schema.uniqueName,
    logQueries: true,
  };

  if(schema.hasOwnProperty('defaults') && schema.defaults.hasOwnProperty('defaults'))
    assistant_Obj["defaults"] = schema.defaults;
  
  if(schema.hasOwnProperty('styleSheet') && schema.styleSheet.hasOwnProperty('style_sheet'))
    assistant_Obj["styleSheet"] = schema.styleSheet;

  return await Promise.resolve()

    
    
    //create new assistant
    .then(async () => {

      return Assistants.create(twilioClient, assistant_Obj);
    })

    //create a unique name if name exists
    .catch(async(err) => {

      if (err.message.includes("UniqueName already in use") || err.message.includes("Failed to create assistant "+schema.uniqueName)) {

        assistant_Obj.uniqueName = `${schema.uniqueName}-${Date.now()}`;
        assistant_Obj.friendlyName = `${schema.uniqueName}-${Date.now()}`;
        
        return Assistants.create(twilioClient, assistant_Obj);
      }
    })

    // delete hello-world task
    .then(async (assistant) => {

      const tasks = await Tasks.list(twilioClient, assistant.uniqueName);

      for(let task of tasks){

        const samples = await Samples.list(twilioClient, assistant.uniqueName, task.sid);

        for( let sample of samples){

          await Samples.remove(twilioClient, assistant.uniqueName, task.sid, sample.sid);
        }

        await Tasks.remove(twilioClient, assistant.uniqueName, 'hello-world');
      }

      return assistant;
    })

    //add tasks to assistant
    .then(async (assistant) => {

      if (schema.hasOwnProperty('tasks')) {

        for (let task of schema.tasks) {

          await Tasks.create(twilioClient, assistant.uniqueName, { uniqueName: task.uniqueName, actions: task.actions });
        }
      }

      return assistant;
    })

    //add custom fields to assistant
    .then(async (assistant) => {

      if (schema.hasOwnProperty('fieldTypes')) {

        for (let fieldType of schema.fieldTypes) {

          await FieldTypes.create(twilioClient, assistant.uniqueName, { uniqueName: fieldType.uniqueName });

          if (fieldType.hasOwnProperty('values')) {

            // adding field values that have synonyms
            for (let value of fieldType.values) {

              if(!value.synonymOf){

                const params = { 
                  language: value.language, 
                  value: value.value, 
                  synonymOf: (value.synonymOf) ? value.synonymOf : '' 
                };
                await FieldValues.create(twilioClient, assistant.uniqueName, fieldType.uniqueName, params);
              }
            }

            //adding synonyms to field values
            for (let value of fieldType.values) {

              if(value.synonymOf){

                const params = { 
                  language: value.language, 
                  value: value.value, 
                  synonymOf: (value.synonymOf) ? value.synonymOf : '' 
                };
                await FieldValues.create(twilioClient, assistant.uniqueName, fieldType.uniqueName, params);
              }
            }
          }
        }
      }

      return assistant;
    })

    //add fields to tasks
    .then(async (assistant) => {

      if (schema.hasOwnProperty('tasks')) {

        for (let task of schema.tasks) {

          if (task.hasOwnProperty('fields')) {

            for (let field of task.fields) {

              const params = { 
                fieldType: field.fieldType, 
                uniqueName: field.uniqueName 
              };
              await Fields.create(twilioClient, assistant.uniqueName, task.uniqueName, params);
            }
          }
        }
        
      }

      return assistant;
    })

    //add samples
    .then(async (assistant) => {

      if (schema.hasOwnProperty('tasks')) {

        for (let task of schema.tasks) {

          for (let sample of task.samples) {

            const params = { 
              language: sample.language, 
              taggedText: sample.taggedText 
            };
            await Samples.create(twilioClient, assistant.uniqueName, task.uniqueName, params);
          }
        }
      }

      return assistant;
    })

    //start model build 
    .then(async (assistant) => {

      await ModelBuilds.create(twilioClient, assistant.uniqueName);
      return assistant;
    })

    .catch(err => {
      throw err;
    })

}

module.exports = createAssistant;