using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AppNeuron.Models;

namespace AppNeuron.Utils
{
    public class GameData
    {
        public List<Country> Countries { get; set; }
        public int Level { get; set; }
        public bool Helper { get; set; }
        public bool Enlarg { get; set; }
        public bool Speech { get; set; }
        public bool Error { get; set; }
    }
}