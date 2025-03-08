export const createQueryKeyStructure = (baseKey: string) => ({
    all: [baseKey] as const,
    lists: () => [baseKey, "list"] as const,
    list: (filters: string) => [baseKey, "list", { filters }] as const,
    details: () => [baseKey, "detail"] as const,
    detail: (id: string) => [baseKey, id] as const,
  });
  