function Tasks(){

}

/**
 * create a task to an assistant
 * @twilioClient {object} 
 * @assistantUniqueName {string}
 * @params {object} = {
 *      uniqueName : string,
 *      friendlyName : string,
 *      actions : object
 * }
 */
Tasks.prototype.create = async(twilioClient, assistantUniqueName, params) => {

    return twilioClient.autopilot
            .assistants(assistantUniqueName)
            .tasks
            .create(params);
}

/**
 * list all task of an assistant
 * @twilioClient {object} 
 * @assistantUniqueName {string}
 */
Tasks.prototype.list = async(twilioClient, assistantUniqueName) => {
    
    return twilioClient.autopilot
            .assistants(assistantUniqueName)
            .tasks
            .list();
}

/**
 * fetch a task detail of an assistant
 * @twilioClient {object} 
 * @assistantUniqueName {string}
 * @taskUniuqeName {string} 
 */
Tasks.prototype.fetch = async(twilioClient, assistantUniqueName, taskUniuqeName) => {
    
    return twilioClient.autopilot
            .assistants(assistantUniqueName)
            .tasks(taskUniuqeName)
            .fetch();
}

/**
 * update a task of an assistant
 * @twilioClient {object} 
 * @assistantUniqueName {string}
 * @taskUniuqeName {string}
 * @params {object} = {
 *      friendlyName : string,
 *      actions : object
 * }
 */
Tasks.prototype.update = async(twilioClient, assistantUniqueName, taskUniuqeName, params) => {
    
    return twilioClient.autopilot
            .assistants(assistantUniqueName)
            .tasks(taskUniuqeName)
            .update(params);
}

/**
 * delete a task of an assistant
 * @twilioClient {object} 
 * @assistantUniqueName {string}
 * @taskUniuqeName {string} 
 */
Tasks.prototype.remove = async(twilioClient, assistantUniqueName, taskUniuqeName) => {
    
    return twilioClient.autopilot
            .assistants(assistantUniqueName)
            .tasks(taskUniuqeName)
            .remove();
}

/**
 * get a task action of an assistant
 * @twilioClient {object} 
 * @assistantUniqueName {string}
 * @taskUniuqeName {string} 
 */
Tasks.prototype.taskActions = async(twilioClient, assistantUniqueName, taskUniuqeName) => {
    
    return twilioClient.autopilot
            .assistants(assistantUniqueName)
            .tasks(taskUniuqeName)
            .taskActions
            .get()
            .fetch();
}


module.exports = new Tasks();