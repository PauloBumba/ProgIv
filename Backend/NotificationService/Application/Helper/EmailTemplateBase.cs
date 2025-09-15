using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Helper
{
    public static class EmailTemplateBase
    {
        public static string Wrap(string title, string content)
        {
            return $@"
        <html>
          <head>{HtmlStyles.StyleBlock}</head>
          <body>
            <div class='container'>
              <div class='header'>
                <img src='https://meuservidor.com/logo.png' alt='Logo'/>
                <h1>{title}</h1>
              </div>
              <div class='content'>
                {content}
              </div>
              {HtmlStyles.Footer}
            </div>
          </body>
        </html>";
        }
    }
}
