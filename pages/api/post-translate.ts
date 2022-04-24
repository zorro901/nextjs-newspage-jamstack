// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'

type Data = {
    revalidated: boolean;
};
require('es6-promise').polyfill()
const originalFetch = require('isomorphic-fetch')
const fetch = require('fetch-retry')(originalFetch)

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data | string>
) {
    try {
        const sendBody = []
        const myHeaders = new Headers()
        myHeaders.append('Content-Type', 'application/json')
        let result = await fetch(`${process.env.TRANSLATE_URL}`, {
            retries: 3,
            retryDelay: 3000,
            method: 'POST',
            headers: myHeaders,
            body: req.body,
            redirect: 'follow'
        })
            .then((response: { json: () => any; }) => response.json())
            .catch((error: any) => console.log('error', error))

        const requestJSON = JSON.parse(req.body)

        sendBody.push({
            'title': result['title'],
            'body': result['body'].replaceAll(/^\n/gm, ''),
            'imageSrc': requestJSON['imageSrc'],
            'originalUrl': requestJSON['originalUrl']
        })

        await fetch('http://localhost:3000/api/post-cms',
            {
                method: 'POST',
                body: JSON.stringify(sendBody[0])
            }
        )
        res.end('ok')
    } catch (err) {
        // If there was an error, Next.js will continue
        // to show the last successfully generated page
        return res.status(500).send('Error Translate')
    }
}


