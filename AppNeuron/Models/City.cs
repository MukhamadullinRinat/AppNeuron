using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AppNeuron.Models
{
    [Serializable]
    public class City
    {
        public string Id { get; set; }
        public string CityName { get; set; }
        public string Top { get; set; }
        public string Left { get; set; }
        public string RouteNumber { get; set; }
        public string src { get; set; }
        public string IsLeft { get; set; }
        public string IsTop { get; set; }

        //public int? CountryId { get; set; }
    }
}