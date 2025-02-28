import Link from "next/link";

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-blue-500">Hello ChartTable!</h1>
      <div className="mt-5">
        <Link href="/dashboard" className="text-green-500 underline mr-4">
          Go to Dashboard
        </Link>
        <Link href="/upload" className="text-purple-500 underline">
          Go to Upload
        </Link>
      </div>
    </div>
  );
}
