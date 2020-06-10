const config = require('../../utility/config');
const personaCard = require('./personaCard')
module.exports.cardtoDisplay = (req, res, persona, card, message) => {
    let text = "Hi, how may I help you?\nThese are some available services"
    try {

        if (persona == config.personaList[0].nameToDisplay) {
            serviceList = config.accountManagerServiceList
        } else if (persona == config.personaList[1].nameToDisplay) {
            serviceList = config.salesManagerServiceList
        } else if (persona == config.personaList[2].nameToDisplay) {
            serviceList = config.purchaseManagerServiceList
        } else {
            //when on persona page and user types help show persona card again
            card = personaCard.showPersonaCard(req.body.user.displayName);
            return card
        }

        // If card is sent then use it
        if (card) {
            index = 1;
            text = "Please select a service"
        } //If card is not present then make a new card
        else {
            if (message) {
                text = message
            }
            card = { "cards": [] }
        }

        var length = serviceList.length;
        if (length % 2 !== 0) {
            length = length - 1
        }

        let i = 0;
        var buttons = [];
        for (i = 0; i < length; i++) {
            var button_text = {
                textButton: {
                    text: `${serviceList[i]}`,
                    onClick: {
                        action: {
                            actionMethodName: `${serviceList[i]}`,
                            parameters: [{
                                key: `${i}`,
                                value: `${serviceList[i]}`
                            }]
                        }
                    }
                }
            };
            buttons.push(button_text);
        }
        if (serviceList.length % 2 !== 0) {
            var button_text = {
                textButton: {
                    text: `${serviceList[i]}`,
                    onClick: {
                        action: {
                            actionMethodName: `${serviceList[i]}`,
                            parameters: [{
                                key: `${i}`,
                                value: `${serviceList[i]}`
                            }]
                        }
                    }
                }
            };
            buttons.push(button_text);

        }
        card['cards'].push({
            "sections": [
                {
                    "widgets": [
                        {
                            "textParagraph": {
                                "text": "<b>" + `${text}` + "</b>",
                            }
                        }
                    ]

                }, {
                    "widgets": [
                        {
                            "buttons": buttons
                        }
                    ]
                }
            ],
        })
        return card;
    } catch (error) {
        console.error(error);
        return "error occured";
    }
}