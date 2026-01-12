import { getServerSession } from 'next-auth';
import Link from 'next/link';

import { authOptions } from '../../auth/options';
import { isDevAuthBypassEnabled } from '../../auth/devAuth';
import { createPairingCode } from '../../lib/apiClient';

export default async function PairingPage() {
    const userId = 'dev-user';

    if (isDevAuthBypassEnabled()) {
        const code = await createPairingCode({ userId });
        return (
            <main>
                <h1>Pairing (DEV)</h1>
                <p>DEV_AUTH_BYPASS が有効です。ログインなしで表示しています。</p>
                <p>このコードを VSCode 拡張に貼り付けてください。</p>
                <pre>{code.code}</pre>
                <p>expiresAt: {code.expiresAt}</p>
            </main>
        );
    }

    const session = await getServerSession(authOptions);
    if (!session) {
        return (
            <main>
                <p>Not signed in.</p>
                <Link href="/">Go to sign in</Link>
            </main>
        );
    }

    const userIdFromSession = session.user?.email ?? 'dev-user';
    const code = await createPairingCode({ userId: userIdFromSession });

    return (
        <main>
            <h1>Pairing</h1>
            <p>このコードを VSCode 拡張に貼り付けてください。</p>
            <pre>{code.code}</pre>
            <p>expiresAt: {code.expiresAt}</p>
        </main>
    );
}


