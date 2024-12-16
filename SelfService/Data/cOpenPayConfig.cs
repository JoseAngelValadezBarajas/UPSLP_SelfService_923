using System.Data;
using System;
using System.Data.SqlClient;

namespace SelfService.Data
{
    public class cOpenPayConfig
    {
        public string OpenPayApiKey { get; set; }
        public string OpenPayMerchantId { get; set; }
        public bool OpenPayProduction { get; set; }

        public static cOpenPayConfig GetOpenPayConfig()
        {
            ConnectionStringsInternoJson connectionStringsInternoJson = ConnectionStringsInternoJson.GetConnectionStringsInternoJson();
            string connectionString = connectionStringsInternoJson.ConnectionStrings.PowerCampusDbContext;

            SqlConnection sqlConexion = new SqlConnection(connectionString);
            DataSet dtsDatos = new DataSet();
            DataTable dtbDatos = new DataTable();
            try
            {
                if (sqlConexion.State == ConnectionState.Closed)
                    sqlConexion.Open();

                SqlCommand sqlCommand = new SqlCommand("zAdd_spOpenPaySelConfig", sqlConexion);
                sqlCommand.CommandType = CommandType.StoredProcedure;
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(sqlCommand);

                sqlAdapter.Fill(dtsDatos, "Datos");

                dtbDatos = dtsDatos.Tables[0];

                if (dtbDatos.Rows.Count == 0)
                    throw new Exception("No se ha realizado la configuración de OpenPay.");
                else
                {
                    return new cOpenPayConfig
                    {
                        OpenPayApiKey = (string)dtbDatos.Rows[0]["OpenPayApiKey"],
                        OpenPayMerchantId = (string)dtbDatos.Rows[0]["OpenPayMerchantId"],
                        OpenPayProduction = (bool)dtbDatos.Rows[0]["OpenPayProduction"]
                    };
                }

            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                sqlConexion.Close();
            }
        }

    }
}
