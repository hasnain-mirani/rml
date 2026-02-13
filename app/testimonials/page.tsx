import { fetchTestimonials } from "@/lib/fetchTestimonials";
import TestimonialsSection from "@/components/testimonals/TestimonalsSection";

export default async function TestimonialsPage() {
  const items = await fetchTestimonials({ publishedOnly: true });

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <TestimonialsSection items={items} />
    </main>
  );
}
