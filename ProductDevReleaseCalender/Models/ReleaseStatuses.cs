using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
namespace ProductDevReleaseCalender.Models
{
    public class ReleaseStatuses
    {
        
        private static string connStr = ConfigurationManager.ConnectionStrings["pdrcConnectionString"].ToString();
        private  SqlConnection conn = new SqlConnection(connStr);
        private SqlCommand cmd;
        List<ReleaseStatusModel> releaseStatusList = new List<ReleaseStatusModel>();
        public ReleaseStatuses()
        {
            connStr = ConfigurationManager.ConnectionStrings["pdrcConnectionString"].ToString();
            conn = new SqlConnection(connStr);
        }
        public void createReleaseStatus(ReleaseStatusModel releaseStatusModel)
        {
            cmd = new SqlCommand("Insert_Release_Status", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@Release_Status", SqlDbType.VarChar).Value = releaseStatusModel.Release_Status;
            cmd.Parameters.Add("@Day_of_Release", SqlDbType.Int).Value = releaseStatusModel.day;
            cmd.Parameters.Add("@Release_Id", SqlDbType.Int).Value = releaseStatusModel.Release_Id;
            cmd.Parameters.Add("@Month", SqlDbType.VarChar).Value = releaseStatusModel.Month;
            cmd.Parameters.Add("@Year", SqlDbType.Int).Value = Convert.ToInt32(releaseStatusModel.Year);
            cmd.Parameters.Add("@Impacts", SqlDbType.VarChar).Value = releaseStatusModel.Impacts;
            cmd.Parameters.Add("@TFS_Url", SqlDbType.VarChar).Value = releaseStatusModel.TFS_Url;
            try
            {
                if (conn.State != ConnectionState.Open)
                conn.Open();
                cmd.ExecuteNonQuery();
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                if (conn.State == ConnectionState.Open)
                {
                    conn.Close();
                }
            }
        }
        public Boolean updateReleaseStatus(ReleaseStatusModel releaseStatusModel)
        {
            cmd = new SqlCommand("Update_Release_Status", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@Release_Status", SqlDbType.VarChar).Value = releaseStatusModel.Release_Status;
            cmd.Parameters.Add("@Day_of_Release", SqlDbType.Int).Value = releaseStatusModel.day;
            cmd.Parameters.Add("@Release_Status_Id", SqlDbType.Int).Value = releaseStatusModel.Release_Status_Id;
            cmd.Parameters.Add("@Month", SqlDbType.VarChar).Value = releaseStatusModel.Month;
            cmd.Parameters.Add("@Year", SqlDbType.Int).Value = Convert.ToInt32(releaseStatusModel.Year);
            cmd.Parameters.Add("@Impacts", SqlDbType.VarChar).Value = releaseStatusModel.Impacts;
            cmd.Parameters.Add("@TFS_Url", SqlDbType.VarChar).Value = releaseStatusModel.TFS_Url;
            Boolean status = false;
            try
            {
                if (conn.State != ConnectionState.Open)
                conn.Open();
                status = cmd.ExecuteNonQuery() == 1;
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                if (conn.State == ConnectionState.Open)
                {
                    conn.Close();
                }
            }
            return status;
        }
        public Boolean deleteReleaseStatus(ReleaseStatusModel releaseStatusModel)
        {
            cmd = new SqlCommand("Delete_Release_Status", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@Release_Status_Id", SqlDbType.Int).Value = releaseStatusModel.Release_Status_Id;
            Boolean status = false;
            try
            {
                if (conn.State != ConnectionState.Open)
                conn.Open();
                status = cmd.ExecuteNonQuery() == 1;
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                if (conn.State == ConnectionState.Open)
                {
                    conn.Close();
                }
            }
            return status;
        }
        public ReleaseStatusModel getReleaseStatus(ReleaseStatusModel releaseStatusModel)
        {
            SqlCommand command = new SqlCommand("Select_Release_Status", conn);
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.Add("@Release_Status_Id", SqlDbType.Int).Value = releaseStatusModel.Release_Status_Id;
            SqlDataReader read = null;
            try
            {
                if (conn.State != ConnectionState.Open)
                conn.Open();
                read = command.ExecuteReader();
                while (read.Read())
                {
                    releaseStatusModel.Release_Status_Id = Convert.ToInt32(read["Release_Status_Id"].ToString());
                    releaseStatusModel.Release_Status = read["Release_Status"].ToString();
                    releaseStatusModel.Release_Id = Convert.ToInt32(read["Release_Id"].ToString());
                    releaseStatusModel.day = Convert.ToInt32(read["Day_of_Release"].ToString());
                    releaseStatusModel.Month = read["Month"].ToString();
                    releaseStatusModel.Year = read["Year"].ToString();
                    releaseStatusModel.Impacts = read["Impacts"].ToString();
                    releaseStatusModel.TFS_Url = read["TFS_Url"].ToString();
                }
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
               
                if(read != null && read.IsClosed == false){
                    read.Close();
                }
                if (conn.State == ConnectionState.Open)
                {
                    conn.Close();
                }
            }
            return releaseStatusModel;
        }
        public List<String> getReleaseStatusReleaseId(int releaseId)
        {
            cmd = new SqlCommand("Select_Release_Status_Release_Id", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataReader read = null;
            cmd.Parameters.Add("@Release_Id", SqlDbType.Int).Value = releaseId;
            List<String> releaseStatuses = new List<string>();
            try
            {
                if (conn.State != ConnectionState.Open)
                conn.Open();
                read = cmd.ExecuteReader();
                while (read.Read())
                {
                    releaseStatuses.Add(read["Release_Status"].ToString());
                }
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {

                if (read != null && read.IsClosed == false)
                {
                    read.Close();
                }
                if (conn.State == ConnectionState.Open)
                {
                    conn.Close();
                }
            }
            return releaseStatuses;
        }
        public ReleaseStatusModel checkDateConflict(ReleaseStatusModel releaseStatus)
        {
            cmd = new SqlCommand("Check_Date_Conflict", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            SqlDataReader read = null;
            cmd.Parameters.Add("@Release_Id", SqlDbType.Int).Value = releaseStatus.Release_Id;
            cmd.Parameters.Add("@Month", SqlDbType.VarChar).Value = releaseStatus.Month;
            cmd.Parameters.Add("@Year", SqlDbType.Int).Value = Convert.ToInt32(releaseStatus.Year);
            cmd.Parameters.Add("@Day_of_Release", SqlDbType.Int).Value = releaseStatus.day;
            try
            {
                if (conn.State != ConnectionState.Open)
                conn.Open();
                read = cmd.ExecuteReader();
                while (read.Read())
                {
                    releaseStatus.Release_Status = read["Release_Status"].ToString();
                    releaseStatus.Month = read["Month"].ToString();
                    releaseStatus.Year = read["Year"].ToString();
                    releaseStatus.Release_Id = Convert.ToInt32(read["Release_Id"].ToString());
                }
            }
            catch (SqlException ex)
            {
                Console.WriteLine(ex.Message);
            }
            finally
            {
                if (read != null && read.IsClosed == false)
                {
                    read.Close();
                }
                if (conn.State == ConnectionState.Open)
                {
                    conn.Close();
                }
            }
            return releaseStatus;
        }
    }
}