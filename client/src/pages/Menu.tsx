import { ArrowUpRight, Check, ChevronDown, Coffee, Leaf, Wheat } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { fallbackCategories, fallbackItems, formatPrice, loadPublicMenu, type MenuCategory, type MenuItem } from "@/lib/menu";

export default function Menu() {
  const [active, setActive] = useState("all-day");
  const [categories, setCategories] = useState<MenuCategory[]>(fallbackCategories);
  const [items, setItems] = useState<MenuItem[]>(fallbackItems);

  useEffect(() => {
    let mounted = true;
    void loadPublicMenu().then((data) => {
      if (!mounted) return;
      setCategories(data.categories);
      setItems(data.items);
    });
    return () => { mounted = false; };
  }, []);

  const visibleItems = useMemo(() => active === "all-day" ? items : items.filter((item) => item.category_slug === active), [active, items]);

  return (
    <main className="menu-page">
      <section className="menu-hero section-shell"><div className="menu-hero__top"><p className="eyebrow">Indian cafe menu · served daily</p><span className="menu-hero__mark"><Coffee size={17} /> Est. 2016</span></div><h1>Good food,<br /><em>Indian soul.</em></h1><p className="menu-hero__lede">Chai, coffee, small plates, and comforting Indian favourites — freshly made for slow mornings and easy catch-ups.</p></section>
      <section className="menu-content section-shell">
        <div className="menu-toolbar"><div className="category-tabs" role="tablist" aria-label="Menu categories">{categories.map((category) => <button key={category.slug} className={active === category.slug ? "is-active" : ""} onClick={() => setActive(category.slug)} role="tab" aria-selected={active === category.slug}>{category.name}</button>)}</div><button className="dietary-button"><Leaf size={15} /> Dietary notes <ChevronDown size={14} /></button></div>
        <div className="menu-grid">{visibleItems.map((item) => <article className="menu-card" key={item.id ?? item.name}><div className="menu-card__body"><div><p className="menu-card__category">{item.category}</p><h2>{item.name}</h2></div><span className="menu-card__price">{formatPrice(item.price)}</span></div><p className="menu-card__description">{item.description}</p>{item.tag && <span className="menu-card__tag">{item.tag}</span>}</article>)}</div>
        {visibleItems.length === 0 && <div className="menu-empty"><Wheat size={22} /><p>We’re dreaming up something for this corner.</p></div>}
      </section>
      <section className="menu-note"><div className="menu-note__inner"><Check size={20} /><p>Have an allergy or a special request? <a href="tel:+15550142765">Give us a call</a> — we’re happy to help.</p><Link href="/" className="text-link">Back to home <ArrowUpRight size={16} /></Link></div></section>
    </main>
  );
}
