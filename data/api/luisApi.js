const request = require('request');
const errorMessage = require('../../utility/config').errorMessage
require('dotenv').config();
module.exports.luisApi = (intent) => {
    return new Promise(async (resolve, reject) => {
        try {
            var options = {
                'method': 'GET',
                'url': `${process.env.LuisAPIHostName}/luis/prediction/v3.0/apps/${process.env.LuisAppId}/slots/production/predict?subscription-key=${process.env.LuisAPIKey}&verbose=true&show-all-intents=false&log=true&query=${intent}`,
            };
            request(options, function (error, response) {
                if (error) {
                    console.error(error);
                } else {
                    resolve(JSON.parse(response.body).prediction.topIntent);

                }
            });


        } catch (error) {
            console.error(error);
            reject(errorMessage)
        }

    })
}