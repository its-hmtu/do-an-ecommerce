import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { getProductByBrandApi, getProductsApi, getProductsByCategoryApi, getProductsBySeriesApi, searchProductsApi, submitReviewApi } from "api/product";
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

const useProductByBrand = (brand) => {
  const query = useQuery({
    queryKey: [queryKeys.products, brand],
    queryFn: () => getProductByBrandApi(brand),
  });

  return query;
}

const useProductBySeries = (series) => {
  const query = useQuery({
    queryKey: [queryKeys.products, series],
    queryFn: () => getProductsBySeriesApi(series),
  });

  return query;
}

const useProductByCategory = (category) => {
  const query = useQuery({
    queryKey: [queryKeys.products, category],
    queryFn: () => getProductsByCategoryApi(category),
  });

  return query;
}

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

export { useProducts, useProduct, useSubmitReview, useSearchProducts, useProductByBrand, useProductBySeries, useProductByCategory };
