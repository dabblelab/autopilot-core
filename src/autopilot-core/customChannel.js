

const customChannel = async (assistantSid, channel, text, twilioClient, UserId="", Language="") => {

    const request = require('request-promise');
  
    return await Promise.resolve()
  
      .then( async () => {
  
        const userpass = `${twilioClient.username}:${twilioClient.password}`;
        const options = {
            method : "POST",
            uri : `https://channels.autopilot.twilio.com/v2/${twilioClient.accountSid}/${assistantSid}/custom/${channel}`,
            headers : {
                authorization : `Basic ${Buffer.from(userpass).toString('base64')}`
            },
            form : {
                Text : text,
                UserId : UserId || twilioClient.accountSid,
                Language : Language || 'en-US'
            },
            json : true
        }

        return request(options)
            .then(response => {
                return response;
            })
            .catch(err => {
                throw err;
            })
      })
      
      .catch(err => {
        throw err;
      })
  
  }
  
  module.exports = customChannel;