import {AzureFunction, Context} from "@azure/functions"

const serviceBusTopicTrigger: AzureFunction = async function(context: Context, message: any): Promise<void> {
    context.log('ServiceBus topic trigger function processed message', message);
    return Promise.resolve()
};

export default serviceBusTopicTrigger;
