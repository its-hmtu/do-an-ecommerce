import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { getUserApi, loginApi, registerApi } from "api/user";

const useLogin = ({email, password}) => {
  return useMutation({
    mutationFn: () => loginApi({email, password})
  })
}

const useGetUser = () => {
  return useQuery({
    queryKey: 'user',
    queryFn: getUserApi,
    retry: 3,
    retryCooldown: 5000,
  })
}

const useRegister = ({email, password, username, confirm_password, first_name, last_name}) => {
  return useMutation({
    mutationFn: () => registerApi({email, password, username, confirm_password, first_name, last_name}) 
  })
}

export {
  useLogin,
  useRegister,
  useGetUser
}