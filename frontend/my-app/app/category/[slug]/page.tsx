import { redirect } from "next/navigation"

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  // Redirect to categories page with the selected category as a URL parameter
  redirect(`/categories?category=${params.slug}`)
}
