import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const gallery = [
  {
    src: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1200&q=80",
    alt: "Sala de leitura da biblioteca",
  },
  {
    src: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80",
    alt: "Acervo de livros organizado em estantes",
  },
  {
    src: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80",
    alt: "Evento cultural da biblioteca",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-12 pt-24 sm:px-6 lg:px-8">
        <section className="space-y-5">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-400">Quem Somos</p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Uma biblioteca feita para facilitar a descoberta e o acesso ao conhecimento.</h1>
          <p className="max-w-3xl text-base leading-7 text-slate-600">
            A Biblioteca Aurora nasceu com a missão de conectar pessoas a histórias, pesquisa e tecnologia em um ambiente
            simples, acolhedor e digital. Nosso acervo reúne obras clássicas, contemporâneas e conteúdos técnicos para todas as idades.
          </p>
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div className="space-y-6">
            <div className="space-y-3 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-950">Nossa missão</h2>
              <p className="leading-7 text-slate-600">
                Democratizar o acesso à leitura, incentivar a formação contínua e manter um acervo organizado para empréstimos rápidos e confiáveis.
              </p>
            </div>

            <div className="space-y-3 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-semibold text-slate-950">Nossa história</h2>
              <p className="leading-7 text-slate-600">
                Começamos como uma pequena comunidade de leitura e evoluímos para uma plataforma digital com autenticação, catálogo filtrado e histórico de empréstimos.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:row-span-2">
              <img src={gallery[0].src} alt={gallery[0].alt} className="h-full min-h-72 w-full rounded-[2rem] object-cover shadow-sm" />
            </div>
            <img src={gallery[1].src} alt={gallery[1].alt} className="h-44 w-full rounded-[2rem] object-cover shadow-sm" />
            <img src={gallery[2].src} alt={gallery[2].alt} className="h-44 w-full rounded-[2rem] object-cover shadow-sm" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
