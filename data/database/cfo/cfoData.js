const sql = require('mssql')
const errorMessage = require('../../../utility/config')
async function getCFOData(KpiName) {
    return new Promise((resolve, reject) => {
        try {
            var request = new sql.Request();
            request.input('KpiName', sql.VarChar, KpiName);
            request.query(`SELECT  [KpiName]
            ,[KpiValue]
            ,[currency]
            ,[Percentage]
            ,[PercentSwing]
            ,[YoyGrowth]
            ,[M0],[M1],[M2],[M3],[M4],[M5],[M6],[M7],[M8],[M9],[M10],[M11],[M12]  FROM [BI_CONTENT].[vwKeyIndicator] WHERE [KpiName] = @KpiName`, function (error, recordset) {
                if (error) {
                    console.error(error);
                    reject(errorMessage)
                }
                else {
                    resolve(recordset.recordset);
                }
            });
        } catch (error) {
            console.error(error);
            reject(errorMessage)
        }
    })

}

module.exports = { getCFOData }