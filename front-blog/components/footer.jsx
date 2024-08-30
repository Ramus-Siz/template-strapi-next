"use client";
import Link  from "next/link";

export default function Footer() {
    return (
        <footer className="bg-primary border-t-4 border-accent/10  bottom-0 container mx-auto p-6 z-50 mt-8">
            <Link href="/posts">
                <div className="">
                    <h1 className="text-3xl font-bold text-white">Strapi Blog</h1>
                    <p className="pl-8 text-white/60">With next js for frontend</p>
                </div>
            </Link>
        </footer>
    );
}