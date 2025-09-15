using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Helper
{
    public static class HtmlStyles
    {
        public const string StyleBlock = @"
    <style>
      body { font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; }
      .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 10px; 
                   border: 1px solid #e0e0e0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
      .header { background-color: #005c3c; color: #fff; text-align: center; padding: 15px; }
      .header img { max-height: 60px; margin-bottom: 10px; }
      .content { padding: 20px; }
      .content h2 { color: #005c3c; margin-bottom: 10px; }
      .highlight { font-size: 20px; font-weight: bold; color: #d4af37; }
      .footer { background: #f0f0f0; text-align: center; padding: 10px; font-size: 12px; color: #777; }
    </style>";

        public const string Footer = @"
    <div class='footer'>
      <p>© 2025 - Sistema de Medicações</p>
    </div>";
    }
}
