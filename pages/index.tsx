import Link from 'next/link'
import { useRouter } from 'next/router'
import { client } from '../libs/client'


export default function Home({news}: any) {
  const router = useRouter()
  const {id} = router.query
  return (
    <>
      <span onClick={() => router.push('/apnews')}>Apnews</span>
      <span onClick={() => router.push('/forbes')}>Forbes</span>
      <span onClick={() => router.push('/reuters')}>Reuters</span>
      <div className={'container bg-gray-400 w-full h-full'}>
        {news.map((data: any) =>
            <div key={data.id}>
              <div onClick={() => router.push(`/news/${data.id}`)}>
                <div>
                  <div
                    className="flex flex-col items-center bg-white rounded-lg border shadow-md md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <img
                      className="object-cover w-full h-96 rounded-t-lg md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
                      src={data.imageSrc} alt=""/>
                    <div className="flex flex-col justify-between p-4 leading-normal">
                      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {data.title}
                      </h5>
                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{data.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
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