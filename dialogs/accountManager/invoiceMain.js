const listCard = require('../../cards/common/listCard')
const detailCard = require('../../cards/common/detailCard')
const config = require('../../utility/config')
const invoiceData = require('../../data/database/accountManager/invoiceData')
const errorCard = require('../../cards/common/errorCard')
const serviceList = require('../../cards/common/serviceList')

function invoiceMain() {
    async function invoiceList(req, res, globalVar) {
        try {
            var errorMessage;
            //setting the persona name if text message is sent
            if (req.body.message.text) {
                globalVar[`${req.body.user.email}`].personaName = config.personaList[0].nameToDisplay
            }
            if (req.body.action && req.body.action.parameters) {
                if (req.body.action.parameters[0].value === req.body.action.parameters[0].key)
                    return await invoiceDetail(req, res, globalVar);
            }
            let result = await invoiceData.getinvoiceData(globalVar[`${req.body.user.email}`].accountId);
            if ((result.length > 0) && (result !== config.errorMessage)) {

                return res.send(await listCard.itemListCard(result, config.logoToDisplay[0],
                    config.cardTitle.invoiceListCard, config.listCardAction.invoice))
            } else {
                errorMessage = "No Invoices found, Please try again!"
                return res.send(errorCard.errorMessageCard(config.accountManagerServiceList, errorMessage, ''));
            }
        } catch (error) {
            console.error(error);
            errorMessage = "Error occured while showing Invoice List, Please try again!"
            var cardsResult = await serviceList.cardtoDisplay(req, res, config.personaList[0].nameToDisplay, '', errorMessage)
            return res.send(cardsResult);
        }
    }
    async function invoiceDetail(req, res, globalVar) {
        try {
            var errorMessage;
            //setting the persona name if text message is sent
            if (req.body.message.text) {
                globalVar[`${req.body.user.email}`].personaName = config.personaList[0].nameToDisplay
            }

            let result = await invoiceData.getinvoiceData(req.body.action.parameters[0].value);
            if ((result.length > 0) && (result !== config.errorMessage)) {
                let cardDetail = await detailCard.detailCard(result[0], config.invoiceDetailCard, 'invoice', config.logoToDisplay[0],
                    config.cardTitle.invoiceDetailCard, config.accountManagerServiceList);
                return res.send(cardDetail)
            } else {
                errorMessage = "No Invoice found with given details. Here are some Invoices you might want to see!"
                return invoiceList(req, res, globalVar, errorMessage)
            }
        } catch (error) {
            console.error(error);
            errorMessage = "Error occured while showing Invoice Detail, Please try again!"
            var cardsResult = await serviceList.cardtoDisplay(req, res, config.personaList[0].nameToDisplay, '', errorMessage)
            return res.send(cardsResult);
        }
    }
    return {
        invoiceList,
        invoiceDetail
    }
}

module.exports = invoiceMain