import { Link, useLoaderData } from "@remix-run/react";
import { db } from "../db.server";

export const loader = async () => {
  const books = await db.book.findMany({
    take: 10,
  });

  return books;
};

export default function Index() {
  const books = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Bookpedia!</h1>
      {books.length ? (
        <>
          <h3>Latest books added:</h3>
          <ul>
            {books.map((book) => (
              <li key={book.id}>
                <h5>
                  <Link to={`/books/${book.slug}`}>{book.title}</Link>
                </h5>
              </li>
            ))}
          </ul>
          <p>
            Not the one you're looking for?{" "}
            <Link to="/books">See all books</Link> or{" "}
            <Link to="/books/add">add a book</Link>.
          </p>
        </>
      ) : (
        <>
          <p>No books added yet.</p>
          <p>
            <Link to="/books/add">Add a book!</Link>
          </p>
        </>
      )}
    </div>
  );
}
