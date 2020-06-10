const listCard = require('../../cards/common/listCard')
const detailCard = require('../../cards/common/detailCard')
const config = require('../../utility/config')
const serviceList = require('../../cards/common/serviceList1')
const timeOut = require('../../utility/timeout')
const opportunityData = require('../../data/database/common/opportunityData')
const errorCard = require('../../cards/common/errorCard')


function opportunityMain() {
    async function opportunityWaterfallStep1(req, res, globalVar) {
        try {
            var message;
            //setting the persona name
            if (req.body.message.text) {
                globalVar[`${req.body.user.email}`].personaName = config.personaList[1].nameToDisplay
            }
            if (req.body.action && req.body.action.parameters) {
                if (req.body.action.parameters[0].value === req.body.action.parameters[0].key)
                    return await opportunityWaterfallStep2(req, res, globalVar);
            }

            let result = await opportunityData.getOpportunityData(globalVar[`${req.body.user.email}`].accountId)

            if ((result.length > 0) && (result !== config.errorMessage)) {
                let cardToSend = await listCard.itemListCard(result, config.logoToDisplay[1],
                    config.cardTitle.opportunityListCard, config.listCardAction.opportunity)
                return res.send(cardToSend)
            } else {
                message = "No Opportunities found, Please try again!";
                return res.send(errorCard.errorMessageCard(serviceList, message, ''));
            }

        } catch (error) {
            console.error(error);
            message = "Error occured while showing Opportunity List, Please try again!";
            var cardsResult = await serviceList.cardtoDisplay(req, res,  globalVar[`${req.body.user.email}`].personaName, '', message)
            return res.send(cardsResult);
        }
    }
    async function opportunityWaterfallStep2(req, res, globalVar) {
        try {
            var message;
            //setting the persona name if not set before
            if (req.body.message.text) {
                globalVar[`${req.body.user.email}`].personaName = config.personaList[1].nameToDisplay
            }
            let result = await opportunityData.getOpportunityData(req.body.action.parameters[0].value)
            if ((result.length > 0) && (result !== config.errorMessage)) {
                let cardToSend = await detailCard.detailCard(result[0], config.opportunityDetailCard, 'opportunity', config.logoToDisplay[1],
                    config.cardTitle.opportunityDetailCard)
                return res.send(cardToSend);

            } else {
                return opportunityWaterfallStep1(req, res, globalVar, "No Opportunity found with given details. Here are some Opportunities you might want to see!")
            }
        } catch (error) {
            console.error(error);
            message = "Error occured while showing Opportuntiy Detail, Please try again!";
            var cardsResult = await serviceList.cardtoDisplay(req, res,  globalVar[`${req.body.user.email}`].personaName, '', message)
            return res.send(cardsResult);
        }
    }
    return {
        opportunityWaterfallStep1,
        opportunityWaterfallStep2
    }
}

module.exports = opportunityMain
