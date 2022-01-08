import {AzureFunction, Context, HttpRequest} from "@azure/functions"

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<any> => {

    return {
        status: 200,
        body: {context, req}
    };

};

export default httpTrigger;
