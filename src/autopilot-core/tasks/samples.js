
const _ = require('lodash'),
     Samples = require('../lib/samples');

/**
 * Private
 */
const deleteTaskSamples = async(twilioClient, assistantUniqueName, task) => {

    const samples = await Samples.list(twilioClient, assistantUniqueName, task.uniqueName);
    for(let sample of samples){

        await Samples.remove(twilioClient, assistantUniqueName, task.uniqueName, sample.sid);
    }
    
    return assistantUniqueName;
}

/**
 * Private
 */
const addTaskSamples = async (twilioClient, assistantUniqueName, taskUniqueName, schemaTasks) => {

    for(let sample of schemaTasks){

        const params = { 
            language: sample.language, 
            taggedText: sample.taggedText 
        };
        await Samples.create(twilioClient, assistantUniqueName, taskUniqueName, params);
    }
    
    return assistantUniqueName;
}

module.exports = {
    deleteTaskSamples,
    addTaskSamples
}