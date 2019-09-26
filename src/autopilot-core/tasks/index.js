const {addTaskFields, deleteTaskFields} = require('./fieldType'),
      {addTaskSamples, deleteTaskSamples} = require('./samples'),
      {addUpdateTasks} = require('./task');

function AssistantTask(){

}

AssistantTask.prototype.addTaskFields = addTaskFields;
AssistantTask.prototype.deleteTaskFields = deleteTaskFields;
AssistantTask.prototype.addTaskSamples = addTaskSamples;
AssistantTask.prototype.deleteTaskSamples = deleteTaskSamples;
AssistantTask.prototype.addUpdateTasks = addUpdateTasks;

module.exports = new AssistantTask();