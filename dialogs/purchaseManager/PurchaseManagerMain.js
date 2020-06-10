const timeOut = require('../../utility/timeout')
const config = require('../../utility/config')
const graphImageCard = require('../../cards/common/graphImageCard')
const errorCard = require('../../cards/common/errorCard')
function PurchaseManagerMain() {
    async function purchaseManagerWaterfallStep1(req, res) {
        try {
            //Displaying the service card
            var cardToSend = await graphImageCard.graphImage(config.logoToDisplay[0], config.purchaseManagerServiceList[0])
            return res.json(cardToSend)
        } catch (error) {
            console.log(error)
            var cardsResult = await serviceList.cardtoDisplay(req,res,config.personaList[2].nameToDisplay,  "Error occured while showing Purchase Manager card, Please try again")
            return res.json(cardsResult)
        }
    } 
    return {
        purchaseManagerWaterfallStep1
    }
}

module.exports = PurchaseManagerMain
