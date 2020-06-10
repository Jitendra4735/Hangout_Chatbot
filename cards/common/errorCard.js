const serviceListCard = require('./serviceList')
const listCard = require('../../cards/common/listCard')
module.exports.errorMessageCard = async (serviceList, title, list) => {
    try {
        let card = {
            "cards": [
                {
                    "header": {
                        "title": title
                    },
                }
            ]
        }
        cardResult = await serviceListCard.cardtoDisplay(serviceList, card);

        return cardResult;
    } catch{
        console.error(error);
        return "error occured";
    }
}