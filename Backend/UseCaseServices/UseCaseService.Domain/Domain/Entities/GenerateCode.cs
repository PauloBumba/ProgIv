using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class GenerateCode
    {
        public string GenerateCodeRecuperation()
        {
            var gererate = new Random();
            var code = gererate.Next(111111, 999999).ToString();
            return code;
        }
    }
}
