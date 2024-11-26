import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { getProductsApi, searchProductsApi, submitReviewApi } from "api/product";
import { queryKeys } from "config";
import { getProductApi } from "../api/product";

const useProducts = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [queryKeys.products],
    queryFn: () => getProductsApi(),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.products, data);
    },
  });

  return query;
};

const useProduct = (slug) => {
  const query = useQuery({
    queryKey: [queryKeys.products, slug],
    queryFn: () => getProductApi(slug),
  });

  return query;
};

const useSubmitReview = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => submitReviewApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.products);
    },
  });

  return mutation;
};

const useSearchProducts = (query) => {
  return useQuery({
    queryKey: [queryKeys.products, "search", query],
    queryFn: () => searchProductsApi(query),
  })
}

export { useProducts, useProduct, useSubmitReview, useSearchProducts };
