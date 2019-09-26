const _ = require('lodash'),
      Fields = require('../lib/fields'),
      Tasks = require('../lib/tasks');

/**
 * Private
 */
const deleteTaskFields = async (twilioClient, assistantUniqueName, task) => {

    let fieldList = [];
    const fields = await Fields.list(twilioClient, assistantUniqueName, task.uniqueName);

    for(let field of fields){

        await Fields.remove(twilioClient, assistantUniqueName, task.uniqueName, field.uniqueName);
    }

    return fieldList;
}

/**
 * Private
 */
const addTaskFields = async (twilioClient, assistantUniqueName, taskUniqueName, taskFields) => {

    for(let field of taskFields){

        const f_params = { 
            fieldType: field.fieldType, 
            uniqueName: field.uniqueName 
        };
        await Fields.create(twilioClient, assistantUniqueName, taskUniqueName, f_params);
    }
    return assistantUniqueName;
}

module.exports = {
    deleteTaskFields,
    addTaskFields
}