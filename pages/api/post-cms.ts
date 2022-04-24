// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        await fetch(`https://${process.env.SERVICE_DOMAIN}.microcms.io/api/v1/news`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-MICROCMS-API-KEY': `${process.env.X_MICROCMS_API_KEY}`
            },
            body: req.body
        })
        res.end('ok')
    } catch (err) {
        // If there was an error, Next.js will continue
        // to show the last successfully generated page
        return res.status(500).send('Error revalidating')
    }
}
