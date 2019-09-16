function FieldValues(){

}

/**
 * add field-value to the field-type of an assistant
 * @twilioClient {object} 
 * @assistantUniqueName {string}
 * @fieldTypeUniqueName {string}
 * @params {object} = {
 *      language : string,
 *      value : string,
 *      synonymOf : string
 * }
 */
FieldValues.prototype.create = async(twilioClient, assistantUniqueName, fieldTypeUniqueName, params) => {

    return twilioClient.autopilot
            .assistants(assistantUniqueName)
            .fieldTypes(fieldTypeUniqueName)
            .fieldValues
            .create(params);
}

/**
 * list all field-values of the field-type of an assistant
 * @twilioClient {object} 
 * @assistantUniqueName {string}
 * @fieldTypeUniqueName {string}
 */
FieldValues.prototype.list = async(twilioClient, assistantUniqueName, fieldTypeUniqueName) => {

    return twilioClient.autopilot
            .assistants(assistantUniqueName)
            .fieldTypes(fieldTypeUniqueName)
            .fieldValues
            .list();
}

/**
 * remove field-value of the field-type of an assistant
 * @twilioClient {object} 
 * @assistantUniqueName {string}
 * @fieldTypeUniqueName {string}
 * @fieldValueUniqueName {string}
 */
FieldValues.prototype.remove = async(twilioClient, assistantUniqueName, fieldTypeUniqueName, fieldValueUniqueName) => {

    return twilioClient.autopilot
            .assistants(assistantUniqueName)
            .fieldTypes(fieldTypeUniqueName)
            .fieldValues(fieldValueUniqueName)
            .remove();
}

module.exports = new FieldValues();