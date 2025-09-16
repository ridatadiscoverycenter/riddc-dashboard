'use server';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const client = new SecretManagerServiceClient();

export async function fetchMapTilerSecret() {
  const [secret] = await client.accessSecretVersion({
    name: 'projects/766398966649/secrets/maptiler-key/versions/1',
  });

  return secret.payload.data.toString();
}
