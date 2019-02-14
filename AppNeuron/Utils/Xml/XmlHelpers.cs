using AppNeuron.Models;
using AppNeuron.Utils.Xml.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Serialization;

namespace AppNeuron.Utils.Xml
{
    public static class XmlHelpers
    {
        public static List<T> GetFromDb<T>()
        {
            var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, ConfigurationManager.AppSettings["XmlFilePath"], typeof(T).Name + ".xml");

            var formatter = new XmlSerializer(typeof(List<T>));

            using (var stream = new FileStream(path, FileMode.Open))
            {
                return (List<T>)formatter.Deserialize(stream);
            }
        }

        public static T AddToDb<T>(T value)
            where T : IRequeredId, new()
        {
            var formatter = new XmlSerializer(typeof(List<T>));
            var fileName = typeof(T).Name;
            var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, ConfigurationManager.AppSettings["XmlFilePath"], fileName + ".xml");
            List<T> collection = null;

            using (var stream = new FileStream(path, FileMode.OpenOrCreate))
            {
                try
                {
                    collection = (List<T>)formatter.Deserialize(stream);
                }
                catch
                {
                    collection = new List<T>();
                }
                finally
                {
                    value.Id = collection.Any() ? collection.Max(c => c.Id) + 1 : 0;
                    collection.Add(value);

                    stream.Position = 0;

                    formatter.Serialize(stream, collection);
                }
            }

            return value;
        }
    }
}