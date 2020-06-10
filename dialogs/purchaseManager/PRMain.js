const serviceList = require('../../cards/common/serviceList')
const listCard = require('../../cards/common/listCard')
const detailCard = require('../../cards/common/detailCard')
const config = require('../../utility/config')
const errorCard = require('../../cards/common/errorCard')
const prData = require('../../data/database/purchaseManager/prData')


function prMain() {
    async function prWaterfallStep1(req, res, globalVar, message) {
        try {
            //setting the persona name
            if (req.body.message.text) {
                globalVar[`${req.body.user.email}`].personaName = config.personaList[2].nameToDisplay
            }
            if (req.body.action && req.body.action.parameters) {
                if (req.body.action.parameters[0].value === req.body.action.parameters[0].key)
                return await prWaterfallStep2(req, res, globalVar);
            }
            let result = await prData.getPRData()
            if ((result.length > 0) && (result !== config.errorMessage)) {
                let cardToSend = await listCard.itemListCard(result, config.logoToDisplay[0],
                    config.cardTitle.prListCard, config.listCardAction.pr, message)
                return res.json(cardToSend)
            } else {
                var cardsResult = await serviceList.cardtoDisplay(req, res, config.personaList[2].nameToDisplay, "No Purchase Requisition found, Please try again!")
                return res.json(cardsResult)
            }
        } catch (error) {
            console.log(error)
            var cardsResult = await serviceList.cardtoDisplay(req, res, config.personaList[2].nameToDisplay, "Error occured while showing Purchase Requisition List, Please try again")
            return res.json(cardsResult)
        }
    }
    async function prWaterfallStep2(req, res, globalVar) {
        try {

            //setting the persona name 
            if (req.body.message.text) {
                globalVar[`${req.body.user.email}`].personaName = config.personaList[2].nameToDisplay
            }
            let result = await prData.getPRData(req.body.action.parameters[0].value)
            if ((result.length > 0) && (result !== config.errorMessage)) {
                let cardToSend = await detailCard.detailCard(result[0], config.prDetailCard, 'pr', config.logoToDisplay[0], config.cardTitle.prDetailCard)
                return res.json(cardToSend)
            } else {
                //If no data found then show PR list
                return prWaterfallStep1(req, res, globalVar, "No Purchase Requistion found with given details. Here are some Purchase Requisition you might want to see!")

            }
        } catch (error) {
            console.log(error)
            var cardsResult = await serviceList.cardtoDisplay(req, res, config.personaList[2].nameToDisplay, "Error occured while showing Purchase Requisition List, Please try again")
            return res.json(cardsResult)
        }
    }
    return {
        prWaterfallStep1,
        prWaterfallStep2
    }
}

module.exports = prMain