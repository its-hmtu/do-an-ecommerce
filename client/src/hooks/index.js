import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { getUserApi, loginApi, registerApi, logoutApi, getUserCartApi } from "api/user";
import { queryKeys } from "config";
import Cookies from "js-cookie";

const useLogin = ({email, password}) => {
  return useMutation({
    mutationFn: () => loginApi({email, password})
  })
}

const useGetUser = () => {
  return useQuery({
    queryKey: [queryKeys.user],
    queryFn: getUserApi,
    enabled: localStorage.getItem('access_token') ? true : false,
    refetchOnWindowFocus: localStorage.getItem('access_token') ? true : false,
  })
}

const useRegister = ({email, password, username, confirm_password, first_name, last_name}) => {
  return useMutation({
    mutationFn: () => registerApi({email, password, username, confirm_password, first_name, last_name}) 
  })
}

const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      queryClient.removeQueries(queryKeys.user);
    }
  })
}

const useGetUserCart = () => {
  return useQuery({
    queryKey: [queryKeys.userCart],
    queryFn: getUserCartApi,
    enabled: localStorage.getItem('access_token') ? true : false,
    refetchOnWindowFocus: localStorage.getItem('access_token') ? true : false,
  })
}

export {
  useLogin,
  useRegister,
  useGetUser,
  useLogout,
  useGetUserCart
}