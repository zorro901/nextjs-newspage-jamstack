import {client} from '../../libs/client'
import Image from "next/image";
export default function NewsId({news}: any) {
    const ondemandRevalidate = async () => {
        await fetch('/api/revalidate').catch((error) => {
            console.error('error', error);
        });
    };
    return (
        <>
            <h1>{news.title}</h1>
            {/*<p>{news.publishedAt}</p>*/}

            <div
                dangerouslySetInnerHTML={{
                    __html: `${news.body}`,
                }}
            />
            <Image src={`${news.imageSrc}`}
                   width={300}
                   height={300}
            />

            {/*<p>`NewsID : ${news.id}`</p>*/}
            {/*<button onClick={ondemandRevalidate}>オンデマンドISR</button>*/}
        </>
    )
}

export const getStaticPaths = async () => {
    const data = await client.get({endpoint: "news"})
    const paths = data.contents.map((content: { id: any }) => `/news/${content.id}`)
    return {paths, fallback: false}
}

export const getStaticProps = async (context: any) => {
    const id = context.params.id
    const data = await client.get({endpoint: "news", contentId: id})
    return {
        props: {
            news: data
        },
        revalidate: 60,
    }
}