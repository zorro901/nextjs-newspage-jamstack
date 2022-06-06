import Link from 'next/link'
import { client } from '../../libs/client'

export default function Home({news}: any) {
  return (
    <>
      <div className={'container bg-gray-400 w-full'}>
        {news.map((data: any) =>
            <div key={data.id}>
              <Link href={`/forbes/${data.id}`}>
                {/*<div>*/}
                {/*  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">*/}
                {/*    {data.title}*/}
                {/*  </h5>*/}
                {/*  <p className="font-normal text-gray-700 dark:text-gray-400">{data.description}</p>*/}
                {/*</div>*/}

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

              </Link>


            </div>


          // <div key={data.id}>
          //   <Link href={`/news/${data.id}`}>
          //     <h3 className={"text-blue-500 font-bold"}>{data.title}</h3>
          //   </Link>
          // </div>
        )}
      </div>

      {/*<ul>*/}
      {/*  {news.map((data: any) =>*/}
      {/*    <li key={data.id}>*/}
      {/*      <Link href={`/news/${data.id}`}>*/}
      {/*        <a>{data.title}</a>*/}
      {/*      </Link>*/}
      {/*    </li>*/}
      {/*  )}*/}
      {/*</ul>*/}
    </>
  )
}
export const getStaticProps = async () => {
  const data = await client.get({
    endpoint: 'news',
    queries: {
      limit:100,
      filters: 'sourceName[equals]Forbes'
    }
  })
  return {
    props: {
      news: data.contents
    },
    revalidate: 30
  }
}