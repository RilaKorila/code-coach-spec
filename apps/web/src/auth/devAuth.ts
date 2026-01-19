export function isDevAuthBypassEnabled(): boolean {
    // Single source of truth:
    // - Client components can only access NEXT_PUBLIC_* at runtime.
    // - Server components can also read it, so we standardize on this name everywhere.
    return process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === '1';
}


