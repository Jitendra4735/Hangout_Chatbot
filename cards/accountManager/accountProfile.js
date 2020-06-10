const customerData = require('../../data/database/customerProfile/CustomerData')
const config = require('../../utility/config')
const cardHead = require('../common/header')
const logos = require('../../utility/logos')
const serviceListCard = require('../common/serviceList')

exports.accountProfile = async (persona,userPersonalProfileData, imageData) => {
    return new Promise(async (resolve, reject) => {
        try {
            var cardToDisplay = cardHead.headerWithoutAccountName(config.logoToDisplay[0], config.cardTitle.customerProfile)
            cardToDisplay['cards'][0]['sections'].push(
                {
                    "widgets": [
                        {
                            "textParagraph": {
                                "text": `<b>Contact Person</b>`
                            }
                        },
                        {
                            "keyValue": {
                                "topLabel": "Name",
                                "content": `${userPersonalProfileData[0].PersonName}`,
                                "icon":"PERSON"
                            }
                        },
                        {
                            "keyValue": {
                                "topLabel": "Business",
                                "content": `${userPersonalProfileData[0].TelephoneNumber.replace(/[^A-Z0-9]/g, "")}`,
                                "icon":"PHONE"
                            }
                        },
                        {
                            "keyValue": {
                                "topLabel": "Mobile",
                                "content": `${userPersonalProfileData[0].MobileNumber.replace(/[^A-Z0-9]/g, "")}`,
                                "icon":"PHONE"
                            }
                        },
                        {
                            "keyValue": {
                                "topLabel": "Email",
                                "content": `${userPersonalProfileData[0].Email}`,
                                "icon":"EMAIL"
                            }
                        }
                        , {
                            "keyValue": {
                                "topLabel": "Address",
                                "content": `${userPersonalProfileData[0].BusinessAddress2}`,
                                "icon":"DESCRIPTION"
                            }
                        }

                    ]

                }
            )
            card = serviceListCard.cardtoDisplay('','',persona,cardToDisplay)
            resolve(card)

        } catch (error) {
            console.error(error);
            reject(config.errorMessage)
        }
    })
}