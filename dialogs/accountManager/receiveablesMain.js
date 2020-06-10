
const listCard = require('../../cards/common/listCard')
const detailCard = require('../../cards/common/detailCard')
const config = require('../../utility/config')
const receiveablesData = require('../../data/database/accountManager/receivablesData')
const errorCard = require('../../cards/common/errorCard')


function receiveablesMain() {
    async function receiveablesList(req, res, globalVar) {
        try {
            var message;
            //setting the persona name if text message is sent
            if (req.body.message.text) {
                globalVar[`${req.body.user.email}`].personaName = config.personaList[0].nameToDisplay
            }
            //console.log(req.body.action.actionMethodName)
            if (req.body.action && req.body.action.parameters) {
                if (req.body.action.parameters[0].value === req.body.action.parameters[0].key)
                return await receiveablesDetail(req, res, globalVar);
            }
            let result = await receiveablesData.getreceiveablesData(globalVar[`${req.body.user.email}`].accountId)
            if ((result.length > 0) && (result !== config.errorMessage)) {
                return res.send(await listCard.itemListCard(result, config.logoToDisplay[0],
                    config.cardTitle.receiveablesListCard, config.listCardAction.receiveables))
            } else {
                message = "No Receivables found, Please try again!";
                return res.send(errorCard.errorMessageCard(config.accountManagerServiceList, message, ''));

            }

        } catch (error) {
            console.error(error);
            message = "Error occured while showing Receivables List, Please try again!";
            var cardsResult = await serviceList.cardtoDisplay(req, res, config.personaList[0].nameToDisplay, '', errorMessage)
            return res.send(cardsResult);
        }

    }
    async function receiveablesDetail(req, res, globalVar) {
        try {
            //setting the persona name if text message is sent
            if (req.body.message.text) {
                globalVar[`${req.body.user.email}`].personaName = config.personaList[0].nameToDisplay
            }
            var message;
            let result = await receiveablesData.getreceiveablesData(req.body.action.parameters[0].value)
            if ((result.length > 0) && (result !== config.errorMessage)) {
                return res.send(await detailCard.detailCard(result[0], config.receiveablesDetailCard, 'receiveables', config.logoToDisplay[0],
                    config.cardTitle.receiveablesDetailCard))

            } else {
                message = "No Receiveable found with given details. Here are some Receivables you might want to see!";
                return receiveablesList(req, res, globalVar, message)
            }
        } catch (error) {
            console.error(error);
            message = "Error occured while showing Receivables Detail, Please try again!";
            var cardsResult = await serviceList.cardtoDisplay(req, res, config.personaList[0].nameToDisplay, '', message)
            return res.send(cardsResult);
        }
    }
    return {
        receiveablesList,
        receiveablesDetail
    }
}

module.exports = receiveablesMain;
