using System.Data;
using System;
using System.Data.SqlClient;

namespace SelfService.Data
{
    public class cRetEvPay
    {
        public int id { get; set; }
        public int idFicha { get; set; }
    }

    public class IAdmissions
    {
        public static string GetFichaLabelTexT(string _lblCode)
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

                    SqlCommand cmd = new SqlCommand("Select dbo.zAdd_fnAdminGetLabelFicha(@pLabelCode)", objSqlConnection);
                    cmd.Parameters.AddWithValue("@pLabelCode", _lblCode);

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

        public static int GetIdAppCurp(string _curp, int _idForm)
        {
            try
            {
                ConnectionStringsInternoJson connectionStringsInternoJson = ConnectionStringsInternoJson.GetConnectionStringsInternoJson();
                string connectionString = connectionStringsInternoJson.ConnectionStrings.PowerCampusDbContext;
                SqlConnection objSqlConnection = new SqlConnection(connectionString);
                int intIdApp = 0;
                try
                {
                    if (objSqlConnection.State == System.Data.ConnectionState.Closed)
                    {
                        objSqlConnection.Open();
                    }

                    SqlCommand cmd = new SqlCommand("Select dbo.zAdd_fnAdminSelIdAppByCurp(@pCurp,@pIdForm)", objSqlConnection);
                    cmd.Parameters.AddWithValue("@pCurp", _curp);
                    cmd.Parameters.AddWithValue("@pIdForm", _idForm);

                    intIdApp = (int)cmd.ExecuteScalar();

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

                return intIdApp;

            }
            catch
            {
                throw;
            }

        }
        
        public static string GetValidateCurp(string _curp, int _idForm)
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

                    SqlCommand cmd = new SqlCommand("Select dbo.zAdd_fnAdminValidateCurp(@pCurp,@pIdForm)", objSqlConnection);
                    cmd.Parameters.AddWithValue("@pCurp", _curp);
                    cmd.Parameters.AddWithValue("@pIdForm", _idForm);

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

        public static DataTable GetDataApplication(int _IdApp)
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

                SqlCommand sqlCommand = new SqlCommand("sp_EV_SelApplication", sqlConexion);
                sqlCommand.CommandType = CommandType.StoredProcedure;
                sqlCommand.Parameters.Add("@Id_Application", SqlDbType.Int).Value = _IdApp;
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(sqlCommand);

                sqlAdapter.Fill(dtsDatos, "Datos");

                dtbDatos = dtsDatos.Tables[0];

                if (dtbDatos.Rows.Count == 0)
                    throw new Exception("No se encontró los datos para la aplicación " + _IdApp.ToString());
                else
                    return dtbDatos.Copy();

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

        public static DataTable GetDataApplicationByCurp(string _curp, int _idForm)
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

                SqlCommand sqlCommand = new SqlCommand("sp_EV_SelApplicationByCurp", sqlConexion);
                sqlCommand.CommandType = CommandType.StoredProcedure;
                sqlCommand.Parameters.Add("@pIdForm", SqlDbType.NVarChar,25).Value = _curp;
                sqlCommand.Parameters.Add("@pIdForm", SqlDbType.Int).Value = _idForm;
                SqlDataAdapter sqlAdapter = new SqlDataAdapter(sqlCommand);

                sqlAdapter.Fill(dtsDatos, "Datos");

                dtbDatos = dtsDatos.Tables[0];

                if (dtbDatos.Rows.Count == 0)
                    throw new Exception("No se encontró los datos para la aplicación con curp " + _curp + " y " + _idForm.ToString());
                else
                    return dtbDatos.Copy();

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

        public static void UpdateReferEvPay(int _IdRefer,
                                           string _reference)
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

                SqlCommand cmd = new SqlCommand("sp_EV_UpPayLoadReg", objSqlConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@pIdRefer", SqlDbType.Int).Value = _IdRefer;
                cmd.Parameters.Add("@pRefer", SqlDbType.VarChar, 25).Value = _reference;

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

        public static cRetEvPay PayLoadReg(int _applicationid
                                    ,int _formid
                                    ,string _programid
                                    ,string _legalname
                                    ,string _curp
                                    ,decimal _amount
                                    ,DateTime FecLim
                                    ,string _Code_Charge
                                    ,string _aca_year
                                    ,string _aca_term
                                    ,string _aca_session
                                    ,DateTime _fechaexp)
        {
            ConnectionStringsInternoJson connectionStringsInternoJson = ConnectionStringsInternoJson.GetConnectionStringsInternoJson();
            string connectionString = connectionStringsInternoJson.ConnectionStrings.PowerCampusDbContext;
            SqlConnection objSqlConnection = new SqlConnection(connectionString);
            cRetEvPay objRetEvPay;
            try
            {
                if (objSqlConnection.State == System.Data.ConnectionState.Closed)
                {
                    objSqlConnection.Open();
                }

                SqlCommand cmd = new SqlCommand("sp_EV_PayLoadReg", objSqlConnection);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@Id_Ficha", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Parameters.Add("@Id", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmd.Parameters.Add("@Id_Application", SqlDbType.Int).Value = Convert.ToInt32(_applicationid);
                cmd.Parameters.Add("@Id_Form", SqlDbType.Int).Value = Convert.ToInt32(_formid);
                cmd.Parameters.Add("@Id_Program", SqlDbType.Int).Value = Convert.ToInt32(_programid);
                cmd.Parameters.Add("@Legal_Name", SqlDbType.VarChar).Value = _legalname;
                cmd.Parameters.Add("@CURP", SqlDbType.VarChar).Value = _curp;
                cmd.Parameters.Add("@Referencia", SqlDbType.VarChar).Value = "";
                cmd.Parameters.Add("@Amount", SqlDbType.Decimal).Value = _amount;
                cmd.Parameters.Add("@Due_Date", SqlDbType.DateTime).Value = FecLim;
                cmd.Parameters.Add("@CODE_CHARGECREDIT", SqlDbType.VarChar).Value = _Code_Charge;
                cmd.Parameters.Add("@Year", SqlDbType.VarChar).Value = _aca_year;
                cmd.Parameters.Add("@Term", SqlDbType.VarChar).Value = _aca_term;
                cmd.Parameters.Add("@Session", SqlDbType.VarChar).Value = _aca_session;
                cmd.Parameters.Add("@Create_OPID", SqlDbType.VarChar).Value = "SCT";
                cmd.Parameters.Add("@Create_Date", SqlDbType.DateTime).Value = _fechaexp;
                cmd.Parameters.Add("@create_time", SqlDbType.DateTime).Value = _fechaexp;
                cmd.Parameters.Add("@Status", SqlDbType.VarChar).Value = "Succed";

                cmd.ExecuteNonQuery();

                objRetEvPay = new cRetEvPay();

                objRetEvPay.id = Convert.ToInt32(cmd.Parameters["@Id"].Value);
                objRetEvPay.idFicha = Convert.ToInt32(cmd.Parameters["@Id"].Value);

                return objRetEvPay;

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
