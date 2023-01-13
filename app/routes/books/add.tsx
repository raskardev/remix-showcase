import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { HomeLink } from "../../components/HomeLink";
import { db } from "../../db.server";
import { slugString } from "../../lib/utils";

export const action = async ({ request }: ActionArgs) => {
  const formData = Object.fromEntries(await request.formData());
  const formSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    authorId: z.string().min(1),
  });

  const formPayload = formSchema.parse(formData);

  await db.book.create({
    data: {
      title: formPayload.title,
      description: formPayload.description,
      slug: slugString(formPayload.title),
      author: {
        connect: {
          id: Number(formPayload.authorId),
        },
      },
    },
  });

  return redirect("/");
};

export const loader = async () => {
  const authors = await db.author.findMany();

  return authors;
};

export default function AddBookPage() {
  const authors = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Add a book</h1>
      <p>
        <HomeLink />
      </p>
      <Form method="post">
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" />
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" />
        <label htmlFor="authorId">Author</label>
        <select name="authorId">
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
        <p>
          Not the one you're searching for?{" "}
          <Link to="/authors/add">Add it!</Link>
        </p>
        <button type="submit">Add book</button>
      </Form>
    </div>
  );
}
