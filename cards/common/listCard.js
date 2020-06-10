const header = require('./header')
const cardType = require('../../utility/config').cardType
const serviceListCard = require('./serviceList')
const errorMessage = require('../../utility/config').errorMessage
module.exports.itemListCard = async (data, logo, cardTitle, action, message) => {

    let i = 0;
    try {

        // let color = "Default";
        // if ((data[i].Status.toLowerCase().trim() === 'won') || (data[i].Status.toLowerCase().trim() === 'new') || (data[i].Status.toLowerCase().trim() === 'delivered') || (data[i].Status.toLowerCase().trim() === 'paid')) {
        //     color = "Good"
        // }
        // else if ((data[i].Status.toLowerCase().trim() === 'lost') || (data[i].Status.toLowerCase().trim() === 'cancelled') || (data[i].Status.toLowerCase().trim() === 'held')) {
        //     color = "Attention"
        // }
        // else if ((data[i].Status.toLowerCase().trim() === 'open') || (data[i].Status.toLowerCase().trim() === 'existing') || (data[i].Status.toLowerCase().trim() === 'active') || (data[i].Status.toLowerCase().trim() === 'posted')) {
        //     color = "Warning"
        // }


        var card = await header.headerWithoutAccountName(logo, cardTitle)
        //  card['cards'][0]['sections'].push({ "widgets": [] })

        for (let i = 0; i < data.length; i++) {
            card['cards'][0]['sections'].push(
                {
                    "widgets": [
                        {
                            "buttons": [
                                {
                                    "textButton": {
                                        "text": "<b>" + data[i].Description + "</b>",
                                        "onClick": {
                                            "action": {
                                                "actionMethodName": `${action}`,
                                                "parameters": [
                                                    {
                                                        "key": `${i}`,
                                                        "value": data[i].id
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            "textParagraph": {
                                "text": data[i].date + "<font color=\"#008000\"> \t" + data[i].Status + "</font>\t" + data[i].Amount,
                            }
                        }
                    ]
                }
            )

        }
        //If there is an error, show the message at the beginning of list
        if (message) {
            card['cards'].unshift({
                "header": {
                    "title": message
                },
            })
        }
        return card
    }
    catch (error) {
        console.error(error);
        return errorMessage
    }
}
