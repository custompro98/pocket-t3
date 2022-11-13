import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { type AppRouterTypes, trpc } from "../utils/trpc";
import { useState } from "react";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  const [title, setTitle] = useState<string | undefined>(undefined);
  const [url, setUrl] = useState<string | undefined>(undefined);

  const handleSubmit: React.MouseEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault();

    console.log("clicked!");
  };

  const bookmarks = trpc.bookmark.list.useQuery();

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
        <section className="flex flex-col pt-32 w-full min-h-screen">
          <h2 className="pb-4 text-3xl">Bookmarks</h2>
          {bookmarks.data &&
            bookmarks.data.map((bookmark, idx) => (
              <BookmarkRow key={bookmark.id} bookmark={bookmark} rowNum={idx} />
            ))}
          <form>
            <input
              className="border-2 border-slate-500"
              type="text"
              name="title"
              value={title}
            />
            <input
              className="border-2 border-slate-500"
              type="text"
              name="url"
              value={url}
            />
            <input type="submit" value="Create" onClick={handleSubmit} />
          </form>
        </section>
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

interface BookmarkCardProps {
  bookmark: AppRouterTypes["bookmark"]["create"]["output"];
  rowNum?: number;
}

const BookmarkRow: React.FC<BookmarkCardProps> = ({ bookmark, rowNum }) => {
  const bg = rowNum && rowNum % 2 ? "bg-slate-100" : "";

  return (
    <div
      className={`flex flex-row justify-between border-2 border-slate-500 p-4 align-middle ${bg} -mt-2 max-w-md`}
    >
      <div className="flex flex-col">
        <span className="text-lg">{bookmark.title}</span>
        <span className="text-sm">
          <em>{bookmark.url}</em>
        </span>
      </div>
      <div className="flex flex-col justify-center">
        <StarIcon favorite={bookmark.favorite} />
      </div>
    </div>
  );
};

interface StarIconProps {
  favorite?: boolean;
}

const StarIcon: React.FC<StarIconProps> = ({ favorite }) => {
  const fill = favorite ? "gold" : "none";
  const size = 24;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      stroke-width="1"
      stroke="currentColor"
      fill={fill}
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path>
    </svg>
  );
};

export default Home;
