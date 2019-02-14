using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AppNeuron.Models
{
    [Serializable]
    public class Country
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Top { get; set; }
        public string Left { get; set; }
        public string Src { get; set; }

        public Country() { }

        //public List<City> cites { get; set; }
    }
}