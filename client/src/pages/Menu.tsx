import { ArrowUpRight, Check, ChevronDown, Coffee, Leaf, Wheat } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";

type MenuItem = { name: string; description: string; price: string; category: string; image: string; tag?: string };

const categories = ["All day", "Coffee", "Breakfast", "Lunch", "Sweet things"];
const items: MenuItem[] = [
  { name: "The Mercer", description: "Double espresso, steamed oat milk, brown sugar", price: "$6.50", category: "Coffee", image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1200&q=85", tag: "House favourite" },
  { name: "Rosemary latte", description: "Espresso, rosemary syrup, silky milk, orange zest", price: "$6.75", category: "Coffee", image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85" },
  { name: "Morning board", description: "Sourdough, cultured butter, jam, soft-boiled egg", price: "$14", category: "Breakfast", image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=85", tag: "Best seller" },
  { name: "Miso mushroom toast", description: "Wild mushrooms, miso butter, herbs, poached egg", price: "$16", category: "Breakfast", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=85" },
  { name: "Crispy chicken focaccia", description: "Buttermilk chicken, pickled cabbage, herb mayo", price: "$17", category: "Lunch", image: "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=1200&q=85", tag: "New" },
  { name: "Roasted tomato melt", description: "Aged cheddar, roasted tomato, basil, levain", price: "$15", category: "Lunch", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=85" },
  { name: "Cardamom morning bun", description: "Laminated pastry, cardamom sugar, sea salt", price: "$5.50", category: "Sweet things", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85", tag: "Baked today" },
  { name: "Olive oil cake", description: "Citrus, crème fraîche, pistachio crumb", price: "$8", category: "Sweet things", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85" },
];

export default function Menu() {
  const [active, setActive] = useState("All day");
  const visibleItems = useMemo(() => active === "All day" ? items : items.filter((item) => item.category === active), [active]);

  return (
    <main className="menu-page">
      <section className="menu-hero section-shell"><div className="menu-hero__top"><p className="eyebrow">The menu · served daily</p><span className="menu-hero__mark"><Coffee size={17} /> Est. 2016</span></div><h1>Something for<br /><em>every mood.</em></h1><p className="menu-hero__lede">From our first pour to the last sweet bite, everything is made for a slower kind of day.</p></section>
      <section className="menu-content section-shell">
        <div className="menu-toolbar"><div className="category-tabs" role="tablist" aria-label="Menu categories">{categories.map((category) => <button key={category} className={active === category ? "is-active" : ""} onClick={() => setActive(category)} role="tab" aria-selected={active === category}>{category}</button>)}</div><button className="dietary-button"><Leaf size={15} /> Dietary notes <ChevronDown size={14} /></button></div>
        <div className="menu-grid">{visibleItems.map((item) => <article className="menu-card" key={item.name}><div className="menu-card__image-wrap"><img className="menu-card__image" src={item.image} alt={item.name} loading="lazy" />{item.tag && <span className="menu-card__tag">{item.tag}</span>}</div><div className="menu-card__body"><div><p className="menu-card__category">{item.category}</p><h2>{item.name}</h2></div><span className="menu-card__price">{item.price}</span></div><p className="menu-card__description">{item.description}</p></article>)}</div>
        {visibleItems.length === 0 && <div className="menu-empty"><Wheat size={22} /><p>We’re dreaming up something for this corner.</p></div>}
      </section>
      <section className="menu-note"><div className="menu-note__inner"><Check size={20} /><p>Have an allergy or a special request? <a href="tel:+15550142765">Give us a call</a> — we’re happy to help.</p><Link href="/" className="text-link">Back to home <ArrowUpRight size={16} /></Link></div></section>
    </main>
  );
}
