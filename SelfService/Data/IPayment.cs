using System;
using System.Data;
using System.Data.SqlClient;

namespace SelfService.Data
{
    public class IPayment
    {

        public static void InsOpenPayTransacyionId(int _TransactionId,
                                          string _OpenPayId)
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

                SqlCommand cmd = new SqlCommand("zAdd_spOpenPayInsTransactionId", objSqlConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@pPaymentTransactionId", SqlDbType.Int).Value = _TransactionId;
                cmd.Parameters.Add("@pOpenPayId", SqlDbType.NVarChar, 50).Value = _OpenPayId;

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
        public static string GetOpenPayId(int _TransactionId)
        {
            try
            {
                ConnectionStringsInternoJson connectionStringsInternoJson = ConnectionStringsInternoJson.GetConnectionStringsInternoJson();
                string connectionString = connectionStringsInternoJson.ConnectionStrings.PowerCampusDbContext;
                SqlConnection objSqlConnection = new SqlConnection(connectionString);
                string strDato;
                try
                {
                    if (objSqlConnection.State == System.Data.ConnectionState.Closed)
                    {
                        objSqlConnection.Open();
                    }

                    SqlCommand cmd = new SqlCommand("Select dbo.zAdd_fnOpenPaySelTransactionId(@pPaymentTransactionId)", objSqlConnection);
                    cmd.Parameters.AddWithValue("@pPaymentTransactionId", _TransactionId);

                    strDato = cmd.ExecuteScalar().ToString();

                }
                catch (Exception ex)
                {
                    IErrorLog.SaveErrorLog(ex.ToString());
                    throw;
                }
                finally
                {
                    objSqlConnection.Close();
                }

                return strDato;

            }
            catch
            {
                throw;
            }

        }

        public static void InsCashReceiptfromWeb(int _TransactionId,
                                          string _AutNum)
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

                SqlCommand cmd = new SqlCommand("spInsCashReceiptfromWeb", objSqlConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@PaymentTransactionId", SqlDbType.Int).Value = _TransactionId;
                cmd.Parameters.Add("@AuthoNumber", SqlDbType.NVarChar, 100).Value = _AutNum;

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
