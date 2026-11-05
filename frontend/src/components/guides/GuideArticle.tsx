import { parseGuideBody } from "@/lib";

type GuideArticleProps = {
  body: string;
};

const GuideArticle = ({ body }: GuideArticleProps) => {
  return (
    <article className="mx-auto mt-8 max-w-3xl">
      {parseGuideBody(body).map((block, index) =>
        block.type === "heading" ? (
          <h2 key={block.text} className="mt-8 mb-2 text-xl font-bold">
            {block.text}
          </h2>
        ) : (
          <p key={index} className="mt-3 leading-relaxed text-ink-soft first:mt-0 first:text-lg first:text-ink">
            {block.text}
          </p>
        ),
      )}
    </article>
  );
};

export default GuideArticle;
