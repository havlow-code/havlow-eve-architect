"use client";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="max-w-xl w-full p-6 space-y-6">
        <h1 className="text-3xl font-bold">Havlow Eve Architect</h1>

        <p className="opacity-70">
          This is your app. This screen is controlled by
          <code className="mx-1 px-1 bg-white/10 rounded">
            src/app/page.tsx
          </code>
          .
        </p>

        <p className="opacity-70">
          If you can see this text, you are officially in control.
        </p>
      </div>
    </main>
  );
}
