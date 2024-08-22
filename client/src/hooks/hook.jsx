import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const useErrors = (errors = []) => {
  useEffect(() => {
    errors.forEach(({ isError, error, fallback }) => {
      if (isError)
        if (fallback) fallback();
        else toast.error(error?.data?.message || "Something went wrong");
    });
  }, [errors]);
};

export const useMutation = (mutationhook) => {
  const [mutate] = mutationhook();
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(false);

  const executeMutation = async (toastMessage, args) => {
    setLoading(true);

    const toastId = toast.loading(toastMessage || "Loading...");
    try {
      const res = await mutate({ ...args });
      
      setResponse(res);

      if (res.data) {
        toast.success(res.data.message || "Success", { id: toastId });
      } else {
        toast.error(res?.error?.data?.errMessage || "Something went wrong", {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return [executeMutation, loading, response];
};
