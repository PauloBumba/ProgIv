using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Response
{
    public class EnvelopResponse<T>
    {
      
            public string Message { get; set; } = string.Empty;
            public bool isSuccess { get; set; }
            public T? Data { get; set; }
        public static EnvelopResponse<T> Success(T data, string message = "Success")
        {
            return new EnvelopResponse<T> { Data = data, isSuccess = true, Message = message };
        }

        public static EnvelopResponse<T> Failure(string message)
        {
            return new EnvelopResponse<T> { isSuccess = false, Message = message };
        }
    }
}
