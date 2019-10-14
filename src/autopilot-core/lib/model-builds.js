
const moment = require('moment');

function ModelBuilds(){

}

/**
 * create an assistant model-build
 * @twilioClient {object} 
 * @assistantUniqueName {string}
 */
ModelBuilds.prototype.create = async(twilioClient, assistantUniqueName, params=false) => {

    if(params){

        return twilioClient.autopilot
            .assistants(assistantUniqueName)
            .modelBuilds
            .create(params);
    }else{

        return twilioClient.autopilot
            .assistants(assistantUniqueName)
            .modelBuilds
            .create();
    }
}

/**
 * list an assistant model-builds
 * @twilioClient {object} 
 * @assistantUniqueName {string}
 */
ModelBuilds.prototype.list = async(twilioClient, assistantUniqueName) => {

    return twilioClient.autopilot
            .assistants(assistantUniqueName)
            .modelBuilds
            .list();
}

/**
 * update an assistant model-build
 * @twilioClient {object} 
 * @assistantUniqueName {string}
 * @modelBuildUniqueName {string}
 */
ModelBuilds.prototype.update = async(twilioClient, assistantUniqueName, modelBuildUniqueName) => {
    
    return twilioClient.autopilot
            .assistants(assistantUniqueName)
            .modelBuilds(modelBuildUniqueName)
            .update({ uniqueName: modelBuildUniqueName });
}

/**
 * remove an assistant model-build
 * @twilioClient {object} 
 * @assistantUniqueName {string}
 */
ModelBuilds.prototype.remove = async(twilioClient, assistantUniqueName, modelBuildUniqueName) => {

    return twilioClient.autopilot
            .assistants(assistantUniqueName)
            .modelBuilds(modelBuildUniqueName)
            .remove();
}

module.exports = new ModelBuilds();