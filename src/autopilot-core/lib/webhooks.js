function Webhooks(){

}

/**
 * create a webhook events of an assistant
 * @twilioClient {object} 
 * @assistantSid {string}
 * @params {object} = {
 *      uniqueName : string,
 *      webhookMethod : string,
 *      events : space separated events
 *      webhookUrl : string
 * }
 */
Webhooks.prototype.create = async(twilioClient, assistantSid, params) => {

    return twilioClient.autopilot
            .assistants(assistantSid)
            .webhooks
            .create(params);
}

/**
 * list webhook events of an assistant
 * @twilioClient {object} 
 * @assistantSid {string}
 */
Webhooks.prototype.list = async(twilioClient, assistantSid, params) => {

    return twilioClient.autopilot
            .assistants(assistantSid)
            .webhooks
            .list();
}

/**
 * update a webhook events of an assistant
 * @twilioClient {object} 
 * @assistantSid {string}
 * @webhookSid {string}
 * @params {object} = {
 *      uniqueName : string,
 *      webhookMethod : string,
 *      events : space separated events
 *      webhookUrl : string
 * }
 */
Webhooks.prototype.update = async(twilioClient, assistantSid, webhookSid, params) => {

    return twilioClient.autopilot
            .assistants(assistantSid)
            .webhooks(webhookSid)
            .update(params);
}

/**
 * delete a webhook events of an assistant
 * @twilioClient {object} 
 * @assistantSid {string}
 * @webhookSid {string}
 */
Webhooks.prototype.remove = async(twilioClient, assistantSid, webhookSid) => {

    return twilioClient.autopilot
            .assistants(assistantSid)
            .webhooks(webhookSid)
            .remove();
}

module.exports = new Webhooks();