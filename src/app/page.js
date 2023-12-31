"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  console.log("session: ", session)


  const firstName = () => {
    if (session.user) {
      return session.user.fullName.split(" ")[0];
    }
    console.log(firstName());
  }


    const directToJoin = (e) => {
      e.preventDefault();
      router.push("/register");
    };

    return (
      <main className="flex min-h-screen w-full flex-col items-center bg-landing">
        <div className="min-h-screen w-full flex justify-center">
          <div className="self-center mt-20 lg:w-1/2 flex justify-end">
            <img
              src="/landingImage.png"
              className="hidden md:flex max-w-lg"
              alt="Faded landing Image of a bookshelf lined with books"
            />
          </div>
          <div className="self-center flex flex-col items-start lg:w-1/2">
            <div className="text-center w-full lg:w-2/3">
              <h1 className="text-5xl uppercase font-semibold tracking-widest text-slate-800 text-center mb-5">
                Shelf Help
              </h1>
              <h2 className="text-2xl text-slate-700 tracking-widest text-center mb-5 bg-white bg-opacity-25">
                Shelf improvement for people who love to read.
              </h2>

              {session && session.user ? (
                <div>
                  <h1 className="text-xl italic bg-blue-300 rounded-full text-white py-3 border-2">Welcome back, {firstName()}!</h1>
                </div>
              ) :
                (
                  <button
                    onClick={directToJoin}
                    className="bg-blue-400  bg-opacity-75 py-1.5 px-3 text-white font-light border-2 border-slate-600 rounded"
                  >
                    join now
                  </button>
                )
              }
            </div>
          </div>
        </div>
      </main>
    );
  }
