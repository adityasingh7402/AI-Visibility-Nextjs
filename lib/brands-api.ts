import { geoApi } from './geo-api';

export interface Brand {
  id: string;
  user_id: string;
  brand_name: string;
  brand_aliases: string[];
  category: string;
  competitors: string[];
  target_audience?: string;
  region: string;
  country_code?: string;
  default_llm_providers: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateBrandRequest {
  brand_name: string;
  brand_aliases?: string[];
  category: string;
  competitors?: string[];
  target_audience?: string;
  region?: string;
  country_code?: string;
  default_llm_providers?: string[];
}

export type UpdateBrandRequest = Partial<CreateBrandRequest>;

export interface QuotaInfo {
  used: number;
  limit: number;
  remaining: number;
  plan: string;
  exceeded: boolean;
}

/**
 * Get all brands for the authenticated user
 */
export async function getBrands(): Promise<Brand[]> {
  const data = await geoApi.getBrands();
  return data?.brands ?? [];
}

/**
 * Get a specific brand by ID
 */
export async function getBrand(id: string): Promise<Brand> {
  const data = await geoApi.getBrand(id);
  return data;
}

/**
 * Create a new brand
 */
export async function createBrand(body: CreateBrandRequest): Promise<Brand> {
  const data = await geoApi.createBrand(body as unknown as Record<string, unknown>);
  return data;
}

/**
 * Update an existing brand
 */
export async function updateBrand(id: string, body: UpdateBrandRequest): Promise<Brand> {
  const data = await geoApi.updateBrand(id, body as unknown as Record<string, unknown>);
  return data;
}

/**
 * Delete a brand
 */
export async function deleteBrand(id: string): Promise<void> {
  await geoApi.deleteBrand(id);
}

/**
 * Get all analyses for a specific brand
 */
export async function getBrandAnalyses(id: string, limit = 20) {
  const data = await geoApi.getBrandAnalyses(id, limit);
  return data?.analyses ?? [];
}

/**
 * Get current user's quota information
 * This is embedded in error responses (429 status code)
 */
export function getQuotaFromError(error: unknown): QuotaInfo | null {
  const e = error as { response?: { status?: number; data?: { quota?: { used: number; limit: number; plan: string } } } };
  if (e.response?.status === 429 && e.response?.data?.quota) {
    const quota = e.response.data.quota;
    return {
      used: quota.used,
      limit: quota.limit,
      remaining: quota.limit - quota.used,
      plan: quota.plan,
      exceeded: true,
    };
  }
  return null;
}
