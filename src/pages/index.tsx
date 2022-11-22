import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { AppRouterTypes, ArrElement, trpc } from "../utils/trpc";
import Bookmark from "../components/bookmark";

type BookmarkType = ArrElement<AppRouterTypes["bookmark"]["list"]["output"]>;

type InputName = "title" | "url";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  const bookmarks = trpc.bookmark.list.useQuery();

  const createBookmark = trpc.bookmark.create.useMutation();
  const updateBookmark = trpc.bookmark.update.useMutation();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const handleChange =
    (field: InputName): React.ChangeEventHandler<HTMLInputElement> =>
    (e) => {
      const set = field === "title" ? setTitle : setUrl;

      set(e.currentTarget.value);
    };

  const handleSubmit: React.MouseEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();

    if (!title || !url) {
      return;
    }

    createBookmark.mutate(
      {
        title,
        url,
      },
      {
        onSuccess: () => {
          bookmarks.refetch();
        },
      }
    );

    setTitle("");
    setUrl("");
  };

  const handleFavorite = (
    bookmark: BookmarkType
  ): React.MouseEventHandler<SVGElement> => {
    return (event) => {
      event.preventDefault();

      updateBookmark.mutate(
        {
          ...bookmark,
          favorite: !bookmark.favorite,
        },
        {
          onSuccess: () => {
            bookmarks.refetch();
          },
        }
      );
    };
  };

  return (
    <>
      <Head>
        <title>Pocket T3</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container p-4 mx-auto min-h-screen text-gray-700">
        <header className="flex flex-row justify-between h-12">
          <h1 className="text-5xl font-extrabold">Pocket T3</h1>
          <Button handleClick={sessionData ? () => signOut() : () => signIn()}>
            {sessionData ? "Sign out" : "Sign in"}
          </Button>
        </header>
        <div className="flex justify-between pt-32 min-h-screen">
          <section className="flex flex-col w-1/2">
            <h2 className="pb-4 text-3xl">Bookmarks</h2>
            <div className="flex flex-wrap">
              {bookmarks.data &&
                bookmarks.data.map((bookmark, idx) => (
                  <Bookmark
                    key={bookmark.id}
                    bookmark={bookmark}
                    onFavorite={handleFavorite(bookmark)}
                    rowNum={idx}
                  />
                ))}
            </div>
          </section>
          <section className="pr-64 w-1/3">
            <form className="flex flex-col">
              <label htmlFor="title">Title:</label>
              <input
                className="border-2 border-slate-500"
                type="text"
                name="title"
                value={title}
                placeholder="Example Dot Com"
                required
                onChange={handleChange("title")}
              />
              <label htmlFor="url">URL:</label>
              <input
                className="border-2 border-slate-500"
                type="text"
                name="url"
                value={url}
                placeholder="https://example.com"
                required
                onChange={handleChange("url")}
              />
              <input type="submit" value="Create" onClick={handleSubmit} />
            </form>
          </section>
        </div>
      </main>
    </>
  );
};

interface ButtonProps {
  children: React.ReactNode;
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  handleClick,
  disabled = false,
}) => {
  return (
    <button
      className="py-2 px-4 text-xl bg-violet-50 rounded-md border border-black shadow-md hover:bg-violet-100"
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Home;
