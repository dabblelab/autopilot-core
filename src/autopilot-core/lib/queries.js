function Queries(){

}


/**
 * list queries of an assistant
 * @twilioClient {object} 
 * @assistantUniqueName {string}
 */
Queries.prototype.list = async(twilioClient, assistantUniqueName, quantity) => {
    
    return twilioClient.autopilot
            .assistants(assistantUniqueName)
            .queries
            .list({limit : parseInt(quantity)});
}

module.exports = new Queries();