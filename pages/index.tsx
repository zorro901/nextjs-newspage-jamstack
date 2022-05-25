import Link from 'next/link'
import { client } from '../libs/client'

export default function Home({news}: any) {
  return (
    <>
      {/*<Image src={"https://storage.googleapis.com/afs-prod/media/448c0655aee54d1587b06761bc57a575/1000.jpeg"}*/}
      {/*       width={300}*/}
      {/*       height={300}*/}
      {/*       alt={"aaa"}*/}
      {/*/>*/}
      <ul>
        {news.map((data: any) =>
          <li key={data.id}>
            <Link href={`/news/${data.id}`}>
              <a>{data.title}</a>
            </Link>
          </li>
        )}
      </ul>
    </>
  )
}
export const getStaticProps = async () => {
  const data = await client.get({
    endpoint: 'news', queries: {
      offset: 0,
      limit: 45
    }
  })
  return {
    props: {
      news: data.contents
    },
    revalidate: 30
  }
}