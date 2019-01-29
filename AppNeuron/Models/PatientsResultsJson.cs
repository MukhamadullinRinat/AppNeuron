using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace AppNeuron.Models
{
    public class PatientsResultsJson
    {
        public PatientsResult Result { get; set; }
        public string DateInString { get; set; }
    }
}