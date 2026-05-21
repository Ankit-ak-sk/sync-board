export const authSessionKey = 'subscription-tracker-auth-session';

export function createDemoSession(email: string) {
  window.localStorage.setItem(
    authSessionKey,
    JSON.stringify({
      email,
      signedInAt: new Date().toISOString(),
    }),
  );
}

export function clearDemoSession() {
  window.localStorage.removeItem(authSessionKey);
}
