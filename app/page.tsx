export default function Page() {
  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <a className="rounded-xl border p-6 bg-white" href="/categories">Categorias</a>
        <a className="rounded-xl border p-6 bg-white" href="/products">Productos</a>
        <a className="rounded-xl border p-6 bg-white" href="/transactions">Transacciones</a>
      </div>
    </main>
  );
}