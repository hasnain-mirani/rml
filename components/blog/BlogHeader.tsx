type Blog = {
  title: string;
  excerpt: string;
};

export default function BlogHeader({ blog }: { blog: Blog }) {
  return (
    <header className="space-y-4">
      <h1 className="text-4xl font-semibold leading-tight text-white">
        {blog.title}
      </h1>
      <p className="text-lg text-white/60">
        {blog.excerpt}
      </p>
    </header>
  );
}
