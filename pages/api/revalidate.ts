// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  revalidated: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | string>
) {
  try {
    await res.unstable_revalidate('/');
    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating');
  }
  // try {
  //   // if (!isCollectSignature(req.headers['x-microcms-signature'], req.body)) {
  //   //   return res.status(401).send('Invalid token')
  //   // }
  //
  //   // const playerId = req.body.contents.new.publishValue.player.id
  //   // await res.unstable_revalidate(`/players/${playerId}`)
  //
  //   // return res.status(200).send()
  // } catch (err) {
  //   return res.status(500).send('Error revalidating')
  // }
}
