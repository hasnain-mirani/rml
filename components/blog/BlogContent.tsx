export default function BlogContent({ content }: { content: string }) {
  return (
    <div
      className="prose prose-invert mt-12 max-w-none
        prose-headings:font-semibold
        prose-p:text-white/80
        prose-a:text-white
        prose-strong:text-white"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
