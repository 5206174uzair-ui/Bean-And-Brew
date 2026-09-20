import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, ChevronRight, CircleHelp, Coffee, ExternalLink, LayoutDashboard, LogOut, Menu as MenuIcon, Plus, Settings2, ShieldCheck, Trash2, X } from "lucide-react";
import { Link } from "wouter";
import { type MenuCategory, type MenuItem, formatPrice, loadAdminMenu } from "@/lib/menu";
import { hasSupabaseConfig, supabase } from "@/lib/supabase";

type FormState = { id?: string; category_id: string; name: string; description: string; price: string; image_url: string; tag: string; is_available: boolean; is_featured: boolean };
const emptyForm: FormState = { category_id: "", name: "", description: "", price: "", image_url: "", tag: "", is_available: true, is_featured: false };

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError("");
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) setError(loginError.message);
    setBusy(false);
  }

  return <main className="admin-auth"><div className="admin-auth__card"><Link href="/" className="admin-auth__brand"><span className="brand__mark"><Coffee size={17} /></span><span>Bean &amp; Brew <small>Admin</small></span></Link><p className="admin-kicker">Private workspace</p><h1>Welcome<br /><em>back.</em></h1><p className="admin-auth__intro">Sign in to keep the menu fresh, the details current, and the good things moving.</p><form onSubmit={handleSubmit} className="admin-form"><label>Email address<input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@beanandbrew.com" /></label><label>Password<input type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" /></label>{error && <p className="admin-error">{error}</p>}<button className="admin-button admin-button--primary" disabled={busy}>{busy ? "Signing in…" : "Sign in to dashboard"}<ChevronRight size={17} /></button></form><p className="admin-auth__foot"><ShieldCheck size={15} /> Admin access is controlled through Supabase Auth.</p></div><div className="admin-auth__aside"><div className="admin-auth__quote"><span>“</span><p>A menu is a small<br /><em>promise</em> about the day.</p><small>Bean &amp; Brew · Internal tools</small></div></div></main>;
}

function AccessPending({ email, onSignOut }: { email?: string; onSignOut: () => void }) {
  return <main className="admin-auth"><div className="admin-auth__card"><Link href="/" className="admin-auth__brand"><span className="brand__mark"><Coffee size={17} /></span><span>Bean &amp; Brew <small>Admin</small></span></Link><p className="admin-kicker">Access review</p><h1>You’re in.<br /><em>Almost.</em></h1><p className="admin-auth__intro">{email ? `${email} is signed in, but it has not been approved as an admin yet.` : "This account has not been approved as an admin yet."}</p><div className="admin-help"><CircleHelp size={18} /><p>Ask the project owner to add your user ID to the <code>admin_profiles</code> table in Supabase.</p></div><button className="admin-button admin-button--secondary" onClick={onSignOut}><LogOut size={16} /> Sign out</button></div><div className="admin-auth__aside"><div className="admin-auth__quote"><span>“</span><p>Good things take<br /><em>some care.</em></p><small>Bean &amp; Brew · Internal tools</small></div></div></main>;
}

function AdminDashboard({ email, onSignOut }: { email?: string; onSignOut: () => void }) {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [form, setForm] = useState<FormState | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const data = await loadAdminMenu();
      setCategories(data.categories);
      setItems(data.items);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load menu data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void refresh(); }, []);

  const filteredItems = useMemo(() => activeCategory === "all" ? items : items.filter((item) => item.category_id === activeCategory), [activeCategory, items]);

  function showNotice(message: string) { setNotice(message); window.setTimeout(() => setNotice(""), 2600); }
  function startNewItem() { setError(""); setForm({ ...emptyForm, category_id: categories[0]?.id ?? "" }); }
  function startEdit(item: MenuItem) { setError(""); setForm({ id: item.id, category_id: item.category_id ?? categories[0]?.id ?? "", name: item.name, description: item.description, price: String(item.price), image_url: item.image_url, tag: item.tag ?? "", is_available: item.is_available !== false, is_featured: Boolean(item.is_featured) }); }

  async function saveItem(event: React.FormEvent) {
    event.preventDefault();
    if (!supabase || !form) return;
    if (!form.category_id || !form.name.trim() || !form.price) { setError("Add a name, category, and price before saving."); return; }
    setError("");
    const payload = { category_id: form.category_id, name: form.name.trim(), description: form.description.trim(), price: Number(form.price), image_url: form.image_url.trim() || null, tag: form.tag.trim() || null, is_available: form.is_available, is_featured: form.is_featured, sort_order: form.id ? (items.find((item) => item.id === form.id)?.sort_order ?? 0) : items.length };
    const result = form.id ? await supabase.from("menu_items").update(payload).eq("id", form.id) : await supabase.from("menu_items").insert(payload);
    if (result.error) { setError(result.error.message); return; }
    setForm(null); await refresh(); showNotice(form.id ? "Menu item updated" : "Menu item added");
  }

  async function toggleAvailability(item: MenuItem) {
    if (!supabase || !item.id) return;
    const { error: updateError } = await supabase.from("menu_items").update({ is_available: !item.is_available }).eq("id", item.id);
    if (updateError) { setError(updateError.message); return; }
    setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, is_available: !item.is_available } : entry));
    showNotice(!item.is_available ? `${item.name} is live` : `${item.name} is hidden`);
  }

  async function removeItem(item: MenuItem) {
    if (!supabase || !item.id || !window.confirm(`Remove ${item.name} from the menu?`)) return;
    const { error: deleteError } = await supabase.from("menu_items").delete().eq("id", item.id);
    if (deleteError) { setError(deleteError.message); return; }
    setItems((current) => current.filter((entry) => entry.id !== item.id));
    showNotice("Menu item removed");
  }

  async function addCategory(event: React.FormEvent) {
    event.preventDefault();
    if (!supabase || !categoryName.trim()) return;
    const slug = categoryName.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const { error: insertError } = await supabase.from("menu_categories").insert({ name: categoryName.trim(), slug, sort_order: categories.length });
    if (insertError) { setError(insertError.message); return; }
    setCategoryName(""); await refresh(); showNotice("Category added");
  }

  async function removeCategory(category: MenuCategory) {
    if (!supabase || !category.id || !window.confirm(`Delete ${category.name}? Items in this category will also be removed.`)) return;
    const { error: deleteError } = await supabase.from("menu_categories").delete().eq("id", category.id);
    if (deleteError) { setError(deleteError.message); return; }
    await refresh(); showNotice("Category removed");
  }

  return <main className="admin-shell"><aside className="admin-sidebar"><div className="admin-sidebar__brand"><span className="brand__mark"><Coffee size={16} /></span><span>Bean &amp; Brew<small>Admin</small></span></div><div className="admin-sidebar__workspace"><span>Workspace</span><strong>Mercer Lane</strong><small>Live menu</small></div><nav className="admin-nav"><a className="is-active" href="#menu"><LayoutDashboard size={16} /> Menu <span>{items.length}</span></a><a href="#categories"><MenuIcon size={16} /> Categories <span>{categories.length}</span></a><a href="#settings"><Settings2 size={16} /> Site settings</a></nav><div className="admin-sidebar__bottom"><Link href="/" target="_blank"><ExternalLink size={15} /> View live site</Link><button onClick={onSignOut}><LogOut size={15} /> Sign out</button><small>{email}</small></div></aside><section className="admin-main"><header className="admin-topbar"><div><p className="admin-kicker">Bean &amp; Brew · Control room</p><h1>Good morning, <em>admin.</em></h1></div><div className="admin-topbar__right"><span className="admin-live"><i /> Live</span><button className="admin-avatar" title={email}>{email?.slice(0, 1).toUpperCase() ?? "A"}</button></div></header><div className="admin-content"><div className="admin-stats"><div><span>Menu items</span><strong>{items.length}</strong><small>Across {Math.max(categories.length - 1, 0)} categories</small></div><div><span>Currently live</span><strong>{items.filter((item) => item.is_available !== false).length}</strong><small>Visible on public menu</small></div><div><span>Featured</span><strong>{items.filter((item) => item.is_featured).length}</strong><small>House highlights</small></div></div>{notice && <div className="admin-notice"><Check size={16} /> {notice}</div>}{error && <div className="admin-error admin-error--banner">{error}</div>}<section className="admin-panel" id="menu"><div className="admin-panel__header"><div><p className="admin-kicker">Your menu</p><h2>Keep it <em>fresh.</em></h2></div><button className="admin-button admin-button--primary" onClick={startNewItem}><Plus size={16} /> Add menu item</button></div><div className="admin-filter-row"><button className={activeCategory === "all" ? "is-active" : ""} onClick={() => setActiveCategory("all")}>All items</button>{categories.filter((category) => category.slug !== "all-day").map((category) => <button key={category.id} className={activeCategory === category.id ? "is-active" : ""} onClick={() => setActiveCategory(category.id ?? "")}>{category.name}</button>)}</div>{loading ? <div className="admin-empty">Loading the menu…</div> : filteredItems.length === 0 ? <div className="admin-empty"><Coffee size={22} /><p>No items here yet. Add the first one when you’re ready.</p></div> : <div className="admin-table"><div className="admin-table__row admin-table__head"><span>Item</span><span>Category</span><span>Price</span><span>Status</span><span /></div>{filteredItems.map((item) => <div className="admin-table__row" key={item.id}><div className="admin-item-cell">{item.image_url ? <img src={item.image_url} alt="" /> : <div className="admin-item-cell__placeholder"><Coffee size={17} /></div>}<span><strong>{item.name}</strong><small>{item.tag || item.description}</small></span></div><span className="admin-muted">{item.category}</span><strong className="admin-price">{formatPrice(item.price)}</strong><button className={`admin-status ${item.is_available !== false ? "is-live" : "is-hidden"}`} onClick={() => void toggleAvailability(item)}>{item.is_available !== false ? "Live" : "Hidden"}</button><div className="admin-row-actions"><button onClick={() => startEdit(item)}>Edit</button><button onClick={() => void removeItem(item)} aria-label={`Delete ${item.name}`}><Trash2 size={15} /></button></div></div>)}</div>}</section><section className="admin-panel admin-panel--categories" id="categories"><div className="admin-panel__header"><div><p className="admin-kicker">Organize</p><h2>Menu <em>categories.</em></h2></div></div><div className="admin-category-list">{categories.filter((category) => category.slug !== "all-day").map((category) => <div key={category.id}><span>{category.name}</span><small>{items.filter((item) => item.category_id === category.id).length} items</small><button onClick={() => void removeCategory(category)} aria-label={`Delete ${category.name}`}><Trash2 size={14} /></button></div>)}</div><form className="admin-inline-form" onSubmit={addCategory}><input value={categoryName} onChange={(event) => setCategoryName(event.target.value)} placeholder="New category name" /><button className="admin-button admin-button--secondary"><Plus size={15} /> Add category</button></form></section></div></section>{form && <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setForm(null); }}><form className="admin-modal" onSubmit={saveItem}><div className="admin-modal__header"><div><p className="admin-kicker">Menu editor</p><h2>{form.id ? "Edit item" : "Add an item"}</h2></div><button type="button" onClick={() => setForm(null)} aria-label="Close"><X size={19} /></button></div><label>Item name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Honey lavender latte" /></label><div className="admin-form-grid"><label>Category<select required value={form.category_id} onChange={(event) => setForm({ ...form, category_id: event.target.value })}>{categories.filter((category) => category.slug !== "all-day").map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label>Price<input required min="0" step="0.5" type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="6.50" /></label></div><label>Description<textarea rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="A short, appetizing description" /></label><div className="admin-form-grid"><label>Image URL<input type="url" value={form.image_url} onChange={(event) => setForm({ ...form, image_url: event.target.value })} placeholder="https://…" /></label><label>Tag<input value={form.tag} onChange={(event) => setForm({ ...form, tag: event.target.value })} placeholder="New / House favourite" /></label></div><div className="admin-checks"><label><input type="checkbox" checked={form.is_available} onChange={(event) => setForm({ ...form, is_available: event.target.checked })} /> Visible on public menu</label><label><input type="checkbox" checked={form.is_featured} onChange={(event) => setForm({ ...form, is_featured: event.target.checked })} /> Feature this item</label></div><div className="admin-modal__footer"><button type="button" className="admin-button admin-button--secondary" onClick={() => setForm(null)}>Cancel</button><button type="submit" className="admin-button admin-button--primary"><Check size={16} /> Save item</button></div></form></div>}</main>;
}

export default function Admin() {
  const [sessionReady, setSessionReady] = useState(false);
  const [session, setSession] = useState<{ user: { email?: string } } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(false);

  useEffect(() => {
    const client = supabase;
    if (!client) { setSessionReady(true); return; }
    let mounted = true;
    void client.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session ? { user: { email: data.session.user.email } } : null);
      if (data.session) {
        setCheckingAdmin(true);
        const { data: profile } = await client.from("admin_profiles").select("id,role").eq("id", data.session.user.id).maybeSingle();
        if (mounted) { setIsAdmin(Boolean(profile)); setCheckingAdmin(false); }
      }
      setSessionReady(true);
    });
    const { data: listener } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession ? { user: { email: nextSession.user.email } } : null);
      if (!nextSession) setIsAdmin(false);
    });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, []);

  if (!hasSupabaseConfig) return <main className="admin-auth"><div className="admin-auth__card"><p className="admin-kicker">Configuration needed</p><h1>Supabase is<br /><em>not connected.</em></h1><p className="admin-auth__intro">Add the Supabase project variables to this WebDev project before using the admin dashboard.</p></div></main>;
  if (!sessionReady || checkingAdmin) return <main className="admin-loading"><Coffee size={25} /><span>Opening the workspace…</span></main>;
  if (!session) return <AdminLogin />;
  if (!isAdmin) return <AccessPending email={session.user.email} onSignOut={() => void supabase?.auth.signOut()} />;
  return <AdminDashboard email={session.user.email} onSignOut={() => void supabase?.auth.signOut()} />;
}
