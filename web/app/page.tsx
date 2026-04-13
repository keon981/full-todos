import { Suspense } from "react";

import { TodoItems } from "@/app/features/todos/TodoItems";
import { Separator } from "@/components/ui/separator";
import AddTodo from "./features/todos/AddTodo";
// import { SidebarTrigger } from "@/components/ui/sidebar";

export default function TodoPage() {
  return (
    <>
      <header className="border-b p-4">
        <h1 className="text-3xl text-center font-semibold">Todo</h1>
      </header>
      <div className="p-6 mx-auto">
        <AddTodo />
        <Separator />
        <Suspense fallback={<div>Loading...</div>}>
          <TodoItems />
        </Suspense>
      </div>
    </>
  );
}