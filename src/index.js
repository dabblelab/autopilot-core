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

module.exports = new AutopilotCore();