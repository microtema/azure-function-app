import {AzureFunction, Context, HttpRequest} from "@azure/functions"

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
    context.log('HTTP trigger function processed a request.');
    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = `convert ${name} to csv file`;

    context.res = {
        status: 200,
        body: responseMessage
    };

};

export default httpTrigger;
