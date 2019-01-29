using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AppNeuron.Models
{
    public class UserLevel
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int Level { get; set; }
    }
}