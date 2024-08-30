export default function Header() {
    return (
        <header className="sticky top-0 container mx-auto p-6 bg-primary border-b-4 border-accent/10 z-50">
            <div className="">
                <h1 className="text-3xl font-bold text-white">Strapi Blog</h1>
                <p className="pl-8 text-white/60">With next js for frontend</p>
            </div>

        </header>
    );
}