import tl = require('azure-pipelines-task-lib/task');
import axios from 'axios';

async function run() {
    try {
        const bridgeUrl: string = tl.getInput('bridge-url', true)!;
        const secretKey: string = tl.getInput('secret-key', true)!;
        const apiUrl: string = tl.getInput('api-url', true)!;

        console.log(`Bridge URL ${bridgeUrl} ...`);
        const response = await syncState(bridgeUrl, secretKey, apiUrl);

        // Set output variables
        tl.setVariable('result', JSON.stringify(response));
        tl.setVariable('success', 'true');

        tl.setResult(tl.TaskResult.Succeeded, 'Task completed successfully');
    } catch (error) {
        if (error instanceof Error) {
            tl.setResult(tl.TaskResult.Failed, error.message);
        } else {
            tl.setResult(tl.TaskResult.Failed, 'An unknown error occurred');
        }
        tl.setVariable('result', '{}');
        tl.setVariable('success', 'false');
    }
}

async function syncState(
    bridgeUrl: string,
    secretKey: string,
    apiUrl: string
): Promise<object> {
    const sync = await axios.post(
        `${apiUrl}/v1/bridge/sync?source=azureDevOpsExtension`,
        {
            bridgeUrl
        },
        {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `ApiKey ${secretKey}`
            }
        }
    );
    return sync.data;
}

run();
