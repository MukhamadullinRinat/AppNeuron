using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AppNeuron.Utils.Xml.Models
{
    public class XmlSet<T> : IEnumerable<T>
        where T : IRequeredId, new()
    {
        public IEnumerator<T> GetEnumerator()
        {
            var items = XmlHelpers.GetFromDb<T>();
            foreach (var item in items)
                yield return item;
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }

        public T Add(T value)
        {
            return XmlHelpers.AddToDb(value);
        }
    }
}