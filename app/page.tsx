import { Rajdhani } from "next/font/google";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const products = [
  {
    name: "Awrah Forge Shorts",
    label: "Flagship Product",
    price: "$44.99",
    description:
      "Modest-performance shorts engineered for training, running, swimming, and everyday movement.",
  },
  {
    name: "Forge Swim Shorts",
    label: "Coming Soon",
    price: "Coming Soon",
    description:
      "Quick-drying coverage designed for the pool, beach, and active travel.",
  },
  {
    name: "Performance Tee",
    label: "Coming Soon",
    price: "Coming Soon",
    description:
      "A breathable oversized training tee with a clean athletic silhouette.",
  },
];

const values = [
  ["Modest by Design", "Coverage is engineered into every product from the start."],
  ["Performance Driven", "Technical fabrics and construction support real movement."],
  ["Built for Discipline", "Every detail reflects consistency, growth, and purpose."],
  ["Committed to Excellence", "Quality, durability, and thoughtful design come first."],
];

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="square"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <main className={`${rajdhani.className} min-h-screen bg-[#080808] text-white`}>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#080808]/90 backdrop-blur-xl">
        <nav className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="#" className="flex items-center gap-3">
            <img
              src="/jihadforge-logo.png"
              alt="JihadForge"
              className="h-10 w-auto object-contain"
            />
            <div className="hidden sm:block">
              <p className="text-lg font-bold uppercase tracking-[0.16em]">
                JihadForge
              </p>
              <p className="text-[9px] uppercase tracking-[0.36em] text-white/35">
                Built with purpose
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-9 text-xs font-semibold uppercase tracking-[0.2em] text-white/55 md:flex">
            <a href="#shop" className="transition hover:text-white">Shop</a>
            <a href="#mission" className="transition hover:text-white">Mission</a>
            <a href="#about" className="transition hover:text-white">About</a>
          </div>

          <button className="border border-white/20 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] transition hover:bg-white hover:text-black">
            Cart / 0
          </button>
        </nav>
      </header>

      <section className="relative min-h-screen overflow-hidden border-b border-white/10 pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_42%,rgba(255,255,255,.12),transparent_28%),linear-gradient(135deg,#0b0b0b_0%,#111_45%,#050505_100%)]" />
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(rgba(255,255,255,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.25)_1px,transparent_1px)] [background-size:72px_72px]" />

        <div className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-[1400px] items-center gap-16 px-5 py-20 sm:px-8 lg:grid-cols-[1.08fr_.92fr] lg:px-12">
          <div>
            <div className="mb-7 flex items-center gap-4">
              <span className="h-px w-12 bg-white/55" />
              <p className="text-xs font-bold uppercase tracking-[0.38em] text-white/45">
                Halal performance wear
              </p>
            </div>

            <h1 className="max-w-4xl text-[clamp(4rem,9vw,8.8rem)] font-bold uppercase leading-[0.8] tracking-[-0.06em]">
              Performance
              <span className="block text-white/28">without</span>
              compromise.
            </h1>

            <p className="mt-9 max-w-xl text-lg leading-8 text-white/52">
              Premium modest athletic wear built for men who demand movement,
              coverage, and purpose in every environment.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="#shop"
                className="inline-flex items-center justify-center gap-3 bg-white px-7 py-4 text-sm font-bold uppercase tracking-[0.17em] text-black transition hover:bg-[#c8c8c8]"
              >
                Explore the collection <Arrow />
              </a>
              <a
                href="#mission"
                className="inline-flex items-center justify-center border border-white/22 px-7 py-4 text-sm font-bold uppercase tracking-[0.17em] transition hover:border-white hover:bg-white/5"
              >
                Our mission
              </a>
            </div>
          </div>

          <div className="relative flex min-h-[540px] items-center justify-center lg:min-h-[680px]">
            <div className="absolute h-[75%] w-[75%] rounded-full bg-white/[0.035] blur-3xl" />
            <div className="relative flex aspect-square w-full max-w-[620px] items-center justify-center border border-white/10 bg-[linear-gradient(145deg,#141414,#090909)]">
              <div className="absolute inset-5 border border-white/[0.06]" />
              <div className="absolute left-5 top-5 text-[10px] font-bold uppercase tracking-[0.3em] text-white/25">
                JF / 001
              </div>
              <div className="absolute bottom-5 right-5 text-[10px] font-bold uppercase tracking-[0.3em] text-white/25">
                Strength / Discipline / Growth
              </div>
              <img
                src="/jihadforge-logo.png"
                alt="JihadForge logo"
                className="relative z-10 w-[68%] object-contain drop-shadow-[0_28px_45px_rgba(0,0,0,.8)]"
              />
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10">
          <div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-x divide-white/10 px-5 sm:grid-cols-4 sm:px-8 lg:px-12">
            {["Modest by design", "Performance driven", "Built for discipline", "Focused on growth"].map((item) => (
              <div key={item} className="flex min-h-20 items-center px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.19em] text-white/45 first:pl-0">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="shop" className="border-b border-white/10">
        <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="mb-14 grid gap-8 lg:grid-cols-[1fr_.72fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.38em] text-white/32">
                The first collection
              </p>
              <h2 className="mt-4 text-5xl font-bold uppercase leading-none tracking-[-0.04em] sm:text-7xl">
                Built for
                <span className="block text-white/25">real movement.</span>
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-white/45 lg:justify-self-end">
              Clean silhouettes, technical materials, and modest coverage for
              training, swimming, travel, and everyday life.
            </p>
          </div>

          <div className="grid border-l border-t border-white/10 md:grid-cols-3">
            {products.map((product, index) => (
              <article key={product.name} className="group border-b border-r border-white/10 bg-[#0d0d0d]">
                <div className="relative aspect-[4/5] overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_50%_34%,#303030_0%,#151515_42%,#090909_76%)]">
                  <span className="absolute left-5 top-5 text-[10px] font-bold uppercase tracking-[0.28em] text-white/30">
                    0{index + 1}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative h-[62%] w-[54%] transition duration-500 group-hover:scale-[1.035]">
                      <div className="absolute inset-x-[8%] top-0 h-[16%] border border-white/15 bg-[#252525]" />
                      <div className="absolute bottom-0 left-0 h-[86%] w-[47%] skew-x-[-4deg] border border-white/10 bg-gradient-to-b from-[#242424] to-[#0d0d0d]" />
                      <div className="absolute bottom-0 right-0 h-[86%] w-[47%] skew-x-[4deg] border border-white/10 bg-gradient-to-b from-[#242424] to-[#0d0d0d]" />
                      <img
                        src="/jihadforge-logo.png"
                        alt=""
                        className="absolute bottom-[14%] left-[10%] z-10 w-12 opacity-75"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-7">
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/30">
                    {product.label}
                  </p>
                  <div className="mt-3 flex items-start justify-between gap-4">
                    <h3 className="text-2xl font-bold uppercase leading-none">
                      {product.name}
                    </h3>
                    <p className="shrink-0 font-semibold text-white/65">{product.price}</p>
                  </div>
                  <p className="mt-5 min-h-20 text-sm leading-6 text-white/42">
                    {product.description}
                  </p>
                  <button className="mt-5 flex w-full items-center justify-between border-t border-white/10 pt-5 text-xs font-bold uppercase tracking-[0.2em] text-white/58 transition group-hover:text-white">
                    View product <Arrow />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="mission" className="relative overflow-hidden bg-[#d0d0d0] text-black">
        <div className="absolute -right-16 -top-20 opacity-[0.035]">
          <img src="/jihadforge-logo.png" alt="" className="w-[760px]" />
        </div>
        <div className="relative mx-auto grid max-w-[1400px] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-12 lg:py-32">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-black/42">
              Our mission
            </p>
            <h2 className="mt-5 text-5xl font-bold uppercase leading-[0.9] tracking-[-0.045em] sm:text-7xl">
              Strength begins with discipline.
            </h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <p className="text-lg leading-8 text-black/65">
              JihadForge was founded on the belief that true strength begins with
  discipline. In Islam, the word <strong>Jihad</strong> includes the
  personal struggle to improve oneself to grow in character,
  perseverance, and purpose.
            </p>
            <p className="text-lg leading-8 text-black/65">
              Our mission is to create premium modest athletic wear that supports
  an active lifestyle while reflecting values of discipline,
  excellence, and respect. Whether you're training in the gym,
  running outdoors, or spending time with family at the beach, our
  goal is to design clothing that performs without compromising your
  principles.
            </p>
          </div>
        </div>
      </section>

      <section id="about" className="border-b border-white/10">
        <div className="mx-auto grid max-w-[1400px] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:px-12 lg:py-32">
          <div className="flex min-h-[500px] items-center justify-center border border-white/10 bg-[linear-gradient(145deg,#151515,#090909)] p-10">
            <img
              src="/jihadforge-logo.png"
              alt="JihadForge logo"
              className="w-[78%] max-w-[480px]"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-white/32">
              Why JihadForge
            </p>
            <h2 className="mt-5 text-5xl font-bold uppercase leading-[0.92] tracking-[-0.04em] sm:text-6xl">
              Modesty should not limit performance.
            </h2>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/45">
              JihadForge is being built to solve the gap between athletic
              performance and modest coverage through focused product design,
              technical fabrics, and premium construction.
            </p>

            <div className="mt-10 grid border-l border-t border-white/10 sm:grid-cols-2">
              {values.map(([title, description]) => (
                <article key={title} className="border-b border-r border-white/10 p-6">
                  <h3 className="text-xl font-bold uppercase tracking-[0.03em]">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/40">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white text-black">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[1.15fr_.85fr] lg:px-12 lg:py-28">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.38em] text-black/40">
              Join the launch
            </p>
            <h2 className="mt-4 max-w-4xl text-5xl font-bold uppercase leading-[0.9] tracking-[-0.045em] sm:text-7xl">
              Be first when the forge opens.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-black/54">
              Get launch announcements, product updates, and early access to
              the first JihadForge release.
            </p>
          </div>

          <form className="flex flex-col justify-center">
            <label htmlFor="email" className="text-xs font-bold uppercase tracking-[0.26em] text-black/40">
              Email address
            </label>
            <div className="mt-3 flex border-b-2 border-black">
              <input
                id="email"
                type="email"
                placeholder="YOU@EMAIL.COM"
                className="min-w-0 flex-1 bg-transparent py-4 text-lg font-semibold uppercase tracking-[0.08em] outline-none placeholder:text-black/22"
              />
              <button type="submit" className="flex items-center gap-3 px-3 text-xs font-bold uppercase tracking-[0.2em]">
                Join <Arrow />
              </button>
            </div>
          </form>
        </div>
      </section>

      <footer className="bg-black">
        <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-12">
          <div className="flex flex-col justify-between gap-10 border-b border-white/10 pb-10 sm:flex-row">
            <div className="flex items-center gap-4">
              <img src="/jihadforge-logo.png" alt="JihadForge" className="h-12 w-auto" />
              <div>
                <p className="text-2xl font-bold uppercase tracking-[0.15em]">JihadForge</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.32em] text-white/28">Built with purpose</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
              <a href="#shop" className="hover:text-white">Shop</a>
              <a href="#mission" className="hover:text-white">Mission</a>
              <a href="#about" className="hover:text-white">About</a>
              <a href="#" className="hover:text-white">Instagram</a>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-3 pt-6 text-[10px] uppercase tracking-[0.2em] text-white/22 sm:flex-row">
            <p>© 2026 JihadForge. All rights reserved.</p>
            <p>Modest performance wear / United States</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
