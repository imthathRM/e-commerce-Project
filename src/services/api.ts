import axios from 'axios';
import type { Product, ProductsResponse } from '@/types';

const api = axios.create({
  baseURL: 'https://dummyjson.com',
});

export const getProducts = async (limit = 20, skip = 0): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>(`/products?limit=${limit}&skip=${skip}`);
  return response.data;
};

export const getProductById = async (id: string | number): Promise<Product> => {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
};

export const searchProducts = async (query: string): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>(`/products/search?q=${query}`);
  return response.data;
};

export const getCategories = async (): Promise<string[]> => {
  const response = await api.get<any[]>('/products/categories');
  // Handle new format where categories might be objects or strings
  if (response.data.length > 0 && typeof response.data[0] === 'object') {
    return response.data.map((c) => c.slug || c.name);
  }
  return response.data;
};

export const getProductsByCategory = async (category: string): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>(`/products/category/${category}`);
  return response.data;
};
