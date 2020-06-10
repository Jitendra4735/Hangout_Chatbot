const request = require('request')
const cfoData = require('../database/cfo/cfoData')
const async = require('async')
module.exports.generateCFODashboard = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let images = [];
                let trend = [];
                trend.push(parseInt(`${data[0].M0}`),
                    parseInt(`${data[0].M1}`),
                    parseInt(`${data[0].M2}`),
                    parseInt(`${data[0].M3}`),
                    parseInt(`${data[0].M4}`),
                    parseInt(`${data[0].M5}`),
                    parseInt(`${data[0].M6}`),
                    parseInt(`${data[0].M7}`),
                    parseInt(`${data[0].M8}`),
                    parseInt(`${data[0].M9}`),
                    parseInt(`${data[0].M10}`),
                    parseInt(`${data[0].M11}`),
                    parseInt(`${data[0].M12}`));

                var body = JSON.stringify(
                    {
                        "metadata": { "X": "XLabel", "Y": "YLabel" },
                        "data": {
                            "title": `${data[0].KpiName}`,
                            "measure": `${data[0].currency.trim()}${data[0].KpiValue}${data[0].Percentage}`,
                            "change": `${data[0].PercentSwing}`,
                            "trend": trend,
                            "yoyComparison": `${data[0].YoyGrowth}`
                        }
                    })
                var options = {
                    'method': 'POST',
                    'url': 'https://visualsmicroservice.azurewebsites.net/trendtile2',
                    'headers': {
                        'Content-Type': 'application/json'
                    },
                    body: body
                };

                request(options, function (error, response) {
                    if (error) {
                        console.error(error);
                        if (images.length === 6) {
                            resolve(images);
                        }
                    } else {
                        resolve(response.body)
                    }
                });
            
        } catch (error) {
            console.error(error);
            reject("error occured")
        }
    })
}