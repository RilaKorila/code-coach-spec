'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function HomePage() {
    const { data, status } = useSession();

    if (status === 'loading') return <main>Loading...</main>;

    // Dev auth bypass mode:
    // - Use this for local development without Google OAuth configuration.
    // - It does NOT protect routes; it only simplifies local UI flow.
    if (process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === '1') {
        return (
            <main>
                <h1>Code Coach Dashboard (DEV)</h1>
                <p>DEV_AUTH_BYPASS が有効です。ログインなしで画面確認できます。</p>
                <ul>
                    <li>
                        <a href="/dashboard">Dashboard</a>
                    </li>
                    <li>
                        <a href="/pairing">Pairing</a>
                    </li>
                </ul>
            </main>
        );
    }

    if (!data?.user) {
        return (
            <main>
                <h1>Code Coach Dashboard</h1>
                <p>ログインしてください（Google）。</p>
                <button onClick={() => signIn('google')}>Sign in with Google</button>
            </main>
        );
    }

    return (
        <main>
            <h1>Code Coach Dashboard</h1>
            <p>Signed in as {data.user.email ?? data.user.name ?? 'user'}</p>
            <ul>
                <li>
                    <a href="/dashboard">Dashboard</a>
                </li>
                <li>
                    <a href="/pairing">Pairing</a>
                </li>
            </ul>
            <button onClick={() => signOut()}>Sign out</button>
        </main>
    );
}


