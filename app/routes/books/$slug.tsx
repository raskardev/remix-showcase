import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { zx } from "zodix";
import { HomeLink } from "../../components/HomeLink";
import { db } from "../../db.server";

export const loader = async ({ params }: LoaderArgs) => {
  const { slug } = zx.parseParams(
    params,
    {
      slug: z.string(),
    },
    {
      message: "Invalid slug",
    }
  );

  const book = await db.book.findUnique({
    where: {
      slug,
    },
  });

  return book;
};

export default function BookDetailPage() {
  const book = useLoaderData<typeof loader>();

  return book ? (
    <div>
      <h1>{book.title}</h1>
      <p>{book.description}</p>
      <p>
        <HomeLink />
      </p>
    </div>
  ) : (
    <div>
      <h1>Book not found</h1>
      <p>
        <HomeLink />
      </p>
    </div>
  );
}
