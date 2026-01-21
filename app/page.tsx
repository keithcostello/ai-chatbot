import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f4ed]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#1e3a3a] mb-4">SteerTrue</h1>
        <p className="text-[#1e3a3a] mb-8">Your AI-powered conversation partner</p>
        <div className="space-x-4">
          <Link
            href="/signup"
            className="inline-block px-6 py-3 bg-[#5d8a6b] text-[#f8f4ed] font-medium rounded-xl hover:bg-[#4a7559] transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="inline-block px-6 py-3 border border-[#5d8a6b] text-[#5d8a6b] font-medium rounded-xl hover:bg-[#5d8a6b] hover:text-[#f8f4ed] transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
