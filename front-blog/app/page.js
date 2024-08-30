import Image from "next/image";
import Posts from "./posts/page";
import Header from "@/components/header";

export default function Home() {
  return (
    <>
      <Header/>
      <section className="h-full py-10">
       <div className="container mx-auto border border-[#27272c] flex flex-col p-12 bg-[#27272c] rounded-lg">
          <h2 className="text-3xl font-bold">Welcome to your blog</h2>
          <p className="text-lg text-white/60">The practice of strapi and Next Js</p>
       </div>
        <div className="container mx-auto h-full">
        <Posts/>
      </div>
    </section>
    </>
    
  );
}
