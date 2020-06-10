const header = require('./header')
const serviceListCard = require('./serviceList')
const teamData = require('../../data/database/common/teamData')
const config = require('../../utility/config')
module.exports.teamCard = async (departmentName, labels,viewID) => {
    try {
        var data = await teamData.getTeamData(departmentName);
        //If view ID is given
        ID = parseInt(viewID ? viewID : 0)
        var card = {
            "cards": [
                {
                    "header": {
                        "title": data[ID].FirstName + " " + data[ID].LastName,
                        "subtitle": data[ID].BusinessRole,
                        "imageUrl": data[ID].PofilePhotoUrl
                    },
                    "sections": [
                        {
                            "widgets": []
                        }
                    ]
                }
            ]
        }
        for (let i = 0; i < labels.length; i++) {
            card['cards'][0]['sections'][0]['widgets'].push(
                {
                    "keyValue": {
                        "topLabel": `${labels[i].lableValue}`,
                        "content": `${data[ID][labels[i].columnValue]}`
                    }
                }
            )
        }

        // if ID is at the end of the data then show only the previous button
        if ((data.length - 1) == ID) {
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
                                                "actionMethodName": `${config.TeamMemberCard[0]}`,
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
        else if (ID == '0') {
            card['cards'][0]['sections'].push({
                "widgets": [
                    {
                        "buttons": [
                            {
                                "textButton": {
                                    "text": `${config.TeamMemberCard[1]}`,
                                    "onClick": {
                                        "action": {
                                            "actionMethodName": `${config.TeamMemberCard[1]}`,
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
                                                "actionMethodName": `${config.TeamMemberCard[0]}`,
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
                                                "actionMethodName": `${config.TeamMemberCard[1]}`,
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