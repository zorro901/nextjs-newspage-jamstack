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
                const domain = 'https://apnews.com'
                const originalUrl = `${domain}${link}`

                const fetchData: string = await fetch(`https://apnews.com${link}`).then((e: { text: () => any; }) => e.text()).catch()
                const document = parse(fetchData)
                // 画像
                let imageOriginSrc = document.querySelector('meta[data-rh="true"][property="twitter:image"]')
                const imageSrc = imageOriginSrc?.rawAttributes.content.replace('3000.jpeg', '400.jpeg')

                // 本文
                const textBody: string[] = []
                Array.from(document.querySelectorAll('[data-key="article"] p'), async v => textBody.push(v.textContent))
                let title = document.querySelector('[data-key="card-headline"] h1')?.textContent, RequestInit

                const raw = JSON.stringify({
                    'title': title,
                    'body': textBody.join('\n'),
                    'imageSrc': imageSrc,
                    'originalUrl': originalUrl
                })
                await fetch('http://localhost:3000/api/post-translate',
                    {
                        method: 'POST',
                        body: raw,
                    }
                )
            }
        }
        res.status(200)
        res.end('ok')
    } catch (err) {
        // If there was an error, Next.js will continue
        // to show the last successfully generated page
        res.status(500).send('Error revalidating')
    }
}

