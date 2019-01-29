using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AppNeuron.Models
{
    public class City
    {
        public int id { get; set; }
        public string cityName { get; set; }
        public int top { get; set; }
        public int left { get; set; }
        public int routeNumber { get; set; }
        public string src { get; set; }
        public bool isLeft { get; set; }
        public bool isTop { get; set; }

        public int? CountryId { get; set; }
    }
}