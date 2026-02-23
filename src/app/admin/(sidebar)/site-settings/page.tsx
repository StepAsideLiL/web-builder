import { db } from "@/lib/db";
import { pagesTable } from "@/lib/db/schema";
import SelectHomePage from "./_comps/select-home-page";

export default async function Page() {
  const pages = await db.select().from(pagesTable).all();

  return (
    <main className="mx-auto w-full max-w-7xl space-y-5 py-10">
      <section className="space-y-2">
        <h1>Home Page</h1>
        <SelectHomePage pages={pages} />
      </section>
    </main>
  );
}
