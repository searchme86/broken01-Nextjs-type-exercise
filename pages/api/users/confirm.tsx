import { withApiSession } from './withSession';

import { NextApiRequest, NextApiResponse } from 'next';
import withHandler, { ResponseType } from '@libs/server/withHandler';
import client from '@libs/server/client';

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  //토큰 입력 페이지에서 입력한 값
  const { token } = req.body;
  //그 값이 token모델에 있는지를 확인한다
  //변수에는 입력한 값에 해당하는(where절) 유저의 정보가 들어가 있음
  const foundToken = await client.token.findUnique({
    where: {
      payload: token,
    },
  });
  if (!foundToken) return res.status(400).end;
  console.log('exists의 userId를 찾아라', foundToken);
  //session에 user라는 이름/user로 넣을 건데
  //그 user에는 객체가 들어간 형태이고
  //그 user는 id라는 키로 value가 exists의 userId 값이 된다.
  //id는 곧 그 유저의 아이디(userId)이다
  //아래내용 :위에서 찾은 foundToken을 보유한 유저의 id를 req.session.user에 넣는다.
  req.session.user = {
    id: foundToken.userId,
  };
  await req.session.save();
  console.log('foundToken', foundToken);
  //여기서 찾은 token의 userId와 같은 userId를 가진 token을 전부 삭제한다.
  //const foundToken = await client.token.findUnique({
  //  where: {
  //    payload: token,
  //  },
  //});

  await client.token.deleteMany({
    where: {
      userId: foundToken.userId,
    },
  });

  res.json({ ok: true });
}

//값을 POST하는 것임으로 withHandler 에 "POST"가 들어간다.
// export default withIronSessionApiRoute(withHandler('POST', handler), {
//   cookieName: 'carrotsession',
//   password:
//     '4324890241304324892sdfjdksfjkdsfjkdslfjksdfjkdslfjdksjkdlsjfkldfjkdsljfksjksaldcm0',
// });

export default withApiSession(
  withHandler({
    method: 'POST',
    handler,
    isPrivate: false,
  })
);
