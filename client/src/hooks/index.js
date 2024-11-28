import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import {
  getUserApi,
  loginApi,
  registerApi,
  logoutApi,
  getUserCartApi,
  updateUserCartApi,
  addItemToCartApi,
  removeFromCartApi,
  updateCartSubTotalApi,
  createOrderApi,
  createCheckoutSessionApi,
  getUserOrdersApi,
} from "api/user";
import { queryKeys } from "config";

const useLogin = ({ email, password }) => {
  return useMutation({
    mutationFn: () => loginApi({ email, password }),
  });
};

const useGetUser = () => {
  return useQuery({
    queryKey: [queryKeys.user],
    queryFn: getUserApi,
    enabled: localStorage.getItem("access_token") ? true : false,
    refetchOnWindowFocus: localStorage.getItem("access_token") ? true : false,
  });
};

const useRegister = ({
  email,
  password,
  username,
  confirm_password,
  first_name,
  last_name,
}) => {
  return useMutation({
    mutationFn: () =>
      registerApi({
        email,
        password,
        username,
        confirm_password,
        first_name,
        last_name,
      }),
  });
};

const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      queryClient.removeQueries(queryKeys.user);
    },
  });
};

const useGetUserCart = () => {
  return useQuery({
    queryKey: [queryKeys.userCart],
    queryFn: getUserCartApi,
    enabled: localStorage.getItem("access_token") ? true : false,
    refetchOnWindowFocus: localStorage.getItem("access_token") ? true : false,
  });
};

const useUpdateUserCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cart_id, item_id, quantity }) =>
      updateUserCartApi({
        cart_id,
        item_id,
        quantity,
      }),
    onSuccess: () => queryClient.invalidateQueries([queryKeys.userCart]),
  });
};

const useAddItemToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ option_id, quantity, product_id, cart_id }) =>
      addItemToCartApi({
        option_id,
        quantity,
        product_id,
        cart_id,
      }),
    onSuccess: () => queryClient.invalidateQueries([queryKeys.userCart]),
  });
};

const useRemoveItemFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids) => removeFromCartApi(ids),
    onSuccess: () => queryClient.invalidateQueries([queryKeys.userCart]),
  });
};

const useUpdateCartSubtotal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (subtotal) => updateCartSubTotalApi(subtotal),
    onSuccess: () => queryClient.invalidateQueries([queryKeys.userCart]),
  });
};

const useCreateOrder = () => {
  return useMutation({
    mutationFn: ({ subtotal, items, address }) =>
      createOrderApi({
        subtotal,
        items,
        address,
      }),
  });
};

const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: ({
      orderId,
      items,
    }) => createCheckoutSessionApi(
      {
        orderId,
        items,
      }
    ),
  });
}

const useGetUserOrders = () => {
  return useQuery({
    queryKey: [queryKeys.userOrders],
    queryFn: getUserOrdersApi,
  })
}

export {
  useLogin,
  useRegister,
  useGetUser,
  useLogout,
  useGetUserCart,
  useUpdateUserCart,
  useAddItemToCart,
  useRemoveItemFromCart,
  useUpdateCartSubtotal,
  useCreateOrder,
  useCreateCheckoutSession,
  useGetUserOrders,
};
