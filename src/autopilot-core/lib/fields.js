function Fields(){

}

/**
 * create a field to the task of an assistant
 * @twilioClient {object} 
 * @assistantUniqueName {string}
 * @taskUniqueName {string}
 * @params {object} = {
 *      uniqueName : string,
 *      fieldType : string
 * }
 */
Fields.prototype.create = async(twilioClient, assistantUniqueName, taskUniqueName, params) => {

    return twilioClient.autopilot
            .assistants(assistantUniqueName)
            .tasks(taskUniqueName)
            .fields
            .create(params);
}

/**
 * list all fields of the task of an assistant
 * @twilioClient {object} 
 * @assistantUniqueName {string}
 * @taskUniqueName {string}
 */
Fields.prototype.list = async(twilioClient, assistantUniqueName, taskUniqueName) => {
    
    return twilioClient.autopilot
            .assistants(assistantUniqueName)
            .tasks(taskUniqueName)
            .fields
            .list();
}

/**
 * remove a field of the task of an assistant
 * @twilioClient {object} 
 * @assistantUniqueName {string}
 * @taskUniqueName {string}
 * @fieldUniqueName {string}
 */
Fields.prototype.fetch = async(twilioClient, assistantUniqueName, taskUniqueName, fieldUniqueName) => {
    
    return twilioClient.autopilot
            .assistants(assistantUniqueName)
            .tasks(taskUniqueName)
            .fields(fieldUniqueName)
            .fetch()
}

/**
 * remove a field of the task of an assistant
 * @twilioClient {object} 
 * @assistantUniqueName {string}
 * @taskUniqueName {string}
 * @fieldUniqueName {string}
 */
Fields.prototype.remove = async(twilioClient, assistantUniqueName, taskUniqueName, fieldUniqueName) => {
    
    return twilioClient.autopilot
            .assistants(assistantUniqueName)
            .tasks(taskUniqueName)
            .fields(fieldUniqueName)
            .remove()
}

module.exports = new Fields();