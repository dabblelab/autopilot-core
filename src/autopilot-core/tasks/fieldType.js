const _ = require('lodash'),
      Fields = require('../lib/fields'),
      Tasks = require('../lib/tasks');

/**
 * Private
 */
const deleteNotExistTaskFields = async (twilioClient, assistantUniqueName, task, modelFields = false) => {

    let fieldList = [];
    const fields = await Fields.list(twilioClient, assistantUniqueName, task.uniqueName);

    for(let field of fields){

        if(modelFields){

            const f_index = _.findIndex(modelFields.fields, {fieldType : field.fieldType, uniqueName : field.uniqueName});

            if(f_index < 0){

                await Fields.remove(twilioClient, assistantUniqueName, task.uniqueName, field.uniqueName);
            }else{

                fieldList.push(field);
            }
        }else{

            await Fields.remove(twilioClient, assistantUniqueName, task.uniqueName, field.uniqueName);
        }
    }

    return fieldList;
}

/**
 * Private
 */
const addUpdateTaskFields = async (twilioClient, assistantUniqueName, taskUniqueName, taskFields, schemaTasks = false) => {

    if(schemaTasks){

        const index = _.findIndex(schemaTasks, {"uniqueName" : taskUniqueName});

        const taskFields1 = (taskFields.length >= schemaTasks[index].fields.length) ? taskFields : schemaTasks[index].fields,
            taskFields2 = (schemaTasks[index].fields.length <= taskFields.length) ? schemaTasks[index].fields : taskFields;

        const addTaskFieldsList = _.differenceBy(taskFields1, taskFields2, 'uniqueName');
        const params = {
            actions : schemaTasks[index].actions
        };

        await Tasks.update(twilioClient, assistantUniqueName, taskUniqueName, params);

        for(let field of addTaskFieldsList){

            const f_params = { 
                fieldType: field.fieldType, 
                uniqueName: field.uniqueName 
            };
            await Fields.create(twilioClient, assistantUniqueName, taskUniqueName, f_params);
        }
    }
    else{

        for(let field of taskFields){

            const f_params = { 
                fieldType: field.fieldType, 
                uniqueName: field.uniqueName 
            };
            await Fields.create(twilioClient, assistantUniqueName, taskUniqueName, f_params);
        }
    }
    
    return assistantUniqueName;
}

module.exports = {
    deleteNotExistTaskFields,
    addUpdateTaskFields
}