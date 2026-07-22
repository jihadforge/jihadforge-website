const products = [
  {
    name: "Modest Training Shorts",
    category: "Gym",
    description: "Lightweight athletic shorts designed for movement and coverage.",
    price: "$44",
  },
  {
    name: "Forge Swim Shorts",
    category: "Swim",
    description: "Quick-drying swimwear made for the beach, pool, and active days.",
    price: "$48",
  },
  {
    name: "Performance Oversized Tee",
    category: "Training",
    description: "A breathable, relaxed-fit shirt built for comfort and performance.",
    price: "$36",
  },
];

const features = [
  {
    title: "Modest Coverage",
    description:
      "Designed with coverage and confidence in mind, without sacrificing movement.",
  },
  {
    title: "Built to Perform",
    description:
      "Comfortable materials made for training, swimming, travel, and daily wear.",
  },
  {
    title: "Faith-Inspired",
    description:
      "Clothing rooted in discipline, character, purpose, and Islamic values.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-neutral-950">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="#" className="text-xl font-black tracking-tight sm:text-2xl">
            JIHADFORGE
          </a>

          <div className="hidden items-center gap-8 text-sm font-semibold md:flex">
            <a href="#shop" className="transition hover:text-black/50">
              Shop
            </a>
            <a href="#mission" className="transition hover:text-black/50">
              Our Mission
            </a>
            <a href="#about" className="transition hover:text-black/50">
              About
            </a>
          </div>

          <button className="rounded-full border border-black px-5 py-2.5 text-sm font-bold transition hover:bg-black hover:text-white">
            Cart (0)
          </button>
        </nav>
      </header>

      <section className="mx-auto grid min-h-[760px] max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-black/45">
            Halal performance wear
          </p>

          <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-8xl">
            Performance without compromise.
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-black/60">
            Athletic clothing designed for movement, comfort, and modest
            coverage—from the gym to the beach, pool, and everyday life.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#shop"
              className="bg-black px-7 py-4 text-center text-sm font-bold uppercase tracking-wider text-white transition hover:bg-black/80"
            >
              Shop the collection
            </a>

            <a
              href="#mission"
              className="border border-black px-7 py-4 text-center text-sm font-bold uppercase tracking-wider transition hover:bg-neutral-100"
            >
              Our mission
            </a>
          </div>
        </div>

        <div className="relative min-h-[560px] overflow-hidden bg-neutral-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-[430px] w-[300px] rounded-t-[120px] bg-neutral-950 shadow-2xl">
              <div className="absolute left-1/2 top-24 w-full -translate-x-1/2 text-center text-white">
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">
                  Halal athletic wear
                </p>
                <p className="mt-5 text-3xl font-black tracking-tight">
                  JIHADFORGE
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.25em] text-white/55">
                  Built with purpose
                </p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-6 bg-white px-5 py-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/45">
              Coming first
            </p>
            <p className="mt-1 font-black">Men&apos;s Modest Training Shorts</p>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-10 text-center sm:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title}>
              <h2 className="text-lg font-black">{feature.title}</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-black/55">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-black/40">
              The first collection
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              Built for movement.
            </h2>
          </div>

          <p className="max-w-md text-sm leading-6 text-black/55">
            The first JihadForge collection will focus on comfortable,
            modest-performance clothing for training, swimming, and everyday
            activity.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {products.map((product) => (
            <article key={product.name} className="group">
              <div className="flex aspect-[4/5] items-center justify-center overflow-hidden bg-neutral-100">
                <div className="flex h-64 w-48 items-center justify-center rounded-3xl bg-neutral-900 px-6 text-center text-white transition duration-300 group-hover:scale-105">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-white/45">
                      {product.category}
                    </p>
                    <p className="mt-4 text-xl font-black">JIHADFORGE</p>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-black">{product.name}</h3>
                  <p className="font-bold">{product.price}</p>
                </div>

                <p className="mt-3 text-sm leading-6 text-black/55">
                  {product.description}
                </p>

                <button className="mt-5 w-full border border-black px-5 py-3.5 text-sm font-bold uppercase tracking-wider transition hover:bg-black hover:text-white">
                  View product
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="mission" className="bg-neutral-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-white/40">
              Our mission
            </p>

            <h2 className="mt-5 max-w-xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Clothing that supports your values and your lifestyle.
            </h2>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-lg leading-8 text-white/65">
  JihadForge was founded on the belief that true strength begins with
  discipline. In Islam, the word <strong>Jihad</strong> includes the
  personal struggle to improve oneself to grow in character,
  perseverance, and purpose.
</p>

<p className="mt-6 text-lg leading-8 text-white/65">
  Our mission is to create premium modest athletic wear that supports
  an active lifestyle while reflecting values of discipline,
  excellence, and respect. Whether you're training in the gym,
  running outdoors, or spending time with family at the beach, our
  goal is to design clothing that performs without compromising your
  principles.
</p>

<p className="mt-6 text-lg leading-8 text-white/65">
  We believe modesty and performance belong together. Every product
  we create is designed with purpose, quality, and the pursuit of
  becoming better every day.
</p>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-14 lg:grid-cols-2">
          <div className="min-h-[420px] bg-neutral-100 p-10">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-black/40">
              Designed for
            </p>

            <div className="mt-24 space-y-4 text-4xl font-black tracking-tight sm:text-5xl">
              <p>The gym.</p>
              <p>The beach.</p>
              <p>The pool.</p>
              <p>Everyday life.</p>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-black/40">
              Why JihadForge?
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight">
              Modesty should not limit performance.
            </h2>

            <p className="mt-6 text-lg leading-8 text-black/60">
              Finding athletic clothing with the right length, fit, comfort,
              and coverage can be difficult. JihadForge is being built to solve
              that problem with thoughtful designs made specifically for active
              Muslim lifestyles.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="border border-black/10 p-5">
                <p className="font-black">Longer athletic cuts</p>
                <p className="mt-2 text-sm leading-6 text-black/55">
                  Designed to provide more coverage than standard short shorts.
                </p>
              </div>

              <div className="border border-black/10 p-5">
                <p className="font-black">Comfortable materials</p>
                <p className="mt-2 text-sm leading-6 text-black/55">
                  Breathable and flexible fabrics intended for active use.
                </p>
              </div>

              <div className="border border-black/10 p-5">
                <p className="font-black">Quick-drying options</p>
                <p className="mt-2 text-sm leading-6 text-black/55">
                  Suitable for swimming, beach activities, and warm weather.
                </p>
              </div>

              <div className="border border-black/10 p-5">
                <p className="font-black">Purpose-driven design</p>
                <p className="mt-2 text-sm leading-6 text-black/55">
                  Every product is shaped around function, modesty, and quality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-black/10 bg-neutral-100">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-black/40">
            Join the launch
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-tight">
            Be first to know when JihadForge drops.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-black/55">
            Get product updates, launch announcements, and early access to the
            first collection.
          </p>

          <form className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="min-w-0 flex-1 border border-black/15 bg-white px-5 py-4 outline-none focus:border-black"
            />
            <button
              type="submit"
              className="bg-black px-7 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-black/80"
            >
              Join the list
            </button>
          </form>
        </div>
      </section>

      <footer className="bg-black text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 py-12 sm:flex-row">
          <div>
            <p className="text-2xl font-black">JIHADFORGE</p>
            <p className="mt-3 text-sm text-white/50">
              Halal performance wear. Built with purpose.
            </p>
          </div>

          <div className="flex gap-6 text-sm font-semibold text-white/65">
            <a href="#shop" className="hover:text-white">
              Shop
            </a>
            <a href="#mission" className="hover:text-white">
              Mission
            </a>
            <a href="#about" className="hover:text-white">
              About
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 px-6 py-6 text-center text-xs text-white/40">
          © 2026 JihadForge. All rights reserved.
        </div>
      </footer>
    </main>
  );
}