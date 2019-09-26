const fs = require('fs'),
      parse = require('csv-parse'),
      _ = require('lodash'),
      util = require('util'),
      FieldTypes = require('../lib/field-types'),
      FieldValues = require('../lib/field-values');

function FieldType(){
    
}

/**
 * Private
 */
const deleteAllFieldTypes = async (twilioClient ,assistantUniqueName) => {

    try{

        const fieldTypes = await FieldTypes.list(twilioClient, assistantUniqueName);
              
        for(let fieldType of fieldTypes){
                    
            const fieldValues = await FieldValues.list(twilioClient, assistantUniqueName, fieldType.uniqueName);
                
            for(let fieldValue of fieldValues){

                await FieldValues.remove(twilioClient, assistantUniqueName, fieldType.uniqueName, fieldValue.sid);
            }

            await FieldTypes.remove(twilioClient, assistantUniqueName, fieldType.uniqueName);
        }
        
        return assistantUniqueName;

    }catch(err){

        throw err;
    }
}

/**
 * Private
 */
const deleteNotExistFieldTypes = async (twilioClient, assistantUniqueName, schemaFields) => {

    try{
        let fieldTypeList = [];
        const fieldTypes = await FieldTypes.list(twilioClient, assistantUniqueName);

        for(let fieldType of fieldTypes){

            const index = _.findIndex(schemaFields, { uniqueName : fieldType.uniqueName});

            if(index < 0){

                await deleteFieldValues(twilioClient, assistantUniqueName, fieldType.uniqueName);
                await FieldTypes.remove(twilioClient, assistantUniqueName, fieldType.uniqueName);
            }else{

                await deleteFieldValues(twilioClient, assistantUniqueName, fieldType.uniqueName, schemaFields[index].values);
                fieldTypeList.push(schemaFields[index])
            }
        }

        const fieldType1 = (fieldTypeList.length >= schemaFields.length) ? fieldTypeList : schemaFields,
              fieldType2 = (schemaFields.length <= fieldTypeList.length) ? schemaFields : fieldTypeList;

        const addFieldTypeList = _.differenceBy(fieldType1, fieldType2, 'uniqueName');

        for(let fieldType of addFieldTypeList){

            const f_params = { 
                uniqueName: fieldType.uniqueName 
            };
            await FieldTypes.create(twilioClient, assistantUniqueName, f_params);

            for(let fieldValue of fieldType.values){

                if(!fieldValue.synonymOf){

                    const v_params = {
                        "language": "en-US",
                        "value": fieldValue.value,
                        "synonymOf": fieldValue.synonymOf || ''
                    };
                    await FieldValues.create(twilioClient, assistantUniqueName, fieldType.uniqueName, v_params);
                }
            }

            for(let fieldValue of fieldType.values){

                if(fieldValue.synonymOf){

                    const v_params = {
                        "language": "en-US",
                        "value": fieldValue.value,
                        "synonymOf": fieldValue.synonymOf || ''
                    };
                    await FieldValues.create(twilioClient, assistantUniqueName, fieldType.uniqueName, v_params);
                }
            }
        }
        return true;
    }catch(err){

        throw err;
    }
}

/**
 * Private
 */
const deleteFieldValues = async(twilioClient, assistantUniqueName,fieldUniqueName, modelFieldValues = false) => {

    try{

        let fieldValueList = [];

        const fieldValues = await FieldValues.list(twilioClient, assistantUniqueName, fieldUniqueName);
        for(let fieldValue of fieldValues){

            if(modelFieldValues){

                const synonymOf = fieldValue.synonymOf || null ,
                      index =_.findIndex(modelFieldValues, {value : fieldValue.value, synonymOf : synonymOf});

                if(index < 0){

                    await FieldValues.remove(twilioClient, assistantUniqueName, fieldUniqueName, fieldValue.sid);
                }else{
                    
                    fieldValueList.push(fieldValue);
                }
            }else{

                await FieldValues.remove(twilioClient, assistantUniqueName, fieldUniqueName, fieldValue.sid);
            }
        }

        if(modelFieldValues){

            const fieldValue1 = (modelFieldValues.length >= fieldValueList.length) ? modelFieldValues : fieldValueList,
                  fieldValue2 = (fieldValueList.length <= modelFieldValues.length) ? fieldValueList : modelFieldValues;

            const addfieldValueList = _.differenceBy(fieldValue1, fieldValue2, 'value');

            for(let fieldValue of addfieldValueList){

                const v_params = {
                    "language": "en-US",
                    "value": fieldValue.value,
                    "synonymOf": fieldValue.synonymOf||''
                };
                await FieldValues.create(twilioClient, assistantUniqueName, fieldUniqueName, v_params);
            }
        }

        return fieldValueList;
    }catch(err){

        throw err;
    }
}

/**
 * Private
 */
const addFieldTypes = async (twilioClient, assistantUniqueName , schemaFieldTypes) => {

    try{

        if(schemaFieldTypes.length){

            const fieldTypes = await FieldTypes.list(twilioClient, assistantUniqueName);
            if(fieldTypes.length){

                for( let fieldType of schemaFieldTypes){

                    const index = _.findIndex(fieldTypes, { uniqueName : fieldType.uniqueName});

                    if(index < 0){

                        const f_params = { 
                            uniqueName: fieldType.uniqueName 
                        };
                        await FieldTypes.create(twilioClient, assistantUniqueName, f_params);
                    }
                }
            }
            else{

                for( let fieldType of schemaFieldTypes){

                    const f_params = { 
                        uniqueName: fieldType.uniqueName 
                    };
                    await FieldTypes.create(twilioClient, assistantUniqueName, f_params);
                }
            }
        }

        return assistantUniqueName;
    }catch(err){

        throw err;
    }
}

// Bulk Fields CLI Code
const addFieldValues = async(twilioClient, assistantUniqueName, fieldTypeUniqueName, csvFile) => {

    try{

        const fieldTypes = await FieldTypes.info(twilioClient, assistantUniqueName, fieldTypeUniqueName);
        const fieldValuesJSON = await getFieldValuesFromCSV(csvFile);
        await field_value_add(twilioClient, assistantUniqueName, fieldTypes.uniqueName, fieldValuesJSON);
        return assistantUniqueName;

    }catch(error){

        return (async() => {

            if(error.exitCode == 20404 || error.code == 20404){

                try{

                    const params = { uniqueName: fieldTypeUniqueName };
                    const result = await FieldTypes.create(twilioClient, assistantUniqueName, params);
                    const fieldValuesJSON = await getFieldValuesFromCSV(csvFile);
                    await field_value_add(twilioClient, assistantUniqueName, result.uniqueName, fieldValuesJSON);
                    return assistantUniqueName;
                }catch(err){

                    throw err;
                }
                
            }else{

                throw error;
            }
        })();
    }
}

const field_value_add = async(twilioClient, assistantUniqueName, fieldTypeUniqueName, fieldValuesJSON) => {

    for(let fieldValueJSON of fieldValuesJSON){
        
        try{


            await FieldValues.create(twilioClient, assistantUniqueName, fieldTypeUniqueName, fieldValueJSON);
        }catch(error){

            if(!error.message.includes('FieldValue already in use')){
                throw error;
            }
        }
    }
    return assistantUniqueName;
}

const getFieldValuesFromCSV = async(csvFile) => {

    const readFile = util.promisify(fs.readFile),
          parser = util.promisify(parse);


    try{

        const data = await readFile(csvFile),
              parsedData = await parser(data, {
                    trim: true,
                    skip_empty_lines: true
                });

        let fieldValues = [];
        for(let fieldValue of parsedData){

            const fldvls = fieldValue.filter(Boolean);
            let synonymOf = '';
            for(let [index, value] of fldvls.entries()){

                fieldValues.push({
                    "language": "en-US",
                    "value": value.trim(),
                    "synonymOf": synonymOf
                });

                if(index === 0)
                    synonymOf = value.trim();
            }
        }
        return fieldValues;
    }catch(error){

        throw error;
    }
    
}


FieldType.prototype.deleteAllFieldTypes = deleteAllFieldTypes;
FieldType.prototype.deleteNotExistFieldTypes = deleteNotExistFieldTypes;
FieldType.prototype.addFieldTypes = addFieldTypes;
FieldType.prototype.addFieldValues = addFieldValues;

module.exports = new FieldType();