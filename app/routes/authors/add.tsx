import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";
import { z } from "zod";
import { db } from "../../db.server";
import { slugString } from "../../lib/utils";

export const action = async ({ request }: ActionArgs) => {
  const formData = Object.fromEntries(await request.formData());
  const formSchema = z.object({
    name: z.string().min(1),
  });

  const formPayload = formSchema.parse(formData);

  await db.author.create({
    data: {
      name: formPayload.name,
      slug: slugString(formPayload.name),
    },
  });

  return redirect("/books/add");
};

export default function AddAuthorPage() {
  return (
    <div>
      <h1>Add an author</h1>
      <p>
        <Link to="/books/add">Go back</Link>
      </p>
      <Form method="post">
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" />
        <p />
        <button type="submit">Add author</button>
      </Form>
    </div>
  );
}
