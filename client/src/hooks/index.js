import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { getUserApi, loginApi, registerApi, logoutApi } from "api/user";
import { queryKeys } from "config";
import Cookies from "js-cookie";

const useLogin = ({email, password}) => {
  return useMutation({
    mutationFn: () => loginApi({email, password})
  })
}

const useGetUser = (enabled) => {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: getUserApi,
    retry: 3,
    retryCooldown: 5000,
    enabled: enabled
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
      queryClient.invalidateQueries(queryKeys.user);
    }
  })
}

export {
  useLogin,
  useRegister,
  useGetUser,
  useLogout,
}