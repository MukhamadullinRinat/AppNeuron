using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AppNeuron.Utils.Xml
{
    public class XmlContext
    {
        public XmlContext()
        {
            var properties = GetType().GetProperties();
            foreach (var prop in properties)
            {
                var defaultValue = prop.PropertyType.GetConstructor(new Type[] { }).Invoke(new object[] { });
                prop.SetValue(this, defaultValue);
            }
        }
    }
}