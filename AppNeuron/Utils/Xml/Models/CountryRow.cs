using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AppNeuron.Utils.Xml.Models
{
    public class CountryRow : IRequeredId
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Top { get; set; }
        public int Left { get; set; }
        public string Src { get; set; }

        [XmlIgnore]
        public IEnumerable<CityRow> Cities { get; set; }

        public CountryRow() { }
    }
}