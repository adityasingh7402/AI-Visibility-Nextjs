/** Single model within a provider */
export interface ProviderModel {
  id: string;
  name: string;
  is_default: boolean;
  has_web_access: boolean;
}

/** A provider with its available models */
export interface Provider {
  id: string;
  display_name: string;
  company: string;
  models: ProviderModel[];
}

/** Full registry response from GET /api/v1/providers */
export interface ProviderRegistry {
  providers: Provider[];
}

/** Provider selection state used by ProviderSelector component */
export interface ProviderSelection {
  /** Map of provider_id → selected model_id */
  [providerId: string]: string;
}

/** Helper: get default model for a provider */
export function getDefaultModel(provider: Provider): string {
  const defaultModel = provider.models.find((m) => m.is_default);
  return defaultModel?.id || provider.models[0]?.id || '';
}
