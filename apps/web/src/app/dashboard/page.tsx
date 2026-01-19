import { getServerSession } from 'next-auth';
import Link from 'next/link';

import { authOptions } from '../../auth/options';
import { isDevAuthBypassEnabled } from '../../auth/devAuth';
import { getMetrics } from '../../lib/apiClient';

export default async function DashboardPage() {
    const userId = 'dev-user';

    if (isDevAuthBypassEnabled()) {
        const metrics = await getMetrics({ userId, range: '7d' });
        return (
            <main>
                <h1>Dashboard (DEV)</h1>
                <p>DEV_AUTH_BYPASS が有効です。ログインなしで表示しています。</p>
                <h2>Last 7 days</h2>
                {metrics.points.length === 0 ? (
                    <p>まだデータがありません。</p>
                ) : (
                    <ul>
                        {metrics.points.map((p) => (
                            <li key={`${p.date}-${p.eventType}-${p.questionCategory}-${p.selfCheck}`}>
                                {p.date} / {p.eventType} / {p.questionCategory} / {p.selfCheck}: {p.count}
                            </li>
                        ))}
                    </ul>
                )}
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
    const metrics = await getMetrics({ userId: userIdFromSession, range: '7d' });

    return (
        <main>
            <h1>Dashboard</h1>
            <h2>Last 7 days</h2>
            {metrics.points.length === 0 ? (
                <p>まだデータがありません。</p>
            ) : (
                <ul>
                    {metrics.points.map((p) => (
                        <li key={`${p.date}-${p.eventType}-${p.questionCategory}-${p.selfCheck}`}>
                            {p.date} / {p.eventType} / {p.questionCategory} / {p.selfCheck}: {p.count}
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}


