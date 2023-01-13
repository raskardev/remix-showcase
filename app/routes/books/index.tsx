import type { LoaderArgs } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { zx } from "zodix";
import { HomeLink } from "../../components/HomeLink";
import { db } from "../../db.server";

export const loader = async ({ request }: LoaderArgs) => {
  const { search } = zx.parseQuery(request, {
    search: z.string().optional(),
  });

  const books = await db.book.findMany({
    where: {
      title: {
        contains: search,
      },
    },
  });

  return books;
};

export default function BooksPage() {
  const books = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Our books!</h1>
      <p>
        <HomeLink />
      </p>
      <Form>
        <label htmlFor="search">Search a book</label>
        <input type="text" name="search" />
        <p>
          <button type="submit">Search</button>
        </p>
      </Form>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <h5>
              <Link to={`/books/${book.slug}`}>{book.title}</Link>
            </h5>
          </li>
        ))}
      </ul>
    </div>
  );
}
