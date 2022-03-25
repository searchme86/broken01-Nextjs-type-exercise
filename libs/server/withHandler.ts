import { NextApiRequest, NextApiResponse } from 'next';

export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}

interface ConfigType {
  method: 'GET' | 'POST' | 'DELETE';
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<any>;
  isPrivate?: boolean;
}

export default function withHandler({
  method,
  handler,
  isPrivate = true,
}: ConfigType) {
  return async function (
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<any> {
    if (req.method !== method) {
      return res.status(405).end();
    }
    if (isPrivate && !req.session?.user) {
      return res.status(401).json({
        ok: false,
        error: 'you need to login',
      });
    }
    try {
      await handler(req, res);
    } catch (error) {
      console.log('withHandler 함수에서 에러가 발생했습니다.', error);
      return res.status(500).json({ error });
    }
  };
}
