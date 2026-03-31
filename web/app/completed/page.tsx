import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function CompletedPage() {
  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-lg font-semibold">已完成</h1>
      </header>
      <div className="flex-1 p-6">
        <p className="text-sm text-muted-foreground">
          串接 API 後，任務會顯示在這裡
        </p>
      </div>
    </>
  )
}
