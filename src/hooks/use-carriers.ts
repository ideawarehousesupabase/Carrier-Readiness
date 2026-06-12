import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCarriers, getCarrier, createCarrier, updateCarrier, deleteCarrier } from "../lib/api/carriers";
import type { Carrier } from "../lib/types";

export const QUERY_KEY_CARRIERS = ["carriers"];
export const QUERY_KEY_CARRIER = (id: string) => ["carrier", id];

export function useCarriers() {
  return useQuery({
    queryKey: QUERY_KEY_CARRIERS,
    queryFn: getCarriers,
  });
}

export function useCarrier(id: string) {
  return useQuery({
    queryKey: QUERY_KEY_CARRIER(id),
    queryFn: () => getCarrier(id),
    enabled: !!id,
  });
}

export function useCreateCarrier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCarrier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_CARRIERS });
    },
  });
}

export function useUpdateCarrier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Carrier> }) => updateCarrier(id, updates),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_CARRIERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_CARRIER(id) });
    },
  });
}

export function useDeleteCarrier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCarrier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_CARRIERS });
    },
  });
}
