import { CheckboxItems } from "@/components/item/checkbox.item";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
// import { SidebarTrigger } from "@/components/ui/sidebar";

const fakeTodos = [
  {
    "id": 1,
    "title": "買牛奶",
    "description": "去全聯買低脂牛奶",
    "is_completed": false,
    "project_id": null,
    "created_at": "2026-03-31T10:00:00Z",
    "updated_at": "2026-03-31T10:00:00Z"
  }
]

export default function TodoPage() {
  return (
    <>
      <header className="border-b p-4">
        <h1 className="text-3xl text-center font-semibold">Todo</h1>
      </header>
      <div className="p-6 mx-auto">
        <Button>+ Add New Todo</Button>
        <Separator />
        <Suspense fallback={<div>Loading...</div>}>
          <CheckboxItems />
        </Suspense>
      </div>
    </>
  );
}