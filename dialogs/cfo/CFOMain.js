const config = require('../../utility/config')
const cfoCard = require('../../cards/cfoDashboard')
const CFOWaterfall = 'CFOWaterfall'
const getData = require('../../data/database/cfo/cfoData')
const imageDataApi = require('../../data/api/cfoDashboard')


function CFOMain() {

    async function CFOWaterfallStep1(req, res) {
        try {
            if (req.body.action.parameters && req.body.action.parameters[0].value) {
                ID = req.body.action.parameters[0].value
                kpiname = config.CFOkpinames[req.body.action.parameters[0].value]
            }else{
                ID = 0
                kpiname = config.CFOkpinames[0]
            }
            var data = await getData.getCFOData(kpiname);
            if ((data.length > 0) && (data !== config.errorMessage)) {
                var imageData = await imageDataApi.generateCFODashboard(data)
                var result = await cfoCard.cardToDisplay(config.cardTitle.cfoDashboard, imageData,ID);
                return res.json(result)
            } else {
                // await step.context.sendActivity("No data found for CFO KPI, please try again!")
            }
        } catch (error) {
            console.log(error)
            var cardsResult = await errorCard.errorMessageCard(config.purchaseManagerServiceList, "Error occured while showing CFO card, Please try again")
            return res.json(cardsResult)
        }
    }
    return {
        CFOWaterfallStep1
    }
}

module.exports = CFOMain
