const {addUpdateTaskFields, deleteNotExistTaskFields} = require('./fieldType'),
      {addTNotExistTaskSamples, deleteNotExistTaskSamples} = require('./samples'),
      {addUpdateTasks} = require('./task');

function AssistantTask(){

}

AssistantTask.prototype.addUpdateTaskFields = addUpdateTaskFields;
AssistantTask.prototype.deleteNotExistTaskFields = deleteNotExistTaskFields;
AssistantTask.prototype.addTNotExistTaskSamples = addTNotExistTaskSamples;
AssistantTask.prototype.deleteNotExistTaskSamples = deleteNotExistTaskSamples;
AssistantTask.prototype.addUpdateTasks = addUpdateTasks;

module.exports = new AssistantTask();