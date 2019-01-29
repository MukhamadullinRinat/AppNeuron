using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace AppNeuron.Models
{
    public class Register
    {
        [Required(ErrorMessage = "Введите Ваше имя")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Введите Вашу фамилию")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Введите Ваше отчество")]
        public string MiddleName { get; set; }

        [Required(ErrorMessage = "Введите Ваш год рождения")]
        public int BirthDateYear { get; set; }

        public bool Sex { get; set; }

    }
}