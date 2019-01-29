using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AppNeuron.Utils
{
    public class ComparisonData
    {
        public int OtherTime { get; set; }
        public int OtherPersent { get; set; }
        public int Time { get; set; }
        public int Percent { get; set; }
        public bool Reload { get; set; }

        public ComparisonData()
        {
            OtherPersent = 50;
            OtherTime = 50;
            Time = 50;
            Percent = 50;
        }
    }
}