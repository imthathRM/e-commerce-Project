import axios from 'axios';
import type { Product, ProductsResponse } from '@/types';
import { mockProducts } from '@/data/mockProducts';

const api = axios.create({
  baseURL: 'https://dummyjson.com',
});

export const getProducts = async (limit = 20, skip = 0): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>(`/products?limit=${limit}&skip=${skip}`);
  
  // Merge mock products for 'All Products' view
  // We only add them if we are on the first page or similar, 
  // but for simplicity, we'll just prepend them to the results
  const allProducts = [...mockProducts, ...response.data.products];
  
  return {
    ...response.data,
    products: allProducts,
    total: response.data.total + mockProducts.length
  };
};

export const getProductById = async (id: string | number): Promise<Product> => {
  const mockProduct = mockProducts.find(p => p.id === Number(id));
  if (mockProduct) return mockProduct;

  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
};

export const searchProducts = async (query: string): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>(`/products/search?q=${query}`);
  
  const filteredMock = mockProducts.filter(p => 
    p.title.toLowerCase().includes(query.toLowerCase()) || 
    p.description.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  return {
    ...response.data,
    products: [...filteredMock, ...response.data.products],
    total: response.data.total + filteredMock.length
  };
};

export const getCategories = async (): Promise<string[]> => {
  const response = await api.get<any[]>('/products/categories');
  let apiCategories: string[] = [];
  
  if (response.data.length > 0 && typeof response.data[0] === 'object') {
    apiCategories = response.data.map((c) => c.slug || c.name);
  } else {
    apiCategories = response.data;
  }

  // Add our new custom categories if they don't exist
  const customCategories = ['sports', 'furniture', 'groceries', 'books', 'beauty'];
  const allCategories = Array.from(new Set([...apiCategories, ...customCategories]));
  
  return allCategories;
};

export const getProductsByCategory = async (category: string): Promise<ProductsResponse> => {
  const filteredMock = mockProducts.filter(p => p.category === category);
  
  try {
    const response = await api.get<ProductsResponse>(`/products/category/${category}`);
    return {
      ...response.data,
      products: [...filteredMock, ...response.data.products],
      total: response.data.total + filteredMock.length
    };
  } catch (error) {
    // If API fails (e.g. category doesn't exist in DummyJSON like 'books'), return only mock products
    return {
      products: filteredMock,
      total: filteredMock.length,
      skip: 0,
      limit: filteredMock.length
    };
  }
};

export const login = async (username: string, password: string): Promise<any> => {
  const response = await api.post('/auth/login', {
    username,
    password,
    expiresInMins: 60, // optional
  });
  return response.data;
};
