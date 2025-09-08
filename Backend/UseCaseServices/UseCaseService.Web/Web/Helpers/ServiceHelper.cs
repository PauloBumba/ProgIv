using Application.Response;

namespace Web.Helpers
{
    
        public static class ServiceHelper
        {
            public static EnvelopResponse<T> HandleException<T>(Exception ex, string defaultMessage = "Erro inesperado.")
            {
               
                return new EnvelopResponse<T>
                {
                    isSuccess = false,
                    Message = $"{defaultMessage} {ex.Message}",
                    Data = default
                };
            }
        }
    }

