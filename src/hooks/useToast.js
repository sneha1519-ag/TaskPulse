import { useToast as useToastPrimitive } from "@/components/ui/toast";

export const useToast = () => {
  const { addToast } = useToastPrimitive();

  const showSuccess = (title, description) => {
    addToast({
      title,
      description,
      variant: "success",
    });
  };

  const showError = (title, description) => {
    addToast({
      title,
      description,
      variant: "destructive",
    });
  };

  return {
    showSuccess,
    showError,
  };
}; 