using AppNeuron.Models;
using AppNeuron.Utils.Xml.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AppNeuron.Utils.Xml
{
    [Serializable]
    public class XmlNeuronContext : XmlContext
    {
        public XmlSet<CountryRow> Countries { get; set; }
        public XmlSet<CityRow> Cities { get; set; }
        public XmlSet<UserRow> Users { get; set; }

        //public XmlSet<PatientsResult> PatientsResults { get; set; }
        //public XmlSet<Doctor> Doctors { get; set; }
        //public XmlSet<UserSetting> UserSettings { get; set; }
        //public XmlSet<UserLevel> UserLevels { get; set; }
    }
}