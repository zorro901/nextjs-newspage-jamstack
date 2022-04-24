import type {NextApiRequest, NextApiResponse} from 'next'
import {parse} from 'node-html-parser'
import axios from 'axios'

require('es6-promise').polyfill()
const originalFetch = require('isomorphic-fetch')
const fetch = require('fetch-retry')(originalFetch)

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
                console.log(link)
                const domain = 'https://apnews.com'
                const originalUrl = `${domain}${link}`

                const fetchData: string = await fetch(`https://apnews.com${link}`).then((e: { text: () => any; }) => e.text()).catch()
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
                let result = await fetch(`${process.env.TRANSLATE_URL}`, {
                    retries: 3,
                    retryDelay: 1000,
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                })
                    .then((response: { json: () => any; }) => response.json())
                    .catch((error: any) => console.log('error', error))

                sendBody.push({
                    'title': result['title'],
                    'body': result['body'].replaceAll(/^\n/gm, ''),
                    'imageSrc': imageSrc,
                    'originalUrl': originalUrl
                })
            }
        }
        return res.status(200)
    } catch (err) {
        // If there was an error, Next.js will continue
        // to show the last successfully generated page
        return res.status(500).send('Error revalidating')
    }
}

