import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();

  const bookmarks = trpc.bookmark.list.useQuery();

  return (
    <>
      <Head>
        <title>Pocket T3</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container p-4 mx-auto min-h-screen">
        <header className="flex flex-row justify-between h-12">
          <h1 className="text-5xl font-extrabold text-gray-700">Pocket T3</h1>
          <Button handleClick={sessionData ? () => signOut() : () => signIn()}>
            {sessionData ? "Sign out" : "Sign in"}
          </Button>
        </header>
        <section className="flex flex-row justify-center pt-6 w-full">
          <table>
            <thead>
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Tags</th>
              </tr>
            </thead>
            <tbody>
              {bookmarks.data?.map((bookmark) => (
                <tr key={bookmark.id}>
                  <td className="px-2">
                    <a href={bookmark.url} className="text-violet-700">
                      {bookmark.title}
                    </a>
                  </td>
                  <td className="flex flex-row justify-between px-2">
                    <span>Tag1</span>
                    <span>Tag2</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default Home;
