import { dbConnect } from "@/lib/mongodb";
import { Testimonial } from "@/models/Testimonal";
import EditTestimonialClient from "./EditTestimonialClient";

export const dynamic = "force-dynamic";

type Params = { id: string };

export default async function EditTestimonialPage({
  params,
}: {
  params: Params | Promise<Params>;
}) {
  const { id } = await params;

  await dbConnect();

  const item = await Testimonial.findById(id).lean();

  if (!item) {
    return <div className="p-10 text-zinc-600">Testimonial not found</div>;
  }

  return <EditTestimonialClient initial={{ ...(item as any), _id: String((item as any)._id) }} />;
}
