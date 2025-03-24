import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center h-screen fixed top-0 left-0 right-0 z-[51]"
      style={{ backgroundColor: "#FFFFFF" }} // Using backgroundColor from your config
    >
      {/* Title */}
      <h1 className="text-9xl font-bold text-btnColor mb-4">404</h1>

      {/* Subtitle */}
      <h2 className="text-4xl font-semibold text-textColor mb-8">
        Page Not Found
      </h2>

      {/* Description */}
      <p className="text-lg text-textColor mb-8 text-center max-w-md">
        Oops! The page you&apos;re looking for doesn&apos;t exist or has been
        moved. Don&apos;t worry, let&apos;s get you back on track.
      </p>

      {/* Back to Home Button */}
      <Link
        href="/dashboard"
        className="px-6 py-3 bg-btnColor text-white font-semibold rounded-lg hover:bg-btnHoverColor transition-colors duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
}
