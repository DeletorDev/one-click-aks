import { useQuery, useQueryClient } from "react-query";
import { axiosInstance } from "../utils/axios-interceptors";

function getServerStatus() {
    return axiosInstance.get("status");
}

export function useServerStatus() {
    const queryClient = useQueryClient();
    return useQuery("server-status", getServerStatus, {
        select: (data) => {
            return data.data.status;
        },
        onError: () => {
            queryClient.invalidateQueries("login-status");
        },
        cacheTime: 1000,
        staleTime: 1000,
    });
}

export function useInvalidateServerStatus() {
    const queryClient = useQueryClient();
    queryClient.invalidateQueries("server-status");
}