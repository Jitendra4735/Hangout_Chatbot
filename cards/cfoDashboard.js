const header = require('../cards/common/header')
const config = require('../utility/config')
const httpsImage = require('../utility/imageFileUploadToBlob')
module.exports.cardToDisplay = async (cardTitle, imageData,viewID) => {
    try {
        //header of the card
        let card = header.headerWithoutAccountName('',cardTitle)
      
        ID = parseInt(viewID)

         //Total number of KPI's
         length = 6;
        //image of the card
        if (imageData) {
            var uploadedImage = await httpsImage.uploadFileToBlob(`cfoimage${ID}.jpg`, httpsImage.GetBuffer(imageData));
            image = uploadedImage.url
          }
        card['cards'][0]["sections"].push(
            {
                "widgets": [
                    {
                        "image": {
                            "imageUrl": image,
                            "onClick": {
                                "openLink": {
                                    "url": image
                                }
                            }
                        }
                    }
                ]
            }
        );
        // if ID is at the end of the data then show only the previous button
        if ((length - 1) == ID) {
            card.actionResponse = { "type": "UPDATE_MESSAGE" },
                card['cards'][0]['sections'].push({
                    "widgets": [
                        {
                            "buttons": [
                                {
                                    "textButton": {
                                        "text": `${config.TeamMemberCard[0]}`,
                                        "onClick": {
                                            "action": {
                                                "actionMethodName": `${config.personaList[3].nameToDisplay}`,
                                                "parameters": [
                                                    {
                                                        "key": "ID of previous team member",
                                                        "value": ID - 1
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]

                })

        }
        //if ID is not given, show manager's cards OR when viewID == '0'
        else if (ID == 0) {
            card['cards'][0]['sections'].push({
                "widgets": [
                    {
                        "buttons": [
                            {
                                "textButton": {
                                    "text": `${config.TeamMemberCard[1]}`,
                                    "onClick": {
                                        "action": {
                                            "actionMethodName": `${config.personaList[3].nameToDisplay}`,
                                            "parameters": [
                                                {
                                                    "key": "ID of next team member",
                                                    "value": ID + 1
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]

            })
        }
        //if viewID is in the middle of the data array then both buttons should be displayed
        else {
            card.actionResponse = { "type": "UPDATE_MESSAGE" },
                card['cards'][0]['sections'].push({
                    "widgets": [
                        {
                            "buttons": [
                                {
                                    "textButton": {
                                        "text": `${config.TeamMemberCard[0]}`,
                                        "onClick": {
                                            "action": {
                                                "actionMethodName": `${config.personaList[3].nameToDisplay}`,
                                                "parameters": [
                                                    {
                                                        "key": "ID of previous team member",
                                                        "value": ID - 1
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                },
                                {
                                    "textButton": {
                                        "text": `${config.TeamMemberCard[1]}`,
                                        "onClick": {
                                            "action": {
                                                "actionMethodName": `${config.personaList[3].nameToDisplay}`,
                                                "parameters": [
                                                    {
                                                        "key": "ID of next team member",
                                                        "value": ID + 1
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                })

        }
        return card
    } catch (error) {
        console.error(error);
        return "error occured"
    }
}
