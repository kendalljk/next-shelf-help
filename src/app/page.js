'use client'
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    const directToSearch = (e) => {
        e.preventDefault();
        router.push(`/search`);
    };

    return (
        <main className="flex min-h-screen w-full flex-col items-center bg-landing">
            <div className="min-h-screen w-full flex justify-center gap-10">
                <div className="self-end">
                    <img src="/landingImage.png" className="" />
                </div>
                <div className="self-center flex flex-col items-center">
                    <h1 className="text-5xl uppercase font-semibold tracking-widest text-slate-800 w-2/3 text-center mb-5">
                        Shelf Help
                    </h1>
                    <h2 className="text-2xl text-slate-700 tracking-widest w-2/3 text-center mb-5 bg-white bg-opacity-25">
                        {`What you've read, what you want to read, all in one place.`}
                    </h2>
                    <button
                        onClick={directToSearch}
                        className="bg-blue-400  bg-opacity-75 py-1.5 px-3 text-white font-light border-2 border-slate-600 rounded"
                    >
                        search books
                    </button>
                </div>
            </div>
        </main>
    );
}
