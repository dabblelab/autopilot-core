function AutopilotCore(){

}

AutopilotCore.prototype.listAssistant = require('./autopilot-core/listAssistant');
AutopilotCore.prototype.createAssistant = require('./autopilot-core/createAssistant');
AutopilotCore.prototype.customChannel = require('./autopilot-core/customChannel');
AutopilotCore.prototype.updateAssistant = require('./autopilot-core/updateAssistant');
AutopilotCore.prototype.exportAssistant = require('./autopilot-core/exportAssistant');
AutopilotCore.prototype.cloneTemplate = require('./autopilot-core/getTemplates');
AutopilotCore.prototype.bulkUploadFieldValues = require('./autopilot-core/bulkUploadFieldValues');
AutopilotCore.prototype.importAlexaModel = require('./autopilot-core/importAlexaAssistant');
AutopilotCore.prototype.importDialogFlowAgent = require('./autopilot-core/importAssistant');
AutopilotCore.prototype.existAssistant = require('./autopilot-core/existAssistant');
AutopilotCore.prototype.deleteAssistant = require('./autopilot-core/deleteAssistant');
AutopilotCore.prototype.uploadTaskSamples = require('./autopilot-core/uploadTaskSamples');
AutopilotCore.prototype.uploadFieldValues = require('./autopilot-core/uploadFieldValues');
AutopilotCore.prototype.exportAssistantQueries = require('./autopilot-core/exportAssistantQueries');
AutopilotCore.prototype.tasks = require('./autopilot-core/lib/tasks');
AutopilotCore.prototype.fields = require('./autopilot-core/lib/fields');
AutopilotCore.prototype.fieldTypes = require('./autopilot-core/lib/field-types');
AutopilotCore.prototype.queries = require('./autopilot-core/lib/queries');
AutopilotCore.prototype.webhooks = require('./autopilot-core/lib/webhooks');
AutopilotCore.prototype.modelBuilds = require('./autopilot-core/lib/model-builds');
AutopilotCore.prototype.builtInFieldTypes = require('./autopilot-core/builtInFieldTypes.json');

module.exports = new AutopilotCore();