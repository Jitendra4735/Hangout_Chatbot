const accountList = require('../../cards/accountManager/accountList');
const accountProfile = require('../../cards/accountManager/accountProfile')
const config = require('../../utility/config')
const customerData = require('../../data/database/customerProfile/CustomerData')
const userProfileApi = require('../../data/api/userProfile')
const errorCard = require('../../cards/common/errorCard')

function AccountManagerMain() {
    async function accountManagerWaterfallStep1(req, res,globalVar) {
        // showing account list 
        var message;
        try {
            if (globalVar && globalVar[`${req.body.user.email}`].accountId && globalVar[`${req.body.user.email}`].accountName) {
               return await accountManagerWaterfallStep2(req, res, globalVar);
            }
            var customerListData = await customerData.getCustomerData(process.env.accountManagerId);
            // checking if customer data is there or not
            if ((customerListData.length > 0) && (customerListData !== "")) {
                // displaying customer list
                let customerListCard = await accountList.customerListCard(customerListData, config.cardTitle.customerList);
                return res.send(customerListCard)
            } else {
                message = "No Accounts found, Please try again!";
                var cardsResult = await serviceList.cardtoDisplay(req, res, config.personaList[0].nameToDisplay, '', message)
                return res.send(cardsResult);
            }
        } catch (error) {
            console.error(error);
            message = "Error occured while showing Account List, Please try again!";
            var cardsResult = await serviceList.cardtoDisplay(req, res, config.personaList[0].nameToDisplay, '', message)
            return res.send(cardsResult);
        }

    }
    async function accountManagerWaterfallStep2(req, res, globalVar) {
        // showing account profile
        try {
            var message;
            // checking if required data is there or not to show profile
            if (req.body.action.actionMethodName === config.accountListAction) {
                globalVar[`${req.body.user.email}`].accountId = req.body.action.parameters[0].value
            }
            var dataForImage = await customerData.getCustomerProfileImageData(globalVar[`${req.body.user.email}`].accountId); // getting data to show profit and sales on user Profile
            var imageData = await userProfileApi.generateProfileImage(dataForImage);// getting images generated from above data
            var accountData = await customerData.getCustomerData(globalVar[`${req.body.user.email}`].accountId); // get account profile info
            if ((accountData.length > 0) && (dataForImage.length > 0)) {
                var result = await accountProfile.accountProfile(globalVar[`${req.body.user.email}`].personaName,accountData, imageData); // generating card
                return res.send(result);
            } else {
                message = "No Accounts found with given details. Here are some accounts you might want to try!";
                var cardsResult = await serviceList.cardtoDisplay(req, res, config.personaList[0].nameToDisplay, '', message)
                return res.send(cardsResult);
            }
        } catch (error) {
            console.error(error);
            message = "Error occured while showing Account Details. Please try again!";
            var cardsResult = await serviceList.cardtoDisplay(req, res, config.personaList[0].nameToDisplay, '', message)
            return res.send(cardsResult);
        }
    }
    return {
        accountManagerWaterfallStep1,
        accountManagerWaterfallStep2
    };

}
module.exports = AccountManagerMain;
