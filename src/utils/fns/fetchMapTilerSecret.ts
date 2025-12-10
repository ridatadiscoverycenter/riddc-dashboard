'use server';

// eslint-disable-next-line @typescript-eslint/no-var-requires
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
const client = new SecretManagerServiceClient();

export async function fetchMapTilerSecret() {
  const [secret] = await client.accessSecretVersion({
    name: 'projects/766398966649/secrets/maptiler-key/versions/1',
  });
  console.log(secret)
  
  return secret.payload.data.toString();
}
