using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AppNeuron.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public bool Sex { get; set; }
        public int BirthDateYear { get; set; }

        public override bool Equals(object obj)
        {
            if (obj is User)
            {
                var user = obj as User;
                return user.Id == Id;
            }
            else
                return false;
        }
    }
}