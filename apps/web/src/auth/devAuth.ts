export function isDevAuthBypassEnabled(): boolean {
  return process.env.DEV_AUTH_BYPASS === '1';
}


