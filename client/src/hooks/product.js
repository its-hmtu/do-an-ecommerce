import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { getProductsApi } from "api/product";
import { queryKeys } from "config";

const useProducts = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.products,
    queryFn: getProductsApi,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.products, data);
    }
  });

  return query;
}

export {
  useProducts
}