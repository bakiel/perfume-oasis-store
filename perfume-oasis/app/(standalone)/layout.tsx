import { StoreHeader } from "@/components/store/header";
import { StoreFooter } from "@/components/store/footer";

export default function StandaloneLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <StoreHeader />
      <main className="flex-1">
        {children}
      </main>
      <StoreFooter />
    </>
  )
}