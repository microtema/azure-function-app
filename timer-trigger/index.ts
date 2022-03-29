import {AzureFunction, Context} from "@azure/functions"

const timerTrigger: AzureFunction = async (context: Context, timer: any): Promise<void> => {

    const timeStamp = new Date().toISOString();

    context.log('timer', timer);

    if (timer.isPastDue) {
        context.log('Timer function is running late!');
    } else {
        context.log('Timer trigger function ran!', timeStamp);
    }
};

export default timerTrigger;
