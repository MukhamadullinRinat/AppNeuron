using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AppNeuron.Models
{
    public class PatientsResult
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public int Time { get; set; }
        public int Level { get; set; }
        public int Result { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }
}