import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './button'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  const searchParams = useSearchParams()
  
  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    return `${baseUrl}?${params.toString()}`
  }
  
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showPages = 5
    
    if (totalPages <= showPages + 2) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show first page
      pages.push(1)
      
      if (currentPage > 3) {
        pages.push('...')
      }
      
      // Show pages around current
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...')
      }
      
      // Show last page
      pages.push(totalPages)
    }
    
    return pages
  }
  
  const pages = getPageNumbers()
  
  return (
    <nav className="flex items-center justify-center space-x-2">
      {currentPage > 1 ? (
        <Link href={getPageUrl(currentPage - 1)}>
          <Button
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
        </Link>
      ) : (
        <Button
          variant="outline"
          size="sm"
          disabled
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
      )}
      
      <div className="flex items-center space-x-1">
        {pages.map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="px-3 py-1">...</span>
            ) : page === currentPage ? (
              <Button
                variant="default"
                size="sm"
                disabled
              >
                {page}
              </Button>
            ) : (
              <Link href={getPageUrl(page as number)}>
                <Button
                  variant="ghost"
                  size="sm"
                >
                  {page}
                </Button>
              </Link>
            )}
          </div>
        ))}
      </div>
      
      {currentPage < totalPages ? (
        <Link href={getPageUrl(currentPage + 1)}>
          <Button
            variant="outline"
            size="sm"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      ) : (
        <Button
          variant="outline"
          size="sm"
          disabled
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </nav>
  )
}