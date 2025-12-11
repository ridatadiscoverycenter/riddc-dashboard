'use server';

import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
const client = new SecretManagerServiceClient();

export async function fetchMapTilerSecret() {
  const [secret] = await client.accessSecretVersion({
    name: 'projects/766398966649/secrets/maptiler-key/versions/1',
  });

  if (secret.payload && secret.payload.data) {
    return secret.payload.data.toString();
  } else {
    throw new Error('Invalid or no api key retreived');
  }
}
