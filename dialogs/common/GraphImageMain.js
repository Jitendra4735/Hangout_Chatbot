const graphImageWaterfall = "graphImageWaterfall"
const config = require('../../utility/config')
const graphImageCard = require('../../cards/common/graphImageCard')
const personaCard = require('../../cards/common/personaCard')
const serviceList = require('../../cards/common/serviceList')
function graphImageMain() {

    async function graphImageMainStep1(req, res, globalVar) {

        try {
            
            if (req.body.message.text) {
                globalVar[`${req.body.user.email}`].personaName = config.personaList[2].nameToDisplay
            }
            if (globalVar[`${req.body.user.email}`]['graphName'] === config.purchaseManagerServiceList[0]) {
                var cardToSend = await graphImageCard.graphImage(req,res,globalVar,config.logoToDisplay[0], config.purchaseManagerServiceList[0])
                return res.json(cardToSend)
            } else if (globalVar[`${req.body.user.email}`]['graphName'] === config.purchaseManagerServiceList[1]) {
                var cardToSend = await graphImageCard.graphImage(req,res,globalVar,config.logoToDisplay[0], config.purchaseManagerServiceList[1])
                return res.json(cardToSend)
            } else if (globalVar[`${req.body.user.email}`]['graphName'] === config.purchaseManagerServiceList[2]) {
                var cardToSend = await graphImageCard.graphImage(req,res,globalVar,config.logoToDisplay[0], config.purchaseManagerServiceList[2])
                return res.json(cardToSend)
            } else if (globalVar[`${req.body.user.email}`]['graphName'] === config.salesManagerServiceList[2]) {
                globalVar[`${req.body.user.email}`].personaName = config.personaList[1].nameToDisplay
                var cardToSend = await graphImageCard.graphImage(req,res,globalVar,config.logoToDisplay[0], config.salesManagerServiceList[2])
                return res.json(cardToSend)
            } else {
                let card = personaCard.showPersonaCard(req.body.message.sender.displayName);
                return res.json(card)
            }
        }catch(error){
            console.log(error)
            var cardsResult = await serviceList.cardtoDisplay(req,resglobalVar[`${req.body.user.email}`].personaName,  `Error occured while showing ${globalVar[`${req.body.user.email}`]['graphName']}, Please try again`)
            return res.json(cardsResult)
        }
        
    }
    return {
        graphImageMainStep1
    }
}

module.exports = graphImageMain