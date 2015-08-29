using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;

namespace ProductDevReleaseCalender.Models
{
    public class Releases
    {
        private static string connStr = ConfigurationManager.ConnectionStrings["pdrcConnectionString"].ToString();
        private SqlConnection conn = new SqlConnection(connStr);
        private SqlCommand cmd;
        public Releases()
        {
            connStr = ConfigurationManager.ConnectionStrings["pdrcConnectionString"].ToString();
            conn = new SqlConnection(connStr);
        }
        public void createRelease(ReleaseModel releaseModel, ReleaseStatusModel releaseStatusModel)
        {
            cmd = new SqlCommand("Insert_Release", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@Release_Name", SqlDbType.VarChar).Value = releaseModel.Release_Name;
            cmd.Parameters.Add("@Application_Id", SqlDbType.Int).Value = releaseModel.Application_Id;
            try
            {
                if (conn.State != ConnectionState.Open)
                conn.Open();
                if (cmd.ExecuteNonQuery() != 0)
                {
                    releaseModel = getReleaseModel();
                    if (releaseModel != null)
                    {
                        ReleaseStatuses releaseStatuses = new ReleaseStatuses();
                        releaseStatusModel.Release_Id = releaseModel.Release_Id;
                        releaseStatuses.createReleaseStatus(releaseStatusModel);
                    }
                }
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
        public ReleaseModel updateRelease(ReleaseModel releaseModel)
        {
            cmd = new SqlCommand("Update_Release", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@Release_Id", SqlDbType.Int).Value = releaseModel.Release_Id;
            cmd.Parameters.Add("@Release_Name", SqlDbType.VarChar).Value = releaseModel.Release_Name;
            cmd.Parameters.Add("@Application_Id", SqlDbType.Int).Value = releaseModel.Application_Id;
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
            return releaseModel;
        }
        public Boolean deleteRelease(ReleaseModel releaseModel)
        {
            cmd = new SqlCommand("Delete_Release", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            cmd.Parameters.Add("@Release_Id", SqlDbType.Int).Value = releaseModel.Release_Id;
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
        public ReleaseModel getReleaseModel()
        {
            cmd = new SqlCommand("Select_Release", conn);
            cmd.CommandType = CommandType.StoredProcedure;
            ReleaseModel releaseModel = new ReleaseModel();
            SqlDataReader reader = null;
            try
            {
                if (conn.State != ConnectionState.Open)
                conn.Open();
                reader = cmd.ExecuteReader();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        releaseModel.Release_Name = reader["Release_Name"].ToString();
                        releaseModel.Release_Id = Convert.ToInt32(reader["Release_Id"].ToString());
                        releaseModel.Application_Id = Convert.ToInt32(reader["Application_Id"]);
                    }
                }
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
            return releaseModel;
        }
        public List<ApplicationModel> getAllReleaseModels(String month, int year)
        {
            List<ApplicationModel> applicationsList = new List<ApplicationModel>();
            List<ApplicationModel> applicationsList2 = new List<ApplicationModel>();
            ApplicationModel appModel = new ApplicationModel();
            appModel.Application_Id = 200001;
            appModel.Application_Name = "A - Amgen VirMedica";
            applicationsList.Add(appModel);
            appModel = new ApplicationModel();
            appModel.Application_Id = 200002;
            appModel.Application_Name = "A - Novartis";
            applicationsList.Add(appModel);
            appModel = new ApplicationModel();
            appModel.Application_Id = 200003;
            appModel.Application_Name = "A - Clinical PPRP";
            applicationsList.Add(appModel);
            appModel = new ApplicationModel();
            appModel.Application_Id = 200004;
            appModel.Application_Name = "A - Genzyme";
            applicationsList.Add(appModel);
            appModel = new ApplicationModel();
            appModel.Application_Id = 200005;
            appModel.Application_Name = "A - PANF Portal";
            applicationsList.Add(appModel);
            appModel = new ApplicationModel();
            appModel.Application_Id = 200006;
            appModel.Application_Name = "A - eBR";
            applicationsList.Add(appModel);
            appModel = new ApplicationModel();
            appModel.Application_Id = 200007;
            appModel.Application_Name = "A - RxRescue";
            applicationsList.Add(appModel);
            appModel = new ApplicationModel();
            appModel.Application_Id = 200008;
            appModel.Application_Name = "A - Provider Portal";
            applicationsList.Add(appModel);
            appModel = new ApplicationModel();
            appModel.Application_Id = 200009;
            appModel.Application_Name = "A - Reporting Portal";
            applicationsList.Add(appModel);
            appModel = new ApplicationModel();
            appModel.Application_Id = 200010;
            appModel.Application_Name = "A - Web Configuration Tool";
            applicationsList.Add(appModel);
            appModel = new ApplicationModel();
            appModel.Application_Id = 200011;
            appModel.Application_Name = "A - Site Locator";
            applicationsList.Add(appModel);
            appModel = new ApplicationModel();
            appModel.Application_Id = 200012;
            appModel.Application_Name = "A - Patient Plus";
            applicationsList.Add(appModel);
            Boolean flag = false;
            if (conn.State != ConnectionState.Open)
                conn.Open();
            // List<ReleaseModel> allReleasesList = new List<ReleaseModel>();
            foreach (ApplicationModel applicationModel in applicationsList)
            {
                ApplicationModel appMod = new ApplicationModel();
                appMod.Application_Id = applicationModel.Application_Id;
                appMod.Application_Name = applicationModel.Application_Name;
                cmd = new SqlCommand("Select_All_Releases_Month_Year", conn);
                cmd.Parameters.Clear();
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@Application_Id", SqlDbType.Int).Value = applicationModel.Application_Id;
                SqlDataReader reader = null;
                SqlDataReader read = null;
                try
                {                  
                    reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            ReleaseModel releaseModel = new ReleaseModel();
                            releaseModel.Application_Id = Convert.ToInt32(reader["Application_Id"].ToString());
                            releaseModel.Release_Name = reader["Release_Name"].ToString();
                            releaseModel.Release_Id = Convert.ToInt32(reader["Release_Id"]);
                            SqlCommand command = new SqlCommand("Select_All_Release_Statuses_Release_Id", conn);
                            command.CommandType = CommandType.StoredProcedure;
                            command.Parameters.Add("@Release_Id", SqlDbType.Int).Value = releaseModel.Release_Id;
                            command.Parameters.Add("@Month", SqlDbType.VarChar).Value = month;
                            command.Parameters.Add("@Year", SqlDbType.VarChar).Value = year + "";
                            try
                            {
                                read = command.ExecuteReader();
                                if (read.HasRows)
                                {
                                    while (read.Read())
                                    {
                                        flag = true;
                                        ReleaseStatusModel releaseStatus = new ReleaseStatusModel();
                                        releaseStatus.Release_Status_Id = Convert.ToInt32(read["Release_Status_Id"].ToString());
                                        releaseStatus.Release_Status = read["Release_Status"].ToString();
                                        releaseStatus.Release_Id = Convert.ToInt32(read["Release_Id"].ToString());
                                        releaseStatus.day = Convert.ToInt32(read["Day_of_Release"].ToString());
                                        releaseStatus.Month = read["Month"].ToString();
                                        releaseStatus.Year = read["Year"].ToString();
                                        releaseModel.releaseStatuses.Add(releaseStatus);
                                    }
                                }
                            }
                            catch (SqlException ex)
                            {
                                Console.WriteLine(ex.Message);
                            }
                            appMod.releasesList.Add(releaseModel);
                        }
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
                    if (reader != null && reader.IsClosed == false)
                    {
                        reader.Close();
                    }
                    

                }
                if (flag)
                {
                    applicationsList2.Add(appMod);
                    flag = false;
                }
            }
            if (conn.State == ConnectionState.Open)
            {
                conn.Close();
            }
            return applicationsList2;
        }
        public List<ApplicationModel> searchReleases(int applicationId, int allReleases)
        {
            List<ApplicationModel> applicationsList = new List<ApplicationModel>();
            List<ApplicationModel> applicationsList2 = new List<ApplicationModel>();
            ApplicationModel appModel = new ApplicationModel();
            appModel.Application_Id = 200001;
            appModel.Application_Name = "A - Amgen VirMedica";
            applicationsList.Add(appModel);
            appModel = new ApplicationModel();
            appModel.Application_Id = 200002;
            appModel.Application_Name = "A - Novartis";
            applicationsList.Add(appModel);
            appModel = new ApplicationModel();
            appModel.Application_Id = 200003;
            appModel.Application_Name = "A - Clinical PPRP";
            applicationsList.Add(appModel);
            appModel = new ApplicationModel();
            appModel.Application_Id = 200004;
            appModel.Application_Name = "A - Genzyme";
            applicationsList.Add(appModel);
            appModel = new ApplicationModel();
            appModel.Application_Id = 200005;
            appModel.Application_Name = "A - PANF Portal";
            applicationsList.Add(appModel);
            appModel = new ApplicationModel();
            appModel.Application_Id = 200006;
            appModel.Application_Name = "A - eBR";
            applicationsList.Add(appModel);
            appModel = new ApplicationModel();
            appModel.Application_Id = 200007;
            appModel.Application_Name = "A - RxRescue";
            applicationsList.Add(appModel);
            appModel = new ApplicationModel();
            appModel.Application_Id = 200008;
            appModel.Application_Name = "A - Provider Portal";
            applicationsList.Add(appModel);
            appModel = new ApplicationModel();
            appModel.Application_Id = 200009;
            appModel.Application_Name = "A - Reporting Portal";
            applicationsList.Add(appModel);
            appModel = new ApplicationModel();
            appModel.Application_Id = 200010;
            appModel.Application_Name = "A - Web Configuration Tool";
            applicationsList.Add(appModel);
            appModel = new ApplicationModel();
            appModel.Application_Id = 200011;
            appModel.Application_Name = "A - Site Locator";
            applicationsList.Add(appModel);
            appModel = new ApplicationModel();
            appModel.Application_Id = 200012;
            appModel.Application_Name = "A - Patient Plus";
            applicationsList.Add(appModel);
            Boolean flag = false;
            // List<ReleaseModel> allReleasesList = new List<ReleaseModel>();
            if (conn.State != ConnectionState.Open)
                conn.Open();
            foreach (ApplicationModel applicationModel in applicationsList)
            {
                if (applicationModel.Application_Id == applicationId || allReleases != 0)
                {
                    ApplicationModel appMod = new ApplicationModel();
                    appMod.Application_Id = applicationModel.Application_Id;
                    appMod.Application_Name = applicationModel.Application_Name;
                    cmd = new SqlCommand("Select_Release_Application", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@Application_Id", SqlDbType.Int).Value = applicationModel.Application_Id;
                    cmd.Parameters.Add("@All_Releases", SqlDbType.Int).Value = applicationModel.Application_Id;
                    SqlDataReader reader = null;
                    SqlDataReader read = null;
                    try
                    {
                        read = null;
                        reader = cmd.ExecuteReader();
                        if (reader.HasRows)
                        {
                            while (reader.Read())
                            {
                                ReleaseModel releaseModel = new ReleaseModel();
                                releaseModel.Application_Id = Convert.ToInt32(reader["Application_Id"].ToString());
                                releaseModel.Release_Name = reader["Release_Name"].ToString();
                                releaseModel.Release_Id = Convert.ToInt32(reader["Release_Id"]);
                                SqlCommand command = new SqlCommand("Search_All_Release_Statuses_Release_Id", conn);
                                command.CommandType = CommandType.StoredProcedure;
                                command.Parameters.Add("@Release_Id", SqlDbType.Int).Value = releaseModel.Release_Id;
                                try
                                {
                                    read = null;
                                    read = command.ExecuteReader();
                                    if (read.HasRows)
                                    {
                                        while (read.Read())
                                        {
                                            flag = true;
                                            ReleaseStatusModel releaseStatus = new ReleaseStatusModel();
                                            releaseStatus.Release_Status_Id = Convert.ToInt32(read["Release_Status_Id"].ToString());
                                            releaseStatus.Release_Status = read["Release_Status"].ToString();
                                            releaseStatus.Release_Id = Convert.ToInt32(read["Release_Id"].ToString());
                                            releaseStatus.day = Convert.ToInt32(read["Day_of_Release"].ToString());
                                            releaseStatus.Month = read["Month"].ToString();
                                            releaseStatus.Year = read["Year"].ToString();
                                            releaseStatus.Impacts = read["Impacts"].ToString();
                                            releaseStatus.TFS_Url = read["TFS_Url"].ToString();
                                            releaseModel.releaseStatuses.Add(releaseStatus);
                                        }
                                    }
                                }
                                catch (SqlException ex)
                                {
                                    Console.WriteLine(ex.Message);
                                }
                                appMod.releasesList.Add(releaseModel);
                            }
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
                        if (reader != null && reader.IsClosed == false)
                        {
                            reader.Close();
                        }
                        
                    }
                    if (flag)
                    {
                        applicationsList2.Add(appMod);
                        flag = false;
                    }
                }
            }
            if (conn.State == ConnectionState.Open)
            {
                conn.Close();
            }
            return applicationsList2;
        }
    }
}