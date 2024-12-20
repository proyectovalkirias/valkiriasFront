import { Product } from "@/interfaces/Product";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`http://localhost:3000/products`, {
      cache: "no-cache",
      next: { revalidate: 1500 },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }
    return (await res.json()) as Product[];
  } catch (error) {
    throw new Error(`Error fetching products: ${(error as Error).message}`);
  }
}

export async function getProductById(id: string): Promise<Product> {
  try {
    const products: Product[] = await getProducts();
    const productFiltered = products.find(
      (product) => product.id.toString() === id
    );
    if (!productFiltered) throw new Error("Product not found");
    return productFiltered;
  } catch (error) {
    throw new Error(`Error obtaining the product: ${error}`);
  }
}

export const fetchCategories = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      cache: "no-cache",
      next: { revalidate: 1500 },
    });
    if (!response.ok) throw new Error("Failed to fetch categories");
    const data = await response.json();
    return Array.from(
      new Set(
        (data as { category: string }[]).map((product) => product.category)
      )
    );
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    return [];
  }
};

export async function getProductsByCategory(
  category: string
): Promise<Product[]> {
  try {
    const res = await fetch(
      `http://localhost:3000/products?category=${encodeURIComponent(category)}`
    );
    if (!res.ok) {
      throw new Error("Error fetching products by category");
    }
    return (await res.json()) as Product[];
  } catch (error) {
    console.error(error);
    throw error;
  }
}
