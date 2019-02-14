using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AppNeuron.Utils.Xml.Models
{
    [Serializable]
    public class UserRow : IRequeredId
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MiddleName { get; set; }
        public bool Sex { get; set; }
        public int BirthDateYear { get; set; }

        public UserRow() { }
    }
}