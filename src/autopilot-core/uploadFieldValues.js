const fs = require('fs'),
        FieldValues = require('./lib/field-values'),
        csvParser = require('./lib/csv-parser');


const uploadFieldValues = async (twilioClient, assistantSid, fieldTypeSid, csvFile) => {

  if (!fs.existsSync(csvFile)) {

    throw new Error(`The file ${csvFile} was not be found.`);
  }

  return await Promise.resolve()

    .then( async () => {

        const parsedDatas = await csvParser(csvFile);
        for(let parsedData of parsedDatas){

            const fieldValues = parsedData.filter((item, index)=> parsedData.indexOf(item) === index).filter(Boolean);
            let synonymOf = '';
            for(let [index, value] of fieldValues.entries()){

              const params = {
                  "language": "en-US",
                  "value": value.trim(),
                  "synonymOf": synonymOf
              };
              try{

                await FieldValues.create(twilioClient, assistantSid, fieldTypeSid, params);
              }catch(error){

                if(!error.message.includes('FieldValue already in use'))
                  throw error;
              }

              if(index === 0)
                    synonymOf = value.trim();
            }
        }
        return fieldTypeSid;
    })

    .catch(err => {
      throw err;
    })

}

module.exports = uploadFieldValues;