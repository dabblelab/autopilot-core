const fs = require('fs'),
      _ = require('lodash'),
      Assistants = require('./lib/assistants'),
      Tasks = require('./lib/tasks'),
      ModelBuilds = require('./lib/model-builds'),
      FieldType = require('./fieldType/fieldValue'),
      AssistantTask = require('./tasks');

const updateAssistant = async (schemaFile, twilioClient) => {


  if (!fs.existsSync(schemaFile)) {
    throw new Error(`The file ${schemaFile} was not be found.`)
  }

  const schema = require(schemaFile);

  if (!schema.hasOwnProperty('uniqueName')) {
    throw new Error(`The 'uniqueName' property must be defined in your schema.`)
  }

  return await Promise.resolve()

    //fetch the assistant info
    .then(( ) => {

      return Assistants.info(twilioClient, schema.uniqueName);
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

        let taskList = [], sampleList = [], fieldList = [];
        const tasks = await Tasks.list(twilioClient, assistant.uniqueName);

        for(let task of tasks){

          const index = _.findIndex(schema.tasks, { "uniqueName" : task.uniqueName});
          if(index < 0){

            await AssistantTask.deleteNotExistTaskSamples(twilioClient, schema.uniqueName, task);
            await AssistantTask.deleteNotExistTaskFields(twilioClient, schema.uniqueName, task);
            await Tasks.remove(twilioClient, schema.uniqueName, task.uniqueName);

          }else{

            sampleList = await AssistantTask.deleteNotExistTaskSamples(twilioClient, schema.uniqueName, task, schema.tasks[index]);
            fieldList = await AssistantTask.deleteNotExistTaskFields(twilioClient, schema.uniqueName, task, schema.tasks[index]);

            task.sampleList = sampleList;
            task.fieldList = fieldList;
            taskList.push(task);  
          }
        }

        await FieldType.deleteNotExistFieldTypes(twilioClient, schema.uniqueName, schema.fieldTypes);

        for(let task of taskList){

          await AssistantTask.addUpdateTaskFields(twilioClient, assistant.uniqueName, task.uniqueName, task.fieldList, schema.tasks);
          await AssistantTask.addTNotExistTaskSamples(twilioClient, assistant.uniqueName, task.uniqueName, task.sampleList, schema.tasks);
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

        await Tasks.create(twilioClient, schema.uniqueName, params);
        await AssistantTask.addUpdateTaskFields(twilioClient, schema.uniqueName, task.uniqueName, task.fields);
        await AssistantTask.addTNotExistTaskSamples(twilioClient, schema.uniqueName, task.uniqueName, task.samples);
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

