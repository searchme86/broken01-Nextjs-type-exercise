import { withApiSession } from './withSession';
import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  console.log('req.session.user from me.tsx', req.session.user);
  const profile = await client.user.findUnique({
    where: { id: req.session.user?.id },
  });
  res.json({
    ok: true,
    profile,
  });
}

//nextjs에서 me.tsx가 실행될때, export deafult가 실행되는데,
//export default withIronSessionApiRoute(withHandler('GET', handler), {....} 가 실행된다.
//POST한 내용을 보는 것 즉, 데이터를 GET해야 볼 수 있음으로 GET 한다.

// export default withIronSessionApiRoute(withHandler('GET', handler), {
//   cookieName: 'carrotsession',
//   password: process.env.COOKIE_PASSWORD!,
// });

export default withApiSession(withHandler({ method: 'GET', handler }));
