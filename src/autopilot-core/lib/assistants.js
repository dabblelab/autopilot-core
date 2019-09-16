function Assistant(){

}

/**
 * Create an assistant
 * @twilioClient {object} 
 * @param {object} = {
 *      friendlyName : string,
 *      uniqueName : string,
 *      logQueries : boolean,
 *      defaults : object,
 *      styleSheet : object
 * }
 */
Assistant.prototype.create = async(twilioClient, params) => {

    return twilioClient.autopilot
            .assistants
            .create(params);
}

/**
 * List all assistants
 * @twilioClient {object} 
 */
Assistant.prototype.list = async(twilioClient) => {

    return twilioClient.autopilot
            .assistants
            .list();
}

/**
 * Update an assistant
 * @twilioClient {object} 
 * @param {object} = {
 *      friendlyName : string,
 *      uniqueName : string,
 *      logQueries : boolean,
 *      defaults : object,
 *      styleSheet : object
 * }
 */
Assistant.prototype.update = async(twilioClient, uniqueName, params) => {

    return twilioClient.autopilot
        .assistants(uniqueName)
        .update(params);
}

/**
 * Remove an assistant
 * @twilioClient {object} 
 * @uniqueName {string}
 */
Assistant.prototype.remove = async(twilioClient, uniqueName) => {

    return twilioClient.autopilot
        .assistants(uniqueName)
        .remove();
}

/**
 * Info of an assistant
 * @twilioClient {object} 
 * @uniqueName {string}
 */
Assistant.prototype.info = async(twilioClient, uniqueName) => {

    return twilioClient.autopilot
        .assistants(uniqueName)
        .fetch();
}

/**
 * defaults of an assistant
 * @twilioClient {object} 
 * @uniqueName {string}
 */
Assistant.prototype.defaults = async(twilioClient, uniqueName) => {

    return twilioClient.autopilot
            .assistants(uniqueName)
            .defaults()
            .fetch();
}

/**
 * styleSheet of an assistant
 * @twilioClient {object} 
 * @uniqueName {string}
 */
Assistant.prototype.styleSheet = async(twilioClient, uniqueName) => {

    return twilioClient.autopilot
            .assistants(uniqueName)
            .styleSheet()
            .fetch();
}

module.exports = new Assistant();