export default function SuccessPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
      <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-10 shadow-lg shadow-slate-900/5">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Success</p>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950">Payment completed</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Thank you for trying the DHLS demo checkout flow. Your Stripe session completed successfully.
        </p>
      </div>
    </main>
  );
}
