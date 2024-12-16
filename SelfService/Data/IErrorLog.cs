using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace SelfService.Data
{
    public class IErrorLog
    {
        public static void SaveErrorLog(string error)
        {
            ConnectionStringsInternoJson connectionStringsInternoJson = ConnectionStringsInternoJson.GetConnectionStringsInternoJson();
            string connectionString = connectionStringsInternoJson.ConnectionStrings.PowerCampusDbContext;
            SqlConnection objSqlConnection = new SqlConnection(connectionString);
            try
            {
                if (objSqlConnection.State == System.Data.ConnectionState.Closed)
                {
                    objSqlConnection.Open();
                }

                SqlCommand cmd = new SqlCommand("zADD_spErrorLog", objSqlConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@pError", SqlDbType.NVarChar,-1).Value = error;

                cmd.ExecuteNonQuery();
            }
            catch
            {
                throw;
            }
            finally
            {
                objSqlConnection.Close();
            }

        }
    }
}
