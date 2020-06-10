const listCard = require('../../cards/common/listCard')
const detailCard = require('../../cards/common/detailCard')
const config = require('../../utility/config')
const errorCard = require('../../cards/common/errorCard')
const serviceList = require('../../cards/common/serviceList')
const poData = require('../../data/database/purchaseManager/poData')
function poMain() {

    async function poWaterfallStep1(req, res, globalVar, message) {
        try {
            //setting the persona name
            if (req.body.message.text) {
                globalVar[`${req.body.user.email}`].personaName = config.personaList[2].nameToDisplay
            }
            if (req.body.action && req.body.action.parameters) {
                if (req.body.action.parameters[0].value === req.body.action.parameters[0].key)
                return await poWaterfallStep2(req, res, globalVar);
            }

            let result = await poData.getPOData()
            if ((result.length > 0) && (result !== config.errorMessage)) {
                let cardToSend = await listCard.itemListCard(result, config.logoToDisplay[0], config.cardTitle.poListCard, config.listCardAction.po, message)
                return res.json(cardToSend)
            } else {
                var cardsResult = await serviceList.cardtoDisplay(req, res, config.personaList[2].nameToDisplay, "No Purchase Order found, Please try again!")
                return res.json(cardsResult)
            }
        } catch (error) {
            console.log(error)
            var cardsResult = await serviceList.cardtoDisplay(req, res, config.personaList[2].nameToDisplay, "Error occured while showing Purchase Order List, Please try again")
            return res.json(cardsResult)
        }
    }
    async function poWaterfallStep2(req, res, globalVar) {
        try {
            //setting the persona name 
            if (req.body.message.text) {
                globalVar[`${req.body.user.email}`].personaName = config.personaList[2].nameToDisplay
            }
            let result = await poData.getPOData(req.body.action.parameters[0].value)
            if ((result.length > 0) && (result !== config.errorMessage)) {
                let cardToSend = await detailCard.detailCard(result[0], config.poDetailCard, 'po', config.logoToDisplay[0], config.cardTitle.poDetailCard)
                return res.json(cardToSend)
            } else {
                //If no data found then show PO list
                return poWaterfallStep1(req, res, globalVar, "No Purchase Order found with given details. Here are some Purchase Order you might want to see!")
            }
        } catch (error) {
            console.log(error)
            var cardsResult = await serviceList.cardtoDisplay(req, res, config.personaList[2].nameToDisplay, "Error occured while showing Purchase Order Detail card, Please try again")
            return res.json(cardsResult)
        }
    }
    return {
        poWaterfallStep1,
        poWaterfallStep2
    }
}

module.exports = poMain