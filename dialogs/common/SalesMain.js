const listCard = require('../../cards/common/listCard')
const detailCard = require('../../cards/common/detailCard')
const config = require('../../utility/config')
const serviceList = require('../../cards/common/serviceList1')
const timeOut = require('../../utility/timeout')
const salesData = require('../../data/database/common/salesData')


function salesMain() {
    async function salesStep1(req, res, globalVar) {
        try {
            var serviceList;
            //setting the persona 
            if (req.body.message.text) {
                globalVar[`${req.body.user.email}`].personaName = config.personaList[1].nameToDisplay
            }
            if (req.body.action && req.body.action.parameters) {
                if (req.body.action.parameters[0].value === req.body.action.parameters[0].key)
                    return await salesStep2(req, res, globalVar);
            }
            if (req.body.action.actionMethodName === config.salesManagerServiceList[0]) {
                let result = await salesData.getSalesCurrentPeriod()
                if ((result.length > 0) && (result !== config.errorMessage)) {
                    let a = await (listCard.itemListCard(result, config.logoToDisplay[0],
                        config.cardTitle.salesListCard, config.listCardAction.sales))
                    res.send(a)
                } else {
                    return res.send({ message: "No Sales Order found, Please try again!" })
                }
            } else {

                let result = await salesData.getSalesData(globalVar[`${req.body.user.email}`].accountId)
                if ((result.length > 0) && (result !== config.errorMessage)) {
                    return res.send(await listCard.itemListCard(result, config.logoToDisplay[0],
                        config.cardTitle.salesListCard, config.listCardAction.sales))
                } else {
                    return res.send({ message: "No Sales Order found, Please try again!" })
                }
            }

        } catch (error) {
            console.error(error);
            message = "Error occured while showing Sales Order List, Please try again!";
            var cardsResult = await serviceList.cardtoDisplay(req, res, globalVar[`${req.body.user.email}`].personaName, '', message)
            return res.send(cardsResult);
        }
    }

    async function salesStep2(req, res, globalVar) {
        try {

            if (req.body.message.text) {
                globalVar[`${req.body.user.email}`].personaName = config.personaList[1].nameToDisplay
            }
            let id;
            if ((req.body.action.actionMethodName === config.listCardAction.sales) || req.body.action.parameters[0].value) {
                if (req.body.action.actionMethodName === config.listCardAction.sales) {
                    id = req.body.action.parameters[0].value
                }
                let result = await salesData.getSalesData(id)
                if ((result.length > 0) && (result !== config.errorMessage)) {
                    return res.send(await detailCard.detailCard(result[0], config.salesDetailCard, 'sales', config.logoToDisplay[0],
                        config.cardTitle.salesDetailCard))
                } else {
                    id = null
                    return res.send({ message: "No Sales Order found with given details. Here are some Sales Order you might want to see!" })
                }
            }
        } catch (error) {
            console.error(error);
            message = "Error occured while showing Sales Order Detail, Please try again!";
            var cardsResult = await serviceList.cardtoDisplay(req, res, globalVar[`${req.body.user.email}`].personaName, '', message)
            return res.send(cardsResult);
        }

    }
    return {
        salesStep1,
        salesStep2
    }
}

module.exports = salesMain 