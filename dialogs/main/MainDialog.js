// importing all the required files for working of bot
const databaseConnection = require('../../data/database/DatabaseConnection')
const personaCard = require('../../cards/common/personaCard')
const config = require('../../utility/config')
const customerData = require('../../data/database/customerProfile/CustomerData')
const AccountManagerMain = require('../accountManager/AccountManagerMain')
const InvoiceMain = require('../accountManager/invoiceMain')
const ReceiveablesMain = require('../accountManager/receiveablesMain')
const OpportunityMain = require('../common/OpportunityMain')
const SalesMain = require('../common/SalesMain')
const PrMain = require('../purchaseManager/PRMain')
const PoMain = require('../purchaseManager/POMain')
const CreateOpportunityMain = require('../common/CreateOpportunityMain')
const TeamMain = require('../common/teamMemberMain')
const GraphImageMain = require('../common/GraphImageMain')
const FindDetailbyID = require('../common/findDetailbyID')
const luisapi = require('../../data/api/luisApi')
const serviceListCard = require('../../cards/common/serviceList')
const CFOMain = require('../cfo/CFOMain')
var topIntent = 'test'
// declaring dialog variable
function MainDialog() {

    async function mainDialogStep1(req, res, globalVar) {

        function dateToday(date) {
            var today = date
            var dd = today.getDate();

            var mm = today.getMonth() + 1;
            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }

            if (mm < 10) {
                mm = '0' + mm;
            }

            return today = yyyy + '-' + mm + '-' + dd;
        }

        var amount = /^\$?[0-9]?((\.[0-9]+)|([0-9]+(\.[0-9]+)?))$/;
        var closeDate = /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/;
        var opportunityStage = ["prospecting", "value preposition", "close won", "close lost", "need analysis"]
        var opportunityType = ["new", "existing"]
        var leadSource = ["web", "partner referral", "phone inquiry", "tide 2019", "other"]

        try {
            if (globalVar[`${req.body.user.email}`].storedOpportunityQuestion < 7) {


                var a = (globalVar[`${req.body.user.email}`]['storedOpportunityQuestion'])
                if (globalVar[`${req.body.user.email}`].storedOpportunityQuestion === 6) {
                    if (req.body.action.actionMethodName === 'Cancel') {
                        req.body.action.actionMethodName = 'Cancel'
                    }
                    else {
                        req.body.action.actionMethodName = config.createOpportunityInsertData
                    }
                }
                else {
                    if (a > -1) {
                        a += 1
                        var b = config.createOpportunityQuestion[a]
                        switch (a) {
                            case 1:

                                globalVar[`${req.body.user.email}`].CreateOpportunityQA[b] = req.body.message.text;
                                break;
                            case 2:
                                if (req.body.message.text.match(amount)) {
                                    globalVar[`${req.body.user.email}`].CreateOpportunityQA[b] = req.body.message.text;
                                }
                                else {

                                    globalVar[`${req.body.user.email}`].storedOpportunityQuestion -= 1
                                }
                                break;
                            case 3:
                                if (req.body.message.text.match(closeDate)) {
                                    var dateUser = new Date(req.body.message.text)
                                    var dateUser1 = dateToday(dateUser)
                                    var dateTest = dateToday(new Date());

                                    if (dateUser1 > dateTest) {
                                        globalVar[`${req.body.user.email}`].CreateOpportunityQA[b] = req.body.message.text;

                                    }
                                    else {
                                        globalVar[`${req.body.user.email}`].storedOpportunityQuestion -= 1

                                    }

                                }
                                else {

                                    globalVar[`${req.body.user.email}`].storedOpportunityQuestion -= 1
                                }
                                break;
                            case 4:
                                if (req.body.message.text !== undefined) {
                                    if (req.body.message.text.toLowerCase() === opportunityStage[0] || req.body.message.text.toLowerCase() === opportunityStage[1] || req.body.message.text.toLowerCase() === opportunityStage[2] ||
                                        req.body.message.text.toLowerCase() === opportunityStage[3] || req.body.message.text.toLowerCase() === opportunityStage[4]) {
                                        globalVar[`${req.body.user.email}`].CreateOpportunityQA[b] = req.body.message.text;
                                    }
                                    else {

                                        globalVar[`${req.body.user.email}`].storedOpportunityQuestion -= 1
                                    }
                                }
                                else if(req.body.action !== undefined){
                                if (req.body.action.actionMethodName.toLowerCase() === opportunityStage[0] || req.body.action.actionMethodName.toLowerCase() === opportunityStage[1] || req.body.action.actionMethodName.toLowerCase() === opportunityStage[2] ||
                                    req.body.action.actionMethodName.toLowerCase() === opportunityStage[3] || req.body.action.actionMethodName.toLowerCase() === opportunityStage[4]) {
                                    globalVar[`${req.body.user.email}`].CreateOpportunityQA[b] = req.body.action.actionMethodName;
                                }
                                else {

                                    globalVar[`${req.body.user.email}`].storedOpportunityQuestion -= 1
                                }
                            }

                                break;
                            case 5:
                                if (req.body.message.text !== undefined) {
                                    if (req.body.message.text.toLowerCase() === opportunityType[0] || req.body.message.text.toLowerCase() === opportunityType[1] || req.body.message.text.toLowerCase() === opportunityType[2] ||
                                        req.body.message.text.toLowerCase() === opportunityType[3] || req.body.message.text.toLowerCase() === opportunityType[4]) {
                                        globalVar[`${req.body.user.email}`].CreateOpportunityQA[b] = req.body.message.text;
                                    }
                                    else {

                                        globalVar[`${req.body.user.email}`].storedOpportunityQuestion -= 1
                                    }
                                }
                                else if(req.body.action !== undefined){

                                if (req.body.action.actionMethodName.toLowerCase() === opportunityType[0] || req.body.action.actionMethodName.toLowerCase() === opportunityType[1]) {

                                    globalVar[`${req.body.user.email}`].CreateOpportunityQA[b] = req.body.action.actionMethodName;
                                }
                                else {

                                    globalVar[`${req.body.user.email}`].storedOpportunityQuestion -= 1
                                }
                            }
                                break;
                            case 6:
                                if (req.body.message.text !== undefined) {
                                    if (req.body.message.text.toLowerCase() === leadSource[0] || req.body.message.text.toLowerCase() === leadSource[1] || req.body.message.text.toLowerCase() === leadSource[2] ||
                                        req.body.message.text.toLowerCase() === leadSource[3] || req.body.message.text.toLowerCase() === leadSource[4]) {
                                        globalVar[`${req.body.user.email}`].CreateOpportunityQA[b] = req.body.message.text;
                                    }
                                    else {

                                        globalVar[`${req.body.user.email}`].storedOpportunityQuestion -= 1
                                    }
                                }
                                else if(req.body.action !== undefined){

                                if (req.body.action.actionMethodName.toLowerCase() === leadSource[0] || req.body.action.actionMethodName.toLowerCase() === leadSource[1] || req.body.action.actionMethodName.toLowerCase() === leadSource[2] ||
                                    req.body.action.actionMethodName.toLowerCase() === leadSource[3] || req.body.action.actionMethodName.toLowerCase() === leadSource[4]) {

                                    globalVar[`${req.body.user.email}`].CreateOpportunityQA[b] = req.body.action.actionMethodName;
                                }
                                else {

                                    globalVar[`${req.body.user.email}`].storedOpportunityQuestion -= 1
                                }
                            }
                                break;


                        }
                    }
                    if (req.body.message.text !== undefined) {
                        req.body.action = {}

                        req.body.action.actionMethodName = config.createOpportunityInsertData
                    }
                    else {
                        req.body.action.actionMethodName = config.createOpportunityInsertData

                    }

                    return mainDialogStep2(req, res, globalVar)

                }
            }

            if ((req.body.message.text && (globalVar[`${req.body.user.email}`].storedOpportunityQuestion === undefined || globalVar[`${req.body.user.email}`].storedOpportunityQuestion < -1 || globalVar[`${req.body.user.email}`].storedOpportunityQuestion >= 7))) {
                // recognizing luis results
                topIntent = await luisapi.luisApi(req.body.message.text)
                req.body.action = {}
                let details = await getAccoutId(globalVar, req) // fetching account details based on account name
                let id = await getId(globalVar, req) // fetching deatils of id to be used in all functionalities
               
                // checking intent or action to move to next flow
                if (topIntent) {
                    req.body.action.actionMethodName = topIntent.replace(/_/g, " ") // assigning intent value to action to ease flow
                    return mainDialogStep2(req, res, globalVar)
                } else {
                    return mainDialogStep2(req, res, globalVar)
                }
            }
            if (req.body.message.text === undefined && (globalVar[`${req.body.user.email}`].storedOpportunityQuestion === undefined || globalVar[`${req.body.user.email}`].storedOpportunityQuestion < -1 || globalVar[`${req.body.user.email}`].storedOpportunityQuestion >= 7)) {
                return mainDialogStep2(req, res, globalVar)
            }
            else {// if nothing matches show persona card

                // if (step.context.activity.value && step.context.activity.value.id) {
                //     accountDetails.Id = step.context.activity.value.id
                //     await this.userData.set(step.context, accountDetails)
                // }
                return mainDialogStep2(req, res, globalVar)
            }
        } catch (error) {
            return mainDialogStep2(req, res, globalVar)
        }
    }
    async function mainDialogStep2(req, res, globalVar) {

        //Instances of the functions called
        const accountManagerMain = new AccountManagerMain();
        const invliceMain = new InvoiceMain();
        const receiveablesMain = new ReceiveablesMain();
        const saleMain = new SalesMain();
        const opportunityMain = new OpportunityMain()
        const prMain = new PrMain();
        const poMain = new PoMain();
        const teamMain = new TeamMain();
        const graphImageMain = new GraphImageMain();
        const createOpportunityMain = new CreateOpportunityMain()
        const cfo = new CFOMain()

        try {
            //console.log('---------------'+JSON.stringify(req.body.action))
            //if (req.body.type == 'MESSAGE' || req.body.type == 'CARD_CLICKED') {
            if (req.body.action && req.body.action.actionMethodName || (!req.body.action.parameters)) {
                switch (req.body.action.actionMethodName) {

                    // routing personas
                    case config.personaList[0].nameToDisplay:
                        globalVar[`${req.body.user.email}`].personaName = req.body.action.actionMethodName;
                        accountManagerMain.accountManagerWaterfallStep1(req, res,globalVar);
                        break;
                    case config.personaList[1].nameToDisplay:
                        globalVar[`${req.body.user.email}`].personaName = req.body.action.actionMethodName;
                        globalVar[`${req.body.user.email}`].graphName =config.salesManagerServiceList[2];
                        return graphImageMain.graphImageMainStep1(req, res, globalVar)
                    case config.personaList[2].nameToDisplay:
                        globalVar[`${req.body.user.email}`].personaName = req.body.action.actionMethodName;
                        globalVar[`${req.body.user.email}`].graphName = config.purchaseManagerServiceList[0];
                        return graphImageMain.graphImageMainStep1(req, res, globalVar)
                        break;
                    case config.personaList[3].nameToDisplay:
                        return cfo.CFOWaterfallStep1(req, res)
                        break;

                    // routing services in account manager persona
                    case config.accountListAction:
                        return accountManagerMain.accountManagerWaterfallStep2(req, res, globalVar);
                        break;
                    case config.accountManagerServiceList[5]:
                        //globalVar.accountId = null
                        globalVar[`${req.body.user.email}`].accountName = null
                        globalVar[`${req.body.user.email}`].accountId = null
                        return accountManagerMain.accountManagerWaterfallStep1(req, res, globalVar);
                    case config.accountManagerServiceList[3]:
                        return invliceMain.invoiceList(req, res, globalVar);
                        break;
                    case config.accountManagerServiceList[4]:
                        return receiveablesMain.receiveablesList(req, res, globalVar);
                        break;
                    case config.listCardAction.invoice:
                        return invliceMain.invoiceDetail(req, res, globalVar)
                        break;
                    case config.listCardAction.receiveables:
                        return receiveablesMain.receiveablesDetail(req, res, globalVar)
                        break;

                    //graphs
                    case config.purchaseManagerServiceList[0]: case config.purchaseManagerServiceList[1]: case config.purchaseManagerServiceList[2]: case config.salesManagerServiceList[2]:
                        globalVar[`${req.body.user.email}`].graphName = req.body.action.actionMethodName;
                        return graphImageMain.graphImageMainStep1(req, res, globalVar)
                        break;

                    //Team members common for sales and purchase
                    case config.purchaseManagerServiceList[3]: case config.salesManagerServiceList[3]:
                        return teamMain.teamWaterfallStep1(req, res, globalVar)
                        break;
                    //Team members card when pressed next or previous
                    case config.TeamMemberCard[0]: case config.TeamMemberCard[1]:
                        globalVar[`${req.body.user.email}`].teamMemberID = req.body.action.parameters[0].value;
                        return teamMain.teamWaterfallStep1(req, res, globalVar)
                        break;

                    // routing services in purchase manager persona
                    case config.purchaseManagerServiceList[4]: case 'Purchase Requisitions':
                        return prMain.prWaterfallStep1(req, res, globalVar);
                        break;
                    case config.listCardAction.pr:
                        return prMain.prWaterfallStep2(req, res, globalVar)
                        break;
                    case config.purchaseManagerServiceList[5]:
                        return poMain.poWaterfallStep1(req, res, globalVar);
                        break;
                    case config.listCardAction.po:
                        return poMain.poWaterfallStep2(req, res, globalVar);
                        break;

                    //routing services in sales manager  
                    case config.accountManagerServiceList[2]: case config.salesManagerServiceList[0]: case config.salesManagerServiceList[4]:
                        return saleMain.salesStep1(req, res, globalVar);
                        break;
                    case config.accountManagerServiceList[0]: case config.salesManagerServiceList[1]: case config.salesManagerServiceList[5]:
                        return opportunityMain.opportunityWaterfallStep1(req, res, globalVar);
                        break;
                    case config.listCardAction.sales:
                        return saleMain.salesStep2(req, res, globalVar)
                        break;
                    case config.listCardAction.opportunity:
                        return opportunityMain.opportunityWaterfallStep2(req, res, globalVar)
                        break;

                    // create opportunity
                    case config.createOpportunityInsertData:
                        if (globalVar[`${req.body.user.email}`].storedOpportunityQuestion === -1) {
                            globalVar[`${req.body.user.email}`].CustomerId = req.body.action.parameters[0].value
                        }
                        globalVar[`${req.body.user.email}`].storedOpportunityQuestion += 1
                        return createOpportunityMain.createOpportunityWaterfallStep2(req, res, globalVar);
                        break;
                    case config.accountManagerServiceList[1]: case config.salesManagerServiceList[6]:

                        return createOpportunityMain.createOpportunityWaterfallStep1(req, res, globalVar)
                        break;

                    //help service
                    case config.help[0]:
                        card = serviceListCard.cardtoDisplay(req, res, globalVar[`${req.body.user.email}`].personaName)
                        return res.json(card)
                        break;
                    case config.createOpportunityAction[1]:
                        globalVar[`${req.body.user.email}`] = {}
                        let card1 = personaCard.showPersonaCard(req.body.user.displayName);
                        return res.json(card1)
                    // routing default persona
                    default:
                        globalVar[`${req.body.user.email}`] = {}
                        card = personaCard.showPersonaCard(req.body.user.displayName);
                        return res.json(card)
                }
            }
            else if ((req.body.action.parameters[0].value) && (!req.body.action.actionMethodName)) {
                await FindDetailbyID.getDetailbyIdType(req, res);
                mainDialogStep2(req, res, globalVar);
                
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function getAccoutId(globalVar, req) {
        try {
            let text = req.body.message.text;
            if (text.toLowerCase().includes("contoso")) {
                let temp = text.toLowerCase().split(" ");
                var index = temp.indexOf("contoso")
                var account = temp[index].trim() + " " + temp[index + 1].trim()
                await customerData.getCustomerData(process.env.accountManagerId).then(async customerListData => {
                    for (let i = 0; i < customerListData.length; i++) {
                        if (customerListData[i].CustomerName.trim().toLowerCase() === account.trim().toLowerCase()) {
                            globalVar[`${req.body.user.email}`].accountId = customerListData[i].CustomerId
                            globalVar[`${req.body.user.email}`].accountName = customerListData[i].CustomerName
                            return globalVar
                        } else if (i === customerListData.length) {
                            return config.errorMessage
                        }
                    }
                })
            } else {
                return config.errorMessage
            }
        } catch (error) {
            console.error(error);
            return config.errorMessage
        }
    }
    async function getId(globalVar, req) {
        try {
            let text = req.body.message.text;
            if (/\d/.test(text)) {
                let temp = text.split(" ");
                for (let j = 0; j < temp.length; j++) {
                    if (/\d/.test(temp[j].trim())) {
                        req.body.action.parameters = [];
                        req.body.action.parameters.push({ key: temp[j].trim(), value: temp[j].trim() })
                        if (temp.length === 1) {
                            topIntent = null
                        }
                        return req
                    } else if (j === temp.length) {
                        return config.errorMessage
                    }
                }
            } else {
                return config.errorMessage
            }
        } catch (error) {
            console.error(error);
            return config.errorMessage
        }
    }
    return {
        mainDialogStep1,
        mainDialogStep2
    }
}

module.exports = MainDialog;

