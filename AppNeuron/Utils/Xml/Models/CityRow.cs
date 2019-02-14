using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AppNeuron.Utils.Xml.Models
{
    [Serializable]
    public class CityRow : IRequeredId
    {
        public int Id { get; set; }
        public string CityName { get; set; }
        public int Top { get; set; }
        public int Left { get; set; }
        public string Src { get; set; }
        public bool IsLeft { get; set; }
        public bool IsTop { get; set; }

        public CityRow() { }
    }
}