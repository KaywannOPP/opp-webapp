import { createClient } from "@/utils/supabase/server";

export default async function Instruments() {
  const supabase = await createClient();
  const { data: instruments } = await supabase.from("instruments").select();

  return <pre>{JSON.stringify(instruments, null, 2)}</pre>;
}
//This is an exaple for how we get data in supabase.
// This says - Give me all rows from the table named instruments
// Data - Contains rows
// Returns the result as JSON
