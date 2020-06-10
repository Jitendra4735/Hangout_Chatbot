const personaList = require('../../utility/config').personaList
const logos = require('../../utility/config')
const cardType = require('../../utility/config').cardType
const errorMessage = require('../../utility/config').errorMessage
exports.showPersonaCard = (userName) => {
    try {
    var card = {
        "cards": [
            {
                "header": {
                    "title": "Hello " + userName + ", Please select a persona",
                }, "sections": []
            }
        ]
    }
    let i = 0;
    var buttons=[]
    for (let i = 0; i < personaList.length; i++) {
        var button_text = {
            textButton: {
                text: `${personaList[i].nameToDisplay}`,
                onClick: {
                    action: {
                        actionMethodName: `${personaList[i].nameToDisplay}`,
                        parameters: [
                            {
                                key: `personaName`,
                                value: `${personaList[i].nameToDisplay}`
                            }
                        ]
                    }
                }
            }
        }
        buttons.push(button_text);

    }

    card['cards'][0]['sections'].push({
        "widgets": [
            {
                "buttons": buttons
            }
        ]

    })  
    

        return card;
    }

    catch (error) {
        console.error(error);
        return errorMessage
    }
}

/*[
    {
        "textButton": {
            "text": `${personaList[i].nameToDisplay}`,
            "onClick": {
                "action": {
                    "actionMethodName": `${personaList[i].nameToDisplay}`,
                    "parameters": [
                        {
                            "key": "personaName",
                            "value": `${personaList[i].nameToDisplay}`
                        }
                    ]
                }
            }
        }
    }
]*/