import AdminTopbar from "@/components/admin/AdminTopbar";
import BlogTable from "@/components/blog/BlogTable";

export default function BlogPage() {
  return (
    <div>
      <AdminTopbar
        title="Blog"
        subtitle="Create, edit and manage blog posts"
        createHref="/admin/blog/new"
      />

      <div className="p-4 md:p-6">
        <BlogTable />
      </div>
    </div>
  );
}
