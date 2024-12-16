using System.Text.Json;

namespace SelfService.Data
{
    public class ConnectionStringsInternoJson
    {
        public ConnectionStringsInterno ConnectionStrings { get; set; }

        public static ConnectionStringsInternoJson GetConnectionStringsInternoJson()
        {
            string fileName = "Config/ConnectionSettings.json";
            string jsonString = System.IO.File.ReadAllText(fileName);

            ConnectionStringsInternoJson _conn = JsonSerializer.Deserialize<ConnectionStringsInternoJson>(jsonString);

            return _conn;
        }
    }
}
