const createCsvWriter = require('csv-writer').createObjectCsvWriter,
      Queries = require('./lib/queries');

const exportAssistantQueries = async (twilioClient, assistantSid, quantity) => {

    let header = [
      {id: 'query', title: 'Query'},
      {id: 'status', title: 'Status'},
      {id: 'source_channel', title: 'Source channel'},
      {id: 'date_created', title: 'Date created'},
      {id: 'date_updated', title: 'Date updated'},
      {id: 'task_unique_name', title: 'Task unique name'},
      {id: 'field_name', title: 'Field name'},
      {id: 'field_value', title: 'Field value'},
      {id: 'field_type', title: 'Field type'},
      {id: 'Language', title: 'Language'},
      {id: 'assistant_sid', title: 'AssistantSid'},
    ];

    return await Promise.resolve()

      // fetch assistant queries
      .then ( async () => {

        return Queries.list(twilioClient, assistantSid, quantity);
      })

      // fetch all query properties
      .then(async (queries) => {

        let queriesList = [];
        for(let query of queries){

          let dc = new Date(query.dateCreated),
              dp = new Date(query.dateUpdated);
          let obj = {
            query : query.query,
            status : query.status,
            source_channel : query.sourceChannel,
            date_created : dc.toISOString(),
            date_updated : dp.toISOString(),
            task_unique_name : query.results.task,
            field_name : '',
            field_value : '',
            field_type : '',
            Language : query.language,
            assistant_sid : query.assistantSid
          }

          let field_name = '', field_value = '', field_type = '';
          for(let [index, value] of query.results.fields.entries()){

            if(index > 0){

              field_name +=`, ${value.name}`;
              field_value += `, "${value.value.toString()}"`;
              field_type += `, ${value.type}`
            }else{

              field_name +=`${value.name}`;
              field_value += `"${value.value}"`;
              field_type += `${value.type}`
            }
          }

          obj.field_name = field_name;
          obj.field_value = field_value;
          obj.field_type = field_type;

          queriesList.push(obj);
        }
        
        return queriesList;
      })

      // write csv file
      .then(async (queries) => {

        const csvWriter = await createCsvWriter({
          path: `${assistantSid}.csv`,
          header: header
        });

        csvWriter.writeRecords(queries);
      })

      .catch((error) => {
        throw error;
      })
        
}

module.exports = exportAssistantQueries;