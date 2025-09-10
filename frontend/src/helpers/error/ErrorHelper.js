import { toast } from "sonner";

export const handleError = (error) => {
  let message = "Bir hata oluştu.";
  let status = null;

  if (error.response) {
    status = error.response.status;
    message =
      error.response.data?.message || error.response.statusText || message;
  } else if (error.request) {
    message = "Sunucuya ulaşılamıyor. Lütfen bağlantınızı kontrol edin.";
  } else if (error.message) {
    message = error.message;
  }

  switch (status) {
    case 401:
      message = "Yetkisiz erişim. Lütfen giriş yapın.";
      break;
    case 404:
      message = "İstenen kaynak bulunamadı.";
      break;
    case 500:
      message = "Sunucuda bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
      break;
    default:
      break;
  }

  toast.error(message);
  if (import.meta.env.DEV) console.error("Hata detayları:", error);
  return message;
};
