import { cookies } from 'next/headers';
import { readSessionToken, secretConfigured } from '@/lib/kp/secret';
import { storeConfigured } from '@/lib/kp/store';
import { listUsers } from '@/lib/kp/accounts';
import KpLogin from './KpLogin';
import KpApp from './KpApp';
import KpPrint from './KpPrint';

export const dynamic = 'force-dynamic';

// Вход решается на сервере, а не в браузере: страница с ценами и скидками
// не должна отрисоваться даже на мгновение до проверки.

export default async function KpPage({ searchParams }) {
  const params = await searchParams;

  const jar = await cookies();
  const claims = readSessionToken(jar.get('kp_session')?.value);
  const ready = secretConfigured() && storeConfigured();

  if (!claims) {
    let hasUsers = false;
    if (ready) {
      try {
        hasUsers = (await listUsers()).length > 0;
      } catch {
        hasUsers = false;
      }
    }
    return <KpLogin ready={ready} hasUsers={hasUsers} />;
  }

  // Режим печати: страницу открывает сервер в headless-браузере,
  // форма ему не нужна — только документ, без обвязки кабинета.
  if (params?.print === '1') return <KpPrint />;

  return (
    <KpApp
      user={{ id: claims.uid, login: claims.login, name: claims.name, role: claims.role }}
    />
  );
}
