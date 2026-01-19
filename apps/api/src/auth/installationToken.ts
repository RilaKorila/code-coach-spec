import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.INSTALLATION_TOKEN_SECRET ?? 'dev-secret');

export type InstallationClaims = {
  installationId: string;
  userId: string;
};

export async function issueInstallationToken(claims: InstallationClaims): Promise<string> {
  return await new SignJWT({ installationId: claims.installationId, userId: claims.userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret);
}

export async function verifyInstallationToken(token: string): Promise<InstallationClaims> {
  const { payload } = await jwtVerify(token, secret);
  const installationId = payload.installationId;
  const userId = payload.userId;
  if (typeof installationId !== 'string' || typeof userId !== 'string') {
    throw new Error('Invalid installation token');
  }
  return { installationId, userId };
}


