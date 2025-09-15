using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Helper
{
    public static class SafeExecutor
    {
        // Para métodos assíncronos que não retornam valor
        public static async Task ExecuteAsync(Func<Task> action, ILogger logger, string logMessage)
        {
            try
            {
                await action();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, logMessage);
            }
        }

        // Para métodos assíncronos que retornam valor
        public static async Task<T?> ExecuteAsync<T>(Func<Task<T>> action, ILogger logger, string logMessage, T? defaultValue = default)
        {
            try
            {
                return await action();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, logMessage);
                return defaultValue;
            }
        }
    }

}
