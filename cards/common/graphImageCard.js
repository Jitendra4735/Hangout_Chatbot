var header = require('./header')
const config = require('../../utility/config')
var serviceListCard = require('./serviceList')
const upload = require('../../utility/imageFileUploadToBlob')
const graphData = require('../../data/database/common/graphData')
const imageApi = require('../../data/api/graphApi')

exports.graphImage = async (req,res,globalVar, logo, cardTitle) => {
  try {
    var card = await header.headerWithoutAccountName(logo, cardTitle)
    if (cardTitle === config.purchaseManagerServiceList[0]) {
      var data = await graphData.getSpendByHeadData();
      var imageBase64 = await imageApi.spendByHeadImage(data);
      if (imageBase64) {
        var uploadedImage = await upload.uploadFileToBlob('spendByHead.jpg', GetBuffer(imageBase64));
        image = uploadedImage.url
      }
      else {
        image = 'https://www.sapanalytics.cloud/wp-content/uploads/2017/03/Bar-stacked.png'
      }
    }
    else if (cardTitle === config.purchaseManagerServiceList[1]) {
      var data = await graphData.getDirectIndirect();
      var imageBase64 = await imageApi.directIndirectImage(data);
      if (imageBase64) {
        var uploadedImage = await upload.uploadFileToBlob('directIndirect.jpg', GetBuffer(imageBase64));
        image = uploadedImage.url
      }
      else {
        image = 'https://experience.sap.com/fiori-design-web/wp-content/uploads/sites/5/2017/11/1.52-Chart-Toolbar-Size-L-1.png'
      }
    }
    else if (cardTitle === config.purchaseManagerServiceList[2]) {
      var data = await graphData.getplannedActual();
      var imageBase64 = await imageApi.plannedActualImage(data);
      if (imageBase64) {
        var uploadedImage = await upload.uploadFileToBlob('plannedActual.jpg', GetBuffer(imageBase64));
        image = uploadedImage.url
      }
      else {
        image = 'https://experience.sap.com/fiori-design-web/wp-content/uploads/sites/5/2017/11/variation-Through-Time-v1_edit_53.png'
      }
    }
    else if (cardTitle === config.salesManagerServiceList[2]) {
      var data = await graphData.getOppPipelineData();
      var imageBase64 = await imageApi.OpportunityPipelineImage(data);
      if (imageBase64) {
        var uploadedImage = await upload.uploadFileToBlob('plannedActual.jpg', GetBuffer(imageBase64));
        image = uploadedImage.url
      }
      else {
        image = 'https://help.anaplan.com/anapedia/Content/Resources/Images/DV/Charts/Funnel%20Charts/0.png'
      }
    }
    card['cards'][0]["sections"].push(
      {
        "widgets": [
          {
            "image": {
              "imageUrl": image,
              "onClick": {
                "openLink": {
                  "url": image
                }
              }
            }
          }
        ]
      }
    );

    return serviceListCard.cardtoDisplay(req,res,globalVar[`${req.body.user.email}`].personaName,card);
  }
  catch (error) {
    console.error(error);
    return errorMessage
  }
}
function GetBuffer(imageBase64) {
  var matches = `data:image/jpg;base64,${imageBase64}`.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  return Buffer.from(matches[2], 'base64');
}