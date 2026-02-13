import AdminTopbar from "@/components/admin/AdminTopbar";
import EditBlogClient from "@/components/blog/EditBlogClient";

export default function EditBlogPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <AdminTopbar
        title="Edit Blog"
        subtitle="Update blog post"
      />
      <EditBlogClient id={params.id} />
    </div>
  );
}
