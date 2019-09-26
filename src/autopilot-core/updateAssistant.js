const fs = require('fs'),
      _ = require('lodash'),
      Assistants = require('./lib/assistants'),
      Tasks = require('./lib/tasks'),
      ModelBuilds = require('./lib/model-builds'),
      FieldType = require('./fieldType/fieldValue'),
      AssistantTask = require('./tasks');

const updateAssistant = async (schemaFile, twilioClient, assistantSid) => {


  if (!fs.existsSync(schemaFile)) {
    throw new Error(`The file ${schemaFile} was not found.`);
  }

  const schema = require(schemaFile);

  if (!assistantSid || !schema.hasOwnProperty('uniqueName')) {
    throw new Error(`The 'uniqueName' property must be defined either as argument or in your schema.`);
  }

  const assistantUniqueName = assistantSid || schema.uniqueName;
  return await Promise.resolve()

    //fetch the assistant info
    .then(( ) => {

      return Assistants.info(twilioClient, assistantUniqueName);
    })

    //update basic assistant properties and their actions and style sheet
    .then(assistant => {

      let params = {
        friendlyName: schema.friendlyName,
        uniqueName: schema.uniqueName,
        logQueries: (schema.hasOwnProperty('logQueries')) ? schema.logQueries : true
      }

      if(schema.hasOwnProperty('defaults') && schema.defaults.hasOwnProperty('defaults')){
        
        params['defaults'] = schema.defaults;
      }

      if(schema.hasOwnProperty('styleSheet') && schema.styleSheet.hasOwnProperty('style_sheet')){

        params['styleSheet'] = schema.styleSheet;
      }

      return Assistants.update(twilioClient, assistant.uniqueName, params);
    })

    //removing tasks, samples, and field types
    .then(async (assistant) => {

        let taskList = [];
        const tasks = await Tasks.list(twilioClient, assistant.uniqueName);

        for(let task of tasks){

          await AssistantTask.deleteTaskSamples(twilioClient, assistantUniqueName, task);
          await AssistantTask.deleteTaskFields(twilioClient, assistantUniqueName, task);

          const index = _.findIndex(schema.tasks, { "uniqueName" : task.uniqueName});
          if(index < 0){

            await Tasks.remove(twilioClient, assistantUniqueName, task.uniqueName);
          }else{
            
            taskList.push(schema.tasks[index]);  
          }
        }

        await FieldType.deleteNotExistFieldTypes(twilioClient, assistantUniqueName, schema.fieldTypes);

        for(let task of taskList){

          await AssistantTask.addTaskFields(twilioClient, assistant.uniqueName, task.uniqueName, task.fields);
          await AssistantTask.addTaskSamples(twilioClient, assistant.uniqueName, task.uniqueName, task.samples);
          const params = {
              actions : task.actions
          };
          await Tasks.update(twilioClient, assistant.uniqueName, task.uniqueName, params);
        }
        
        return {taskList : taskList, assistant : assistant};
    })

    // delete assistant custom field types
    .then( async ({taskList, assistant}) => {

      const tasks1 = (taskList.length >= schema.tasks.length) ? taskList : schema.tasks,
              tasks2 = (schema.tasks.length <= taskList.length) ? schema.tasks : taskList;

      const addTaskList = _.differenceBy(tasks1, tasks2, 'uniqueName');

      for(let task of addTaskList){

        const params = { 
          uniqueName: task.uniqueName, 
          actions: task.actions 
        };

        await Tasks.create(twilioClient, assistantUniqueName, params);
        await AssistantTask.addTaskFields(twilioClient, assistantUniqueName, task.uniqueName, task.fields);
        await AssistantTask.addTaskSamples(twilioClient, assistantUniqueName, task.uniqueName, task.samples);
      }

      return assistant;
    })

    // updating/creating model build
    .then(async (assistant) => {

      await ModelBuilds.create(twilioClient, assistant.uniqueName);
      return await assistant;
    })

    .catch(err => {
      throw err;
    })
}

module.exports = updateAssistant;

