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
  { slug: "all-day", name: "All", description: "A little something for every mood.", sort_order: 0 },
  { slug: "drinks", name: "Drinks", description: "Chai, coffee, coolers, and comforting pours.", sort_order: 1 },
  { slug: "appetizers", name: "Appetizers", description: "Small plates made for sharing.", sort_order: 2 },
  { slug: "main-course", name: "Main course", description: "Indian comfort food with a Bean & Brew touch.", sort_order: 3 },
  { slug: "desserts", name: "Desserts", description: "Sweet finishes with familiar flavours.", sort_order: 4 },
];

export const fallbackItems: MenuItem[] = [
  { name: "Masala chai", description: "Slow-brewed Assam tea with ginger, cardamom, and warming spices.", price: 90, category: "Drinks", category_slug: "drinks", image_url: "", tag: "House favourite" },
  { name: "Filter coffee", description: "South Indian filter coffee with a rich decoction and frothy milk.", price: 120, category: "Drinks", category_slug: "drinks", image_url: "" },
  { name: "Mango cooler", description: "Alphonso mango, lime, mint, and a little sparkle.", price: 160, category: "Drinks", category_slug: "drinks", image_url: "", tag: "Seasonal" },
  { name: "Paneer tikka", description: "Charred cottage cheese, peppers, onions, and mint chutney.", price: 240, category: "Appetizers", category_slug: "appetizers", image_url: "", tag: "Best seller" },
  { name: "Masala fries", description: "Crisp fries tossed with chaat masala and served with house dip.", price: 180, category: "Appetizers", category_slug: "appetizers", image_url: "" },
  { name: "Crispy corn chaat", description: "Golden corn, onion, coriander, lime, and bright chaat masala.", price: 190, category: "Appetizers", category_slug: "appetizers", image_url: "" },
  { name: "Butter chicken bowl", description: "Creamy tomato curry, tandoori chicken, jeera rice, and salad.", price: 360, category: "Main course", category_slug: "main-course", image_url: "", tag: "Chef's pick" },
  { name: "Paneer makhani bowl", description: "Silky tomato gravy, paneer, jeera rice, and warm garlic naan.", price: 320, category: "Main course", category_slug: "main-course", image_url: "" },
  { name: "Dal makhani & naan", description: "Slow-cooked black lentils with butter naan and pickled onions.", price: 280, category: "Main course", category_slug: "main-course", image_url: "" },
  { name: "Gulab jamun", description: "Warm milk-solid dumplings, saffron syrup, and pistachio.", price: 140, category: "Desserts", category_slug: "desserts", image_url: "" },
  { name: "Mango shrikhand", description: "Silky hung curd, Alphonso mango, cardamom, and toasted nuts.", price: 160, category: "Desserts", category_slug: "desserts", image_url: "" },
  { name: "Chai-spiced tres leches", description: "A soft milk cake layered with chai spices and cream.", price: 190, category: "Desserts", category_slug: "desserts", image_url: "", tag: "New" },
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
    const indianSlugs = new Set(["drinks", "appetizers", "main-course", "desserts"]);
    if (!liveCategories.some((category) => indianSlugs.has(category.slug))) {
      return { categories: fallbackCategories, items: fallbackItems, isLive: false };
    }
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

export const formatPrice = (price: number) => `₹${Number(price).toLocaleString("en-IN")}`;
