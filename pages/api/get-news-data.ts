import type {NextApiRequest, NextApiResponse} from 'next'
import {parse} from 'node-html-parser'
import axios from 'axios'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const instance = axios.create({
    baseURL: 'https://apnews.com',
    timeout: 5000
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {

        const fetchData: string = await instance.get('/').then(e => e.data).catch()
        const document = parse(fetchData)
        const links = await Promise.all(
            Array.from(document.querySelectorAll('[data-key="main-story"] a'), async v => v.rawAttributes.href)
        )
        // 重複削除
        let set = new Set(links)
        let setToArr = Array.from(set)

        const result: string[] = []
        for (const link of setToArr) {
            if (link.indexOf('/article/') !== -1 && !(link.indexOf('https://') !== -1)) {
                // console.log(link)
                const domain = 'https://apnews.com'
                const originalUrl = `${domain}${link}`

                const fetchData: string = await fetch(`https://apnews.com${link}`).then(e => e.text()).catch()
                const document = parse(fetchData)
                // 画像
                let imageOriginSrc = document.querySelector('meta[data-rh="true"][property="twitter:image"]')
                const imageSrc = imageOriginSrc?.rawAttributes.content.replace('3000.jpeg', '400.jpeg')

                // 本文
                const sendBody = []
                const textBody: string[] = []
                Array.from(document.querySelectorAll('[data-key="article"] p'), async v => textBody.push(v.textContent))
                let title = document.querySelector('[data-key="card-headline"] h1')?.textContent, RequestInit

                const myHeaders = new Headers()
                myHeaders.append('Content-Type', 'application/json')

                const raw = JSON.stringify({
                    'title': title,
                    'body': textBody.join('\n')
                })

                const requestOptions: RequestInit = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                }

                let result = await fetch(`${process.env.TRANSLATE_URL}`, requestOptions)
                    .then(response => response.json())
                    .catch(error => console.log('error', error))
                sendBody.push({
                    'title': result['title'],
                    'body': result['body'],
                    'imageSrc': imageSrc,
                    'originalUrl': originalUrl
                })
                await fetch(`https://${process.env.SERVICE_DOMAIN}.microcms.io/api/v1/news`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-MICROCMS-API-KEY': `${process.env.X_MICROCMS_API_KEY}`
                    },
                    body: JSON.stringify(sendBody[0])
                })

                return res.status(200).send(sendBody[0]['body'])
            }
        }


        return res.status(200).send(result.flat().toString())
        // return res.status(200).send("result.flat().toString()")
        // Regenerate our index route showing the images
        // await res.unstable_revalidate('/')
        // return res.json({revalidated: true})
    } catch (err) {
        // If there was an error, Next.js will continue
        // to show the last successfully generated page
        return res.status(500).send('Error revalidating')
    }
}
