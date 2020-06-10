const config = require('../../utility/config')
const serviceList = require('../../cards/common/serviceList')
const timeOut = require('../../utility/timeout')
const customerData = require('../../data/database/customerProfile/CustomerData')
const accountList = require('../../cards/accountManager/accountList');
const createOpportunityCard = require('../../cards/common/createOpportunityCard')
const createOpportunityApi = require('../../data/salesforce/createOpportunityApi')
const opportunityData = require('../../data/database/common/opportunityData')
const createOpportunityAskQuestion = require('../../cards/common/createOpportunityAskQuestion')
const personaCard = require('../../cards/common/personaCard')
var suggestionButton = require('../../cards/common/suggestionCard')
function createOpportunityMain() {
    async function createOpportunityWaterfallStep1(req, res, globalVar) {

        //setting the persona name
        if (req.body.message.text) {
            globalVar[`${req.body.user.email}`].personaName = config.personaList[1].nameToDisplay
        }

        globalVar[`${req.body.user.email}`].storedOpportunityQuestion = -1;
        globalVar[`${req.body.user.email}`].CreateOpportunityQA = {};
        globalVar[`${req.body.user.email}`].CustomerId = 0;
        try {
            var customerListData = await customerData.getCustomerData(process.env.accountManagerId);
            if ((customerListData.length > 0) && (customerListData !== "")) {
                res.send(await accountList.customerListCard(customerListData, config.cardTitle.createOpportunityAccountList));
            } else {
                return res.send("No Accounts found, Please try again!")
            }
        }
        catch (error) {
            console.error(error);
            return res.send("Error occured while showing Account List to Create Opportunity, Please try again!")
        }
    }
    async function createOpportunityWaterfallStep2(req, res, globalVar) {
        var a = (globalVar[`${req.body.user.email}`]['storedOpportunityQuestion'])
        try {
            let accountDetails = {}
            switch (config.createOpportunityQuestion[a]) {
                case config.createOpportunityQuestion[0]:
                    var text = `Please enter ${config.createOpportunityQuestion[1]}`
                    return res.send(createOpportunityAskQuestion.askQuestion(text))
                    //return res.json({text})
                    break;
                case config.createOpportunityQuestion[1]:
                    var showOpporunity = `${config.createOpportunityQuestion[1]} : ${globalVar[`${req.body.user.email}`].CreateOpportunityQA.OpportunityName}`
                    var text = `Please enter ${config.createOpportunityQuestion[2]}  (<b> $2000 </b>)`
                    return res.send(createOpportunityAskQuestion.askQuestion(text, showOpporunity))
                    break;
                case config.createOpportunityQuestion[2]:
                    var showOpporunity = `${config.createOpportunityQuestion[2]} : ${globalVar[`${req.body.user.email}`].CreateOpportunityQA.Amount}`
                    var text = `Please enter ${config.createOpportunityQuestion[3]}  (<b> yyyy-mm-dd </b>)`
                    return res.send(createOpportunityAskQuestion.askQuestion(text, showOpporunity))
                    break;
                case config.createOpportunityQuestion[3]:
                    var showOpporunity = `${config.createOpportunityQuestion[3]} : ${globalVar[`${req.body.user.email}`].CreateOpportunityQA.CloseDate}`

                    var opportunityStage = ["Prospecting", "Value Preposition", "Close Won", "Close Lost", "Need Analysis"]

                    var text = `Please select ${config.createOpportunityQuestion[4]}`
                    return res.send(suggestionButton.getSuggestionButton(opportunityStage, text, showOpporunity))
                    break;
                case config.createOpportunityQuestion[4]:
                    var showOpporunity = `${config.createOpportunityQuestion[4]} : ${globalVar[`${req.body.user.email}`].CreateOpportunityQA.OpportunityStage}`

                    var opportunityType = ["New", "Existing"]
                    var text = `Please select ${config.createOpportunityQuestion[5]}`
                    return res.send(suggestionButton.getSuggestionButton(opportunityType, text, showOpporunity))
                    break;
                case config.createOpportunityQuestion[5]:
                    var showOpporunity = `${config.createOpportunityQuestion[5]} : ${globalVar[`${req.body.user.email}`].CreateOpportunityQA.OpportunityType}`

                    var leadSource = ["Web", "Partner Referral", "Phone Inquiry", "TIDE 2019", "Other"]
                    var text = `Please select ${config.createOpportunityQuestion[6]}`
                    return res.send(suggestionButton.getSuggestionButton(leadSource, text, showOpporunity))
                    break;
                case config.createOpportunityQuestion[6]:
                    var showOpporunity = `<b> ${config.createOpportunityQuestion[6]} : ${globalVar[`${req.body.user.email}`].CreateOpportunityQA.LeadSource} </b>`
                    var submitDetails = ["Submit", "Cancel"]
                    var text = `<b>Do you want to Submit Opportunity Details?</b>`
                    return res.send(suggestionButton.getSuggestionButton(submitDetails, text, showOpporunity))

                    break;
                case config.createOpportunityQuestion[7]:
                    {
                        var sfId = 'test';
                        var accountId = globalVar[`${req.body.user.email}`].CustomerId
                        var accountName;
                        if (accountId === "0000000051") {
                            accountName = "Contoso Manufacturing"
                            sfId = '0010o00002gY2YH'
                        } else {
                            accountName = "Contoso Retail"
                            sfId = '0010o00002apCVa'

                        }
                        var opportunityName = globalVar[`${req.body.user.email}`].CreateOpportunityQA.OpportunityName;
                        var amount = globalVar[`${req.body.user.email}`].CreateOpportunityQA.Amount
                        var closeDate = globalVar[`${req.body.user.email}`].CreateOpportunityQA.CloseDate
                        var opportunityStage = globalVar[`${req.body.user.email}`].CreateOpportunityQA.OpportunityStage
                        var opportunityType = globalVar[`${req.body.user.email}`].CreateOpportunityQA.OpportunityType
                        var leadSource = globalVar[`${req.body.user.email}`].CreateOpportunityQA.LeadSource
                        var id;
                        await createOpportunityApi(opportunityName, amount, closeDate, opportunityStage, opportunityType,
                            leadSource, sfId).then(async result => {// hardcoded salesforce account id to contoso retail
                                id = result.id;
                                opportunityData.createOpportunity(opportunityName, amount, closeDate, opportunityStage,
                                    opportunityType, leadSource, accountName, accountId, result.id)
                            });
                    }
                    var text = `Opportunity created sucessfully.Press any key to continue`

                    var card = {
                        "cards": [
                            {
                                "sections": [

                                    {
                                        "widgets": [
                                            {

                                                "textParagraph": {
                                                    "text": `${text}`
                                                },
                                                "buttons": [
                                                    {
                                                        "textButton": {
                                                            "text": `${id}`,
                                                            "onClick": {
                                                                "openLink": {
                                                                    "url": `https://ap8.salesforce.com/${id}`
                                                                }
                                                            }
                                                        }

                                                    }
                                                ]


                                            },

                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                    return res.send(card)
            }
        }
        catch (error) {
            console.error(error);
            var text = "Error occured while showing Create Opportunity card, Please try again!"
            res.send({ text })
        }
    }

    return {
        createOpportunityWaterfallStep1,
        createOpportunityWaterfallStep2
    }
}
module.exports = createOpportunityMain
