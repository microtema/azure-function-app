import {DefaultAzureCredential} from '@azure/identity';
import {KeyVaultManagementClient} from '@azure/arm-keyvault'
import {CryptographyClient, KeyClient} from '@azure/keyvault-keys';
import * as dotenv from 'dotenv';
import {createHash} from "crypto";

dotenv.config();

const subscriptionId = process.env['SUBSCRIPTION_ID']
const resourceGroupName = process.env['RESOURCE_GROUP_NAME'];
const vaultName = process.env['VAULT_NAME'];

const credentials = new DefaultAzureCredential();
const client = new KeyVaultManagementClient(credentials, subscriptionId);

client.vaults.get(resourceGroupName, vaultName)
    .then((it) => keyClientHandler(it.properties))
    .catch(it => console.error('Unable to get vault: ', it));

const keyClientHandler = async ({vaultUri}: any) => {

    console.log('keyClientHandler', vaultUri);

    const client = new KeyClient(vaultUri, credentials);

    for await (const key of client.listPropertiesOfKeys()) {

        const value = await client.getKey(key.name);

        console.log('key', key);
        console.log('value', value);
    }

    await createCryptographyKey(client);

    await purgeAllKeys(client);
}

const createCryptographyKey = async (client: KeyClient) => {

    const key = await client.createRsaKey('microtema-cryptography')
    console.log('createCryptographyKey#id', key.id);

    // Create connection to Azure Key Vault Cryptography functionality
    const cryptoClient = new CryptographyClient(key.id, credentials);

    // Sign and Verify
    const signatureValue = 'microtema';
    const hash = createHash('sha256');

    hash.update(signatureValue);

    const digest = hash.digest();
    console.log('digest', digest);

    const signature = await cryptoClient.sign('RS256', digest);
    console.log('signature', signature);

    const verifySignature = await cryptoClient.verify('RS256', digest, signature.result);
    console.log('verifySignature', verifySignature);

    // Encrypt
    const encrypt = await cryptoClient.encrypt({algorithm: 'RSA1_5', plaintext: Buffer.from('microtema')});
    console.log('encrypt', encrypt);

    // Decrypt
    const decrypt = await cryptoClient.decrypt({algorithm: 'RSA1_5', ciphertext: encrypt.result});
    console.log('decrypt', decrypt.result.toString());

    // Wrap key
    const wrapped = await cryptoClient.wrapKey('RSA-OAEP', Buffer.from('microtema'));
    console.log('wrapped', wrapped);

    //Unwrap key
    const unwrapped = await cryptoClient.unwrapKey('RSA-OAEP', wrapped.result);
    console.log('unwrapped', unwrapped.result.toString());
}

const purgeAllKeys = async (client: KeyClient) => {

    for await (const key of client.listPropertiesOfKeys()) {
        const poller = await client.beginDeleteKey(key.name);
        await poller.pollUntilDone();
    }


}
