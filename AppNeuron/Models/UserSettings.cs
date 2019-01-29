using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AppNeuron.Models
{
    public class UserSetting
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public bool Helper { get; set; }
        public bool Speech { get; set; }
        public bool Enlarg { get; set; }

        public User User { get; set; }
    }
}