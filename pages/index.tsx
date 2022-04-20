import Link from 'next/link'
import { client } from '../libs/client'

export default function Home({news}: any) {
  return (
    <>
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
// export default function Home({ blog }) {
//   return (
//     <div>
//       <ul>
//         {blog.map((blog) => (
//           <li key={blog.id}>
//             <Link href={`/blog/${blog.id}`}>
//               <a>{blog.title}</a>
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export async function getStaticProps() {
//   const currentTime = dayjs().tz();
//   const createdAt = currentTime.format(formatStyle);
//   const nextCreatedAt = currentTime.add(revalidate, 's').format(formatStyle);
//   const data = await client.get({endpoint: 'news'})
//   return {
//     props: {
//       news: data.contents,
//       createdAt,
//       nextCreatedAt,
//     },
//     revalidate: 60,
//   };
// }

export const getStaticProps = async () => {
  const data = await client.get({endpoint: 'news'})
  return {
    props: {
      news: data.contents
    },
    revalidate: 60,
  }
}