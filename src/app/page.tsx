import { PromptGrid } from "@/components/prompt-grid"
import { OrganizationSchema, WebsiteSchema } from "@/components/json-ld-schema"

export default function HomePage() {
  return (
    <>
      <OrganizationSchema />
      <WebsiteSchema />
      <main className="flex-1 p-8 pt-4">
        <PromptGrid />
      </main>
    </>
  )
}
