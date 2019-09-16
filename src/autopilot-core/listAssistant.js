const Assistants = require('./lib/assistants');

const listAssistant = async (twilioClient) => {
  
   // getting list of assistant
   return Assistants.list(twilioClient);
}
  
module.exports = listAssistant;