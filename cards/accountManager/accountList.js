const customerData = require('../../data/database/customerProfile/CustomerData')
const config = require('../../utility/config')
const cardHead = require('../common/header')

exports.customerListCard = async (customerListData, cardTitle) => {
    let action = `${config.accountListAction}`
    if (cardTitle === config.cardTitle.createOpportunityAccountList) {
        action = "CreateOpportunityCustomerProfile"
    }
    return new Promise((resolve, reject) => {
        try {
            console.log("called customerListCard");
            var cardToDisplay = cardHead.headerWithoutAccountName(config.logoToDisplay[0], cardTitle)
            var buttons = [];
            for (i = 0; i < customerListData.length; i++) {
                var button_text = {
                    textButton: {
                        text: `${customerListData[i].CustomerName}`,
                        onClick: {
                            action: {
                                actionMethodName: action,
                                parameters: [{
                                    key: `${i}`,
                                    value: `${customerListData[i].CustomerId}`
                                }]
                            }
                        }
                    }
                };
                buttons.push(button_text);
            }

            cardToDisplay['cards'][0]["sections"].push(
                {
                    "widgets": [
                        {
                            "buttons": buttons
                        }
                    ]



                }

            )
            //console.log(cardToDisplay)
            resolve(cardToDisplay)
        }
        catch (error) {
            console.error(error);
            reject(config.errorMessage)
        }
    })

}