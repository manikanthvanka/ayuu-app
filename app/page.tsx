import { supabase } from "@/utils/supabase"

export default async function HomePage() {
  const { data, error } = await supabase.from('todos').select('*')
  console.log(data);
  if (error) {
    console.error(error)
    return <div>Error loading data</div>
  }

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Todos</h1>
      <ul>
        {data?.map(todo => (
          <li key={todo.id} className="mb-2">
            <span className="text-lg">{todo.created_at}</span>
          </li>
        ))}
        {data?.length == 0 && <li>No todos found</li>}
      </ul>
    </main>
  )
}
