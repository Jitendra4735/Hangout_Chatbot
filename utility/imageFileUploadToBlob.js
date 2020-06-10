const azureStorage = require('azure-storage');
const getStream = require('into-stream');

const azureStorageConfig = {
    accountName: process.env.StorageAccountName,
    accountKey: process.env.StorageAccountAccessKey,
    blobURL: process.env.BlobUrl,
    containerName: process.env.ContainerName
};
exports.uploadFileToBlob = async (file, buffer) => {

    return new Promise((resolve, reject) => {
        try {
            const blobName = getBlobName(file);
            const stream = getStream(buffer);
            const streamLength = buffer.length;

            const blobService = azureStorage.createBlobService(azureStorageConfig.accountName, azureStorageConfig.accountKey);
            blobService.createBlockBlobFromStream(azureStorageConfig.containerName, `${blobName}`, stream, streamLength, error => {
                if (error) {
                    reject(error);
                } else {
                    resolve({
                        url: `${azureStorageConfig.blobURL}${azureStorageConfig.containerName}/${blobName}`
                    });
                }
            });
        }
        catch (error) {
            console.error(error);
            reject(errorMessage)
        }
    });

};

const getBlobName = originalName => {
    const identifier = Math.random().toString().replace(/0\./, ''); // remove "0." from start of string
    return `${identifier}-${originalName}`;
};

exports.GetBuffer = (imageBase64) => {
    var matches = `data:image/jpg;base64,${imageBase64}`.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    return Buffer.from(matches[2], 'base64');
}
