import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { getUserApi, loginApi } from "api/user";

const useLogin = ({email, password}) => {
  return useMutation({
    mutationFn: () => loginApi({email, password})
  })
}

const useGetUser = () => {
  return useQuery({
    queryKey: 'user',
    queryFn: getUserApi,
  })
}

export {
  useLogin,
  useGetUser
}