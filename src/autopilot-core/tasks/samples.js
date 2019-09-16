
const _ = require('lodash'),
     Samples = require('../lib/samples');

/**
 * Private
 */
const deleteNotExistTaskSamples = async(twilioClient, assistantUniqueName, task, modelSamples = false) => {

    let sampleList = [];

    const samples = await Samples.list(twilioClient, assistantUniqueName, task.uniqueName);
    for(let sample of samples){

        if(modelSamples){

            const s_index = _.findIndex(modelSamples.samples, { taggedText : sample.taggedText});

            if(s_index < 0){

                await Samples.remove(twilioClient, assistantUniqueName, task.uniqueName, sample.sid);
            }else{

                sampleList.push(sample);
            }
        }else{

            await Samples.remove(twilioClient, assistantUniqueName, task.uniqueName, sample.sid);
        }
    }
    
    return sampleList;
}

/**
 * Private
 */
const addTNotExistTaskSamples = async (twilioClient, assistantUniqueName, taskUniqueName, taskSamples, schemaTasks = false) => {

    if(schemaTasks){

        const index = _.findIndex(schemaTasks, {"uniqueName" : taskUniqueName});
        const taskSamples1 = (taskSamples.length >= schemaTasks[index].samples.length) ? taskSamples : schemaTasks[index].samples,
            taskSamples2 = (schemaTasks[index].samples.length <= taskSamples.length) ? schemaTasks[index].samples : taskSamples;

        const addSampleList = _.differenceBy(taskSamples1, taskSamples2, 'taggedText');
        for(let sample of addSampleList){

            const params = { 
                language: sample.language, 
                taggedText: sample.taggedText 
            };
            await Samples.create(twilioClient, assistantUniqueName, taskUniqueName, params);
        }
    }else{

        for(let sample of taskSamples){

            const params = { 
                language: sample.language, 
                taggedText: sample.taggedText 
            };
            await Samples.create(twilioClient, assistantUniqueName, taskUniqueName, params);
        }
    }
    
    return assistantUniqueName;
}

module.exports = {
    deleteNotExistTaskSamples,
    addTNotExistTaskSamples
}