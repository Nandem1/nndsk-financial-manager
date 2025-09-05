import { Navbar } from '@/components/layout/navbar'
import { Sidebar } from '@/components/layout/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-200">
      <Navbar />
      {/* min-h-0 is important so that flex children can shrink and allow scrolling */}
      <div className="flex flex-col lg:flex-row min-h-0">
        <Sidebar />
        {/* Enable vertical scrolling for content area, especially on mobile */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-0">
          {children}
        </main>
      </div>
    </div>
  )
}
