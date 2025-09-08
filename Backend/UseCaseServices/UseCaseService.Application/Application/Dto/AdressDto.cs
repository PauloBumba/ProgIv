using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dto
{
    public class AdressDto
    {
        [Required(ErrorMessage = "O País é Obrigatório")]
        public string Country { get; set; } = "Brasil";

        [Required(ErrorMessage = "O Cep é Obrigatório")]
        [MaxLength(8, ErrorMessage = "O Cep contém 8 dígitos")]
        public string ZipCode { get; set; } = string.Empty;

        [Required(ErrorMessage = "O Estado Federal é Obrigatório")]
        public string Federalstate { get; set; } = string.Empty;

        [Required(ErrorMessage = "A Cidade é Obrigatória")]
        public string City { get; set; } = string.Empty;

        [Required(ErrorMessage = "O Bairro é Obrigatório")]
        public string District { get; set; } = string.Empty;

        [Required(ErrorMessage = "O Número da Casa é Obrigatório")]
        public string NumberHouse { get; set; } = string.Empty;
    }
}
