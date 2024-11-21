import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { getProductsApi } from "api/product";
import { queryKeys } from "config";
import { getProductApi } from "../api/product";

const useProducts = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [queryKeys.products],
    queryFn: () => getProductsApi(),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.products, data);
    }
  });

  return query;
}

const useProduct = (slug) => {
  const query = useQuery({
    queryKey: [queryKeys.products, slug],
    queryFn: () => getProductApi(slug)
  });

  return query;
}

export {
  useProducts,
  useProduct
}