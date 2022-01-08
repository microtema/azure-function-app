import {AzureFunction, Context} from "@azure/functions"

const blobTrigger: AzureFunction = async (context: Context, blob: any): Promise<void> => {
    context.log("Blob trigger function processed blob Name:", context.bindingData.name, "Blob Size:", blob.length, "Bytes");
};

export default blobTrigger;
