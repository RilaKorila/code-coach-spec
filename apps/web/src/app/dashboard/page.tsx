import { getServerSession } from 'next-auth';
import Link from 'next/link';

import { authOptions } from '../../auth/options';
import { isDevAuthBypassEnabled } from '../../auth/devAuth';

export default async function DashboardPage() {
  if (isDevAuthBypassEnabled()) {
    return (
      <main>
        <h1>Dashboard (DEV)</h1>
        <p>DEV_AUTH_BYPASS が有効です。ログインなしで表示しています。</p>
        <p>MVP: metrics表示はUS1で実装します。</p>
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

  return (
    <main>
      <h1>Dashboard</h1>
      <p>MVP: metrics表示はUS1で実装します。</p>
    </main>
  );
}


