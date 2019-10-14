const fs = require('fs'),
        Samples = require('./lib/samples'),
        Tasks = require('./lib/tasks'),
        csvParser = require('./lib/csv-parser');


const uploadTaskSamples = async (twilioClient, assistantSid, taskSid, csvFile) => {

  if (!fs.existsSync(csvFile)) {

    throw new Error(`The file ${csvFile} was not be found.`);
  }

  return await Promise.resolve()

    
    
    //assistant info
    .then ( async () => {

      return Tasks.fetch(twilioClient, assistantSid, taskSid);
    })

    .then( async (task) => {

      try{

        const parsedDatas = await csvParser(csvFile);
        for(let parsedData of parsedDatas){

            const samples = parsedData.filter((item, index)=> parsedData.indexOf(item) === index).filter(Boolean);
            for(let sample of samples){

              const params = {
                  "language": "en-US",
                  "taggedText": sample.trim()
              };
              await Samples.create(twilioClient, assistantSid, taskSid, params);
            }
        }

        return task;
      }catch(error){

        console.log(error);
        throw error;
      }
    })

    .catch(err => {
      throw err;
    })

}

module.exports = uploadTaskSamples;