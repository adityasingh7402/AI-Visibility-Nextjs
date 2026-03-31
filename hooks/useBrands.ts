'use client';

import { useState, useCallback } from 'react';
import {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  getBrandAnalyses,
  type Brand,
  type CreateBrandRequest,
  type UpdateBrandRequest,
} from '@/lib/brands-api';

export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBrands();
      setBrands(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch brands');
    } finally {
      setLoading(false);
    }
  }, []);

  const createNew = useCallback(async (data: CreateBrandRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newBrand = await createBrand(data);
      setBrands(prev => [newBrand, ...prev]);
      return newBrand;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create brand');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id: string, data: UpdateBrandRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateBrand(id, data);
      setBrands(prev => prev.map(b => b.id === id ? updated : b));
      return updated;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update brand');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteBrand(id);
      setBrands(prev => prev.filter(b => b.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete brand');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    brands,
    loading,
    error,
    fetchBrands,
    createBrand: createNew,
    updateBrand: update,
    deleteBrand: remove,
  };
}

export function useBrand(id: string | null) {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBrand = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getBrand(id);
      setBrand(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch brand');
    } finally {
      setLoading(false);
    }
  }, [id]);

  return {
    brand,
    loading,
    error,
    fetchBrand,
  };
}

export function useBrandAnalyses(brandId: string | null) {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyses = useCallback(async (limit = 20) => {
    if (!brandId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getBrandAnalyses(brandId, limit);
      setAnalyses(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch analyses');
    } finally {
      setLoading(false);
    }
  }, [brandId]);

  return {
    analyses,
    loading,
    error,
    fetchAnalyses,
  };
}
