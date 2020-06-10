const config = require('../../utility/config')
const detailByIdData = require('../../data/database/common/findDetailbyIdData')



module.exports.getDetailbyIdType = async (req, res) => {
    try {
        var message;
        var idTypes = await detailByIdData.detailIdfunction(req.body.action.parameters[0].value);
        if (idTypes[0].idType === 'None') {
            message = "Could not find any details for this Id, please try again!";
            return res.send({ message });
        }
        req.body.action.actionMethodName = idTypes[0].idType
    } catch (error) {
        console.error(error);
    }
}
