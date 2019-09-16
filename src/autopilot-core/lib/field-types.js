function FieldTypes(){

}

/**
 * create field-type of an assistant
 * @twilioClient {object} 
 * @assistantUniqueName {string}
 * @params {object} = {
 *      uniqueName : string
 * }
 */
FieldTypes.prototype.create = async(twilioClient, assistantUniqueName, params) => {

    return twilioClient.autopilot
            .assistants(assistantUniqueName)
            .fieldTypes
            .create(params);
}

/**
 * list all field-types of an assistant
 * @twilioClient {object} 
 * @assistantUniqueName {string}
 */
FieldTypes.prototype.list = async(twilioClient, assistantUniqueName) => {

    return twilioClient.autopilot
            .assistants(assistantUniqueName)
            .fieldTypes
            .list();
}

/**
 * remove field-type of an assistant
 * @twilioClient {object} 
 * @assistantUniqueName {string}
 * @fieldTypeUniqueName {string}
 */
FieldTypes.prototype.remove = async(twilioClient, assistantUniqueName, fieldTypeUniqueName) => {

    return twilioClient.autopilot
            .assistants(assistantUniqueName)
            .fieldTypes(fieldTypeUniqueName)
            .remove();
}

/**
 * info field-types of an assistant
 * @twilioClient {object} 
 * @assistantUniqueName {string}
 * @fieldTypeUniqueName {string}
 */
FieldTypes.prototype.info = async(twilioClient, assistantUniqueName, fieldTypeUniqueName) => {

    return twilioClient.autopilot
            .assistants(assistantUniqueName)
            .fieldTypes(fieldTypeUniqueName)
            .fetch()
}

module.exports = new FieldTypes();