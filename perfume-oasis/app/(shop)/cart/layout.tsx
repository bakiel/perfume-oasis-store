import { ErrorBoundary } from "@/components/error-boundary"

export default function CartLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ErrorBoundary>{children}</ErrorBoundary>
}