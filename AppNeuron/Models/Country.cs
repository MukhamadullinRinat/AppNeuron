using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AppNeuron.Models
{
    public class Country
    {
        public int id { get; set; }
        public string name { get; set; }
        public int top { get; set; }
        public int left { get; set; }
        public string src { get; set; }

        public List<City> cites { get; set; }
    }
}