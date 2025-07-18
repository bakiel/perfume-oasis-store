import { StoreHeader } from "@/components/store/header";
import { StoreFooter } from "@/components/store/footer";
import { BottomNav } from "@/components/mobile/bottom-nav";
import { MobileStoryAd } from "@/components/shop/mobile-story-ad";

export default function ShopLayout({
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
      <div className="h-20 lg:hidden" /> {/* Spacer for bottom nav on mobile only */}
      <BottomNav />
      <MobileStoryAd />
    </>
  )
}