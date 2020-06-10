const teamCard = require('../../cards/common/teamCard')
const config = require('../../utility/config')
const errorCard = require('../../cards/common/errorCard')

function teamMain() {
    async function teamWaterfallStep1(req, res, globalVar) {
        try {
            if ((globalVar[`${req.body.user.email}`].personaName === config.personaList[2].nameToDisplay)) {
                //setting the persona name
                globalVar[`${req.body.user.email}`].personaName = config.personaList[2].nameToDisplay
                if (globalVar[`${req.body.user.email}`].teamMemberID) {
                    var cardsResult = await teamCard.teamCard('procurement', config.procurmentTeamCard, globalVar[`${req.body.user.email}`].teamMemberID)
                } else {
                    var cardsResult = await teamCard.teamCard('procurement', config.procurmentTeamCard)
                }
                return res.json(cardsResult)
            }
            else {
                //setting the persona name
                globalVar[`${req.body.user.email}`].personaName = config.personaList[1].nameToDisplay
                if (globalVar[`${req.body.user.email}`].teamMemberID) {
                    var cardsResult = await teamCard.teamCard('sales', config.salesTeamCard, globalVar[`${req.body.user.email}`].teamMemberID)
                } else {
                    var cardsResult = await teamCard.teamCard('sales', config.salesTeamCard)
                }
                return res.json(cardsResult)
            }
        } catch (error) {
                if(globalVar[`${req.body.user.email}`].personaName === config.personaList[2].nameToDisplay){
                    var cardsResult = await errorCard.errorMessageCard(config.purchaseManagerServiceList,"No Team members found, please try again!")
                }
                else{
                    var cardsResult = await errorCard.errorMessageCard(config.salesManagerServiceList,"No Team members found, please try again!")
                }
                return res.json(cardsResult)
        }
    }
    return {
        teamWaterfallStep1
    }

}

module.exports = teamMain