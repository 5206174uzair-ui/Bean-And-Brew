import { supabase } from "./supabase";

export type MenuCategory = {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  sort_order?: number;
  is_published?: boolean;
};

export type MenuItem = {
  id?: string;
  category_id?: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  tag?: string | null;
  category: string;
  category_slug?: string;
  is_available?: boolean;
  is_featured?: boolean;
  sort_order?: number;
};

export const fallbackCategories: MenuCategory[] = [
  { slug: "all-day", name: "All day", sort_order: 0 },
  { slug: "coffee", name: "Coffee", sort_order: 1 },
  { slug: "breakfast", name: "Breakfast", sort_order: 2 },
  { slug: "lunch", name: "Lunch", sort_order: 3 },
  { slug: "sweet-things", name: "Sweet things", sort_order: 4 },
];

export const fallbackItems: MenuItem[] = [
  { name: "The Mercer", description: "Double espresso, steamed oat milk, brown sugar", price: 6.5, category: "Coffee", category_slug: "coffee", image_url: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1200&q=85", tag: "House favourite" },
  { name: "Rosemary latte", description: "Espresso, rosemary syrup, silky milk, orange zest", price: 6.75, category: "Coffee", category_slug: "coffee", image_url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=85" },
  { name: "Morning board", description: "Sourdough, cultured butter, jam, soft-boiled egg", price: 14, category: "Breakfast", category_slug: "breakfast", image_url: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=85", tag: "Best seller" },
  { name: "Miso mushroom toast", description: "Wild mushrooms, miso butter, herbs, poached egg", price: 16, category: "Breakfast", category_slug: "breakfast", image_url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=85" },
  { name: "Crispy chicken focaccia", description: "Buttermilk chicken, pickled cabbage, herb mayo", price: 17, category: "Lunch", category_slug: "lunch", image_url: "https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=1200&q=85", tag: "New" },
  { name: "Roasted tomato melt", description: "Aged cheddar, roasted tomato, basil, levain", price: 15, category: "Lunch", category_slug: "lunch", image_url: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=85" },
  { name: "Cardamom morning bun", description: "Laminated pastry, cardamom sugar, sea salt", price: 5.5, category: "Sweet things", category_slug: "sweet-things", image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=85", tag: "Baked today" },
  { name: "Olive oil cake", description: "Citrus, crème fraîche, pistachio crumb", price: 8, category: "Sweet things", category_slug: "sweet-things", image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85" },
];

export async function loadPublicMenu() {
  if (!supabase) return { categories: fallbackCategories, items: fallbackItems, isLive: false };

  try {
    const { data: categories, error: categoryError } = await supabase
      .from("menu_categories")
      .select("id,name,slug,description,sort_order,is_published")
      .eq("is_published", true)
      .order("sort_order");
    if (categoryError) throw categoryError;

    const liveCategories = categories ?? [];
    const ids = liveCategories.filter((category) => category.slug !== "all-day").map((category) => category.id).filter(Boolean) as string[];
    const { data: items, error: itemError } = ids.length
      ? await supabase.from("menu_items").select("id,category_id,name,description,price,image_url,tag,is_available,is_featured,sort_order").in("category_id", ids).eq("is_available", true).order("sort_order")
      : { data: [], error: null };
    if (itemError) throw itemError;

    const categoryMap = new Map(liveCategories.map((category) => [category.id, category]));
    const mappedItems = (items ?? []).map((item) => {
      const category = categoryMap.get(item.category_id);
      return {
        ...item,
        price: Number(item.price),
        description: item.description ?? "",
        image_url: item.image_url ?? "",
        category: category?.name ?? "Menu",
        category_slug: category?.slug,
      } as MenuItem;
    });

    return { categories: [{ slug: "all-day", name: "All day", sort_order: -1 }, ...liveCategories.filter((category) => category.slug !== "all-day")], items: mappedItems, isLive: true };
  } catch (error) {
    console.warn("Live menu unavailable; using the curated fallback menu.", error);
    return { categories: fallbackCategories, items: fallbackItems, isLive: false };
  }
}

export async function loadAdminMenu() {
  if (!supabase) throw new Error("Supabase is not configured for this project.");
  const categoryResult = await supabase.from("menu_categories").select("id,name,slug,description,sort_order,is_published").order("sort_order");
  const itemResult = await supabase.from("menu_items").select("id,category_id,name,description,price,image_url,tag,is_available,is_featured,sort_order").order("sort_order");
  const { data: categories, error: categoryError } = categoryResult;
  const { data: items, error: itemError } = itemResult;
  if (categoryError) throw categoryError;
  if (itemError) throw itemError;
  const categoryMap = new Map((categories ?? []).map((category) => [category.id, category]));
  return {
    categories: (categories ?? []) as MenuCategory[],
    items: (items ?? []).map((item) => ({ ...item, price: Number(item.price), category: categoryMap.get(item.category_id)?.name ?? "Uncategorized", category_slug: categoryMap.get(item.category_id)?.slug }) as MenuItem),
  };
}

export const formatPrice = (price: number) => `$${Number(price).toFixed(2).replace(".00", "")}`;
