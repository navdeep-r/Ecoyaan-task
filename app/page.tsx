import Link from "next/link";
import { Leaf, Truck, ShieldCheck, Award, ArrowRight, Star, Recycle, TreePine, Wind, Heart } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Bamboo Toothbrush (Pack of 4)",
    price: 299,
    badge: "Best Seller",
    rating: 4.8,
    reviews: 240,
    color: "from-green-50 to-emerald-50",
    emoji: "🪥",
  },
  {
    id: 2,
    name: "Reusable Cotton Produce Bags",
    price: 450,
    badge: "Eco Pick",
    rating: 4.9,
    reviews: 180,
    color: "from-teal-50 to-cyan-50",
    emoji: "🛍️",
  },
  {
    id: 3,
    name: "Stainless Steel Water Bottle",
    price: 649,
    badge: "New",
    rating: 4.7,
    reviews: 95,
    color: "from-blue-50 to-indigo-50",
    emoji: "🍶",
  },
];

const stats = [
  { value: "2.4M+", label: "Trees Planted", icon: <TreePine className="w-5 h-5" /> },
  { value: "50K+", label: "Happy Customers", icon: <Heart className="w-5 h-5" /> },
  { value: "120T", label: "CO₂ Offset", icon: <Wind className="w-5 h-5" /> },
  { value: "100%", label: "Eco Certified", icon: <Recycle className="w-5 h-5" /> },
];

export default function Home() {
  return (
    <div className="min-h-screen font-sans" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #f8fafc 50%, #eff6ff 100%)" }}>

      {/* ── Navbar ─────────────────────────────────────── */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-sm">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">Ecoyaan</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm font-semibold text-gray-600">
            <a href="#" className="hover:text-emerald-600 transition-colors">Shop</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Impact</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">About</a>
          </div>
          <Link
            href="/checkout"
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-bold px-5 py-2 rounded-xl shadow-sm hover:-translate-y-0.5 transition-all duration-200"
          >
            Shop Now
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-4 py-1.5 rounded-full mb-6 border border-emerald-200">
          <Leaf className="w-3.5 h-3.5" />
          100% Sustainable Products
        </div>

        <h1 className="text-5xl sm:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-6">
          Shop Green.<br />
          <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            Live Better.
          </span>
        </h1>

        <p className="max-w-xl mx-auto text-lg text-gray-500 font-medium mb-8 leading-relaxed">
          Premium eco-friendly products that are good for you, your family and our planet. Every purchase funds reforestation.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/checkout"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-emerald-200 hover:-translate-y-0.5 transition-all duration-200 text-base"
          >
            Start Shopping <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="#products"
            className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold py-4 px-8 rounded-2xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 text-base"
          >
            Browse Products
          </a>
        </div>

        {/* Social proof */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-400 font-medium">
          <div className="flex -space-x-2">
            {["🧑", "👩", "👨", "🧕"].map((e, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-sm">{e}</div>
            ))}
          </div>
          <span>Join <strong className="text-gray-600">50,000+</strong> eco-conscious shoppers</span>
        </div>
      </section>

      {/* ── Stats strip ────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 text-center border border-gray-100 shadow-sm">
              <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mx-auto mb-2">{s.icon}</div>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Products ───────────────────────────── */}
      <section id="products" className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Featured Products</h2>
            <p className="text-gray-400 font-medium mt-1 text-sm">Handpicked sustainably sourced items</p>
          </div>
          <Link href="/checkout" className="text-sm font-bold text-emerald-600 hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {products.map((p) => (
            <div key={p.id} className={`bg-gradient-to-b ${p.color} rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group`}>
              {/* Emoji placeholder */}
              <div className="w-full h-40 bg-white/70 rounded-2xl flex items-center justify-center text-6xl mb-5 border border-white">
                {p.emoji}
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-full px-2.5 py-0.5">
                  {p.badge}
                </span>
                <div className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {p.rating} ({p.reviews})
                </div>
              </div>

              <h3 className="font-bold text-gray-900 text-sm leading-snug mb-3 flex-1">{p.name}</h3>

              <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/60">
                <p className="text-xl font-black text-gray-900">₹{p.price}</p>
                <Link
                  href="/checkout"
                  className="bg-emerald-600 group-hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-1"
                >
                  Buy Now <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust Strip ────────────────────────────────── */}
      <section className="bg-white border-y border-gray-100 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { icon: <Truck className="w-5 h-5" />, label: "Free Shipping", sub: "On orders above ₹500" },
            { icon: <ShieldCheck className="w-5 h-5" />, label: "Secure Payment", sub: "256-bit SSL encrypted" },
            { icon: <Recycle className="w-5 h-5" />, label: "Eco Packaging", sub: "100% plastic free" },
            { icon: <Award className="w-5 h-5" />, label: "Certified Green", sub: "Verified eco standards" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">{item.icon}</div>
              <p className="font-bold text-sm text-gray-900">{item.label}</p>
              <p className="text-xs text-gray-400 font-medium">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-10 sm:p-14 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
          <div className="relative z-10">
            <div className="text-5xl mb-4">🌍</div>
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Every Purchase Counts</h2>
            <p className="text-emerald-100 font-medium mb-8 max-w-lg mx-auto">
              For every order placed, we plant a tree and offset your carbon footprint. Make your shopping matter.
            </p>
            <Link
              href="/checkout"
              className="inline-flex items-center gap-2 bg-white text-emerald-700 font-black py-4 px-8 rounded-2xl hover:bg-emerald-50 transition-all duration-200 hover:-translate-y-0.5 shadow-lg text-base"
            >
              Shop & Make Impact <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-gray-700">Ecoyaan</span>
          </div>
          <p className="text-xs text-gray-400 font-medium">© 2026 Ecoyaan. Built for a greener tomorrow.</p>
          <div className="flex gap-4 text-xs font-semibold text-gray-400">
            <a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
