function Samples(){

}

/**
 * create a sample to the task of an assistant
 * @twilioClient {object} 
 * @assistantUniqueName {string}
 * @taskUniqueName {string}
 * @params {object} = {
 *      language : string,
 *      taggedText : string
 * }
 */
Samples.prototype.create = async(twilioClient, assistantUniqueName, taskUniqueName, params) => {

    return twilioClient.autopilot
            .assistants(assistantUniqueName)
            .tasks(taskUniqueName)
            .samples
            .create(params);
}

/**
 * list all samples of the task of an assistant
 * @twilioClient {object} 
 * @assistantUniqueName {string}
 * @taskUniqueName {string}
 */
Samples.prototype.list = async(twilioClient, assistantUniqueName, taskUniqueName) => {
    
    return twilioClient.autopilot
            .assistants(assistantUniqueName)
            .tasks(taskUniqueName)
            .samples
            .list();
}

/**
 * update a sample to the task of an assistant
 * @twilioClient {object} 
 * @assistantUniqueName {string}
 * @taskUniqueName {string}
 * @sampleUniqueName {string}
 * @params {object} = {
 *      language : string,
 *      taggedText : string
 * }
 */
Samples.prototype.update = async(twilioClient, assistantUniqueName, taskUniqueName, sampleUniqueName, params) => {
    
    return twilioClient.autopilot
            .assistants(assistantUniqueName)
            .tasks(taskUniqueName)
            .samples(sampleUniqueName)
            .update(params);
}

/**
 * remove a sample of the task of an assistant
 * @twilioClient {object} 
 * @assistantUniqueName {string}
 * @taskUniqueName {string}
 * @sampleUniqueName {string}
 */
Samples.prototype.remove = async(twilioClient, assistantUniqueName, taskUniqueName, sampleUniqueName) => {
    
    return twilioClient.autopilot
            .assistants(assistantUniqueName)
            .tasks(taskUniqueName)
            .samples(sampleUniqueName)
            .remove();
}

module.exports = new Samples();