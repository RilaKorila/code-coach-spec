import type { ReactNode } from 'react';

import { Providers } from './providers';

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Providers>{props.children}</Providers>
      </body>
    </html>
  );
}


