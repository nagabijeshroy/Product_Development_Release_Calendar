using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ProductDevReleaseCalender.Models;
using System.Web.Script.Serialization;
using System.Reflection;
using Microsoft.Office.Interop.Excel;
using Excel = Microsoft.Office.Interop.Excel;
using Newtonsoft.Json.Linq;
using System.IO;
using System.Web.UI;
using System.Drawing;
using System.Text;
using GemBox.Spreadsheet;
namespace ProductDevReleaseCalender.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            Session["exportedData"] = null;
            return View("Index");
        }
        public void ShowData()
        {
            String releaseName = Request.Params["releaseName"];
            String month = Request.Params["month"];
            String year = Request.Params["year"];
            String appName = Request.Params["applicationName"];

        }
        public JsonResult GetApplications()
        {
            Applications applications = new Applications();
            return Json(applications.getAllApplications());
        }
        public void GetReleases(int Year, String Month)
        {

            Releases releases = new Releases();
            List<ApplicationModel> releaseModelsList = releases.getAllReleaseModels(Month, Year);
            JavaScriptSerializer jss = new JavaScriptSerializer();
            string output = jss.Serialize(releaseModelsList);
            Response.Write(output);
            Response.Flush();
            Response.End();
        }

        public void CreateRelease()
        {
            ReleaseModel releaseModel = new ReleaseModel();
            ReleaseStatusModel releaseStatusModel = new ReleaseStatusModel();
            String releaseName = Request.Params["releaseName"];
            String month = Request.Params["month"];
            String year = Request.Params["year"];
            String appName = Request.Params["applicationName"];
            int day = Convert.ToInt32(Request.Params["day"]);
            String releaseStatus = Request.Params["releaseStatus"];
            String Impacts = Request.Params["Impacts"];
            String TFS_Url = Request.Params["TFS_Url"];
            if (releaseName != null && month != null && year != null && appName != null)
            {
                releaseModel.Release_Name = releaseName;
                releaseModel.Application_Id = Convert.ToInt32(appName);
                Releases releases = new Releases();
                releaseStatusModel.Month = month;
                releaseStatusModel.Year = year;
                releaseStatusModel.day = day;
                releaseStatusModel.Release_Status = releaseStatus;
                releaseStatusModel.Impacts = Impacts;
                releaseStatusModel.TFS_Url = TFS_Url;
                releases.createRelease(releaseModel, releaseStatusModel);
                Response.Write(releaseName + month + year + appName);
            }
        }
        public void UpdateRelease(String releaseName, String month, int year, int applicationId, int releaseId)
        {
            ReleaseModel releaseModel = new ReleaseModel();
            releaseModel.Application_Id = applicationId;
            releaseModel.Release_Name = releaseName;
            releaseModel.Release_Id = releaseId;
            Releases releases = new Releases();
            releases.updateRelease(releaseModel);
        }
        //public JsonResult GetRelease(int releaseId)
        //{
        //    ReleaseModel releaseModel = new ReleaseModel();
        //    Releases releases = new Releases();
        //    return Json(releases.getReleaseModel(releaseModel));
        //}
        public void DeleteRelease(int releaseId)
        {
            ReleaseModel releaseModel = new ReleaseModel();
            releaseModel.Release_Id = releaseId;
            Releases releases = new Releases();
            releases.deleteRelease(releaseModel);
        }
        public void CreateReleaseStatus(int releaseId, String status, int day, String Month, String Year, String impacts, String TFSUrl)
        {
            ReleaseStatusModel releaseStatusModel = new ReleaseStatusModel();
            releaseStatusModel.Release_Id = releaseId;
            releaseStatusModel.Release_Status = status;
            releaseStatusModel.day = day;
            releaseStatusModel.Month = Month;
            releaseStatusModel.Year = Year;
            releaseStatusModel.Impacts = impacts;
            releaseStatusModel.TFS_Url = TFSUrl;
            ReleaseStatuses releaseStatuses = new ReleaseStatuses();
            releaseStatuses.createReleaseStatus(releaseStatusModel);
        }
        public void UpdateReleaseStatus(int releaseStatusId, String status, int day, String Month, String Year, String impacts, String TFSUrl)
        {
            ReleaseStatusModel releaseStatusModel = new ReleaseStatusModel();
            releaseStatusModel.Release_Status_Id = releaseStatusId;
            releaseStatusModel.Release_Status = status;
            releaseStatusModel.day = day;
            releaseStatusModel.Month = Month;
            releaseStatusModel.Year = Year;
            releaseStatusModel.Impacts = impacts;
            releaseStatusModel.TFS_Url = TFSUrl;
            ReleaseStatuses releaseStatuses = new ReleaseStatuses();
            releaseStatuses.updateReleaseStatus(releaseStatusModel);
        }
        public void DeleteReleaseStatus(int releaseStatusId)
        {
            ReleaseStatusModel releaseStatusModel = new ReleaseStatusModel();
            releaseStatusModel.Release_Status_Id = releaseStatusId;
            ReleaseStatuses releaseStatuses = new ReleaseStatuses();
            releaseStatuses.deleteReleaseStatus(releaseStatusModel);
        }
        public void GetReleaseStatus(int releaseStatusId)
        {
            ReleaseStatusModel releaseStatusModel = new ReleaseStatusModel();
            releaseStatusModel.Release_Status_Id = releaseStatusId;
            ReleaseStatuses releaseStatuses = new ReleaseStatuses();
            JavaScriptSerializer jss = new JavaScriptSerializer();
            string output = jss.Serialize(releaseStatuses.getReleaseStatus(releaseStatusModel));
            Response.Write(output);
            Response.Flush();
            Response.End();
        }
        public void searchReleases(int applicationId, int allReleases)
        {
            Releases releases = new Releases();
            List<ApplicationModel> releaseModelsList = releases.searchReleases(applicationId, allReleases);
            JavaScriptSerializer jss = new JavaScriptSerializer();
            string output = jss.Serialize(releaseModelsList);
            Response.Write(output);
            Response.Flush();
            Response.End();
        }
        public void GetReleaseStatusReleaseId(int releaseId)
        {
            ReleaseStatuses releaseStatuses = new ReleaseStatuses();
            JavaScriptSerializer jss = new JavaScriptSerializer();
            string output = jss.Serialize(releaseStatuses.getReleaseStatusReleaseId(releaseId));
            Response.Write(output);
            Response.Flush();
            Response.End();
        }
        public void CheckDateConflict(int releaseId, int day, String month, int year)
        {
            ReleaseStatusModel releaseStatus = new ReleaseStatusModel();
            releaseStatus.Release_Id = releaseId;
            releaseStatus.day = day;
            releaseStatus.Year = year + "";
            releaseStatus.Month = month;
            ReleaseStatuses releaseStatuses = new ReleaseStatuses();
            JavaScriptSerializer jss = new JavaScriptSerializer();
            string output = jss.Serialize(releaseStatuses.checkDateConflict(releaseStatus));
            Response.Write(output);
            Response.Flush();
            Response.End();
        }
        public void ExportDataToExcel(int applicationId, int allReleases)
        {
            Releases releases = new Releases();
            List<ApplicationModel> releaseModelsList = releases.searchReleases(applicationId, allReleases);
            Session["exportedData"] = releaseModelsList;
            JavaScriptSerializer jss = new JavaScriptSerializer();
            string output = jss.Serialize(releaseModelsList);
            Response.Write(output);
            Response.Flush();
            Response.End();
        }
        public FileContentResult DownloadExcel()
        {
            String data = "";
            List<ApplicationModel> releaseModelsList = null;
            if (Session["exportedData"] != null)
            {
                data = Session["exportedData"].ToString();
                releaseModelsList = (List<ApplicationModel>)Session["exportedData"];
                SpreadsheetInfo.SetLicense("FREE-LIMITED-KEY");
                ExcelFile ef = ExcelFile.Load(Server.MapPath(@"~/App_Data/TemplateUse.xlsx"));
                ExcelWorksheet ws = ef.Worksheets[0];
                ws.Columns[0].Width = 30 * 256;
                ws.Columns[1].Width = 14 * 256;
                ws.Columns[2].Width = 20 * 256;
                ws.Columns[3].Width = 20 * 256;
                ws.Columns[4].Width = 14 * 256;
                ws.Columns[5].Width = 20 * 256;
                ws.Columns[6].Width = 20 * 256;
                ws.Columns[7].Width = 14 * 256;
                ws.Columns[8].Width = 20 * 256;
                ws.Columns[9].Width = 20 * 256;
                ws.Columns[10].Width = 14 * 256;
                ws.Columns[11].Width = 20 * 256;
                ws.Columns[12].Width = 20 * 256;
                ws.Cells["A1"].Value = "NAME";
                ws.Cells["A1"].Style.Font.Weight = ExcelFont.BoldWeight;
                ws.Cells["A1"].Style.Font.Color = SpreadsheetColor.FromName(ColorName.LightBlue);
                ws.Cells["A1"].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
                ws.Cells["B1"].Value = "DEV";
                ws.Cells["B1"].Style.Font.Weight = ExcelFont.BoldWeight;
                ws.Cells["B1"].Style.Font.Color = SpreadsheetColor.FromName(ColorName.DarkRed);
                ws.Cells["B1"].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
                ws.Cells["C1"].Value = "IMPACTS";
                ws.Cells["C1"].Style.Font.Weight = ExcelFont.BoldWeight;
                ws.Cells["C1"].Style.Font.Color = SpreadsheetColor.FromName(ColorName.Red);
                ws.Cells["C1"].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
                ws.Cells["D1"].Value = "URL";
                ws.Cells["D1"].Style.Font.Weight = ExcelFont.BoldWeight;
                ws.Cells["D1"].Style.Font.Color = SpreadsheetColor.FromName(ColorName.Purple);
                ws.Cells["D1"].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
                ws.Cells["E1"].Value = "TEST";
                ws.Cells["E1"].Style.Font.Weight = ExcelFont.BoldWeight;
                ws.Cells["E1"].Style.Font.Color = SpreadsheetColor.FromName(ColorName.DarkRed);
                ws.Cells["E1"].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
                ws.Cells["F1"].Value = "IMPACTS";
                ws.Cells["F1"].Style.Font.Weight = ExcelFont.BoldWeight;
                ws.Cells["F1"].Style.Font.Color = SpreadsheetColor.FromName(ColorName.Red);
                ws.Cells["F1"].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
                ws.Cells["G1"].Value = "URL";
                ws.Cells["G1"].Style.Font.Weight = ExcelFont.BoldWeight;
                ws.Cells["G1"].Style.Font.Color = SpreadsheetColor.FromName(ColorName.Purple);
                ws.Cells["G1"].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
                ws.Cells["H1"].Value = "STAGE";
                ws.Cells["H1"].Style.Font.Weight = ExcelFont.BoldWeight;
                ws.Cells["H1"].Style.Font.Color = SpreadsheetColor.FromName(ColorName.DarkRed);
                ws.Cells["H1"].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
                ws.Cells["I1"].Value = "IMPACTS";
                ws.Cells["I1"].Style.Font.Weight = ExcelFont.BoldWeight;
                ws.Cells["I1"].Style.Font.Color = SpreadsheetColor.FromName(ColorName.Red);
                ws.Cells["I1"].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
                ws.Cells["J1"].Value = "URL";
                ws.Cells["J1"].Style.Font.Weight = ExcelFont.BoldWeight;
                ws.Cells["J1"].Style.Font.Color = SpreadsheetColor.FromName(ColorName.Purple);
                ws.Cells["J1"].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
                ws.Cells["K1"].Value = "LIVE";
                ws.Cells["K1"].Style.Font.Weight = ExcelFont.BoldWeight;
                ws.Cells["K1"].Style.Font.Color = SpreadsheetColor.FromName(ColorName.DarkRed);
                ws.Cells["K1"].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
                ws.Cells["L1"].Value = "IMPACTS";
                ws.Cells["L1"].Style.Font.Weight = ExcelFont.BoldWeight;
                ws.Cells["L1"].Style.Font.Color = SpreadsheetColor.FromName(ColorName.Red);
                ws.Cells["L1"].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
                ws.Cells["M1"].Value = "URL";
                ws.Cells["M1"].Style.Font.Weight = ExcelFont.BoldWeight;
                ws.Cells["M1"].Style.Font.Color = SpreadsheetColor.FromName(ColorName.Purple);
                ws.Cells["M1"].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
                int i = 1;
                foreach (ApplicationModel applicationModel in releaseModelsList)
                {
                    if (applicationModel.releasesList.Count != 0)
                    {
                        i++;
                        ws.Cells["A" + i].Value = applicationModel.Application_Name;
                        ws.Cells["A" + i].Style.Font.Color = SpreadsheetColor.FromName(ColorName.DarkRed);
                        ws.Cells["A" + i].Style.Font.Weight = ExcelFont.BoldWeight;
                        ws.Cells["A" + i].Style.WrapText = true;
                        ws.Cells["B" + i].Value = "";
                        ws.Cells["C" + i].Value = "";
                        ws.Cells["D" + i].Value = "";
                        ws.Cells["E" + i].Value = "";
                        ws.Cells["F" + i].Value = "";
                        ws.Cells["G" + i].Value = "";
                        ws.Cells["H" + i].Value = "";
                        ws.Cells["I" + i].Value = "";
                        ws.Cells["J" + i].Value = "";
                        ws.Cells["K" + i].Value = "";
                        ws.Cells["L" + i].Value = "";
                        ws.Cells["M" + i].Value = "";
                        foreach (ReleaseModel releaseModel in applicationModel.releasesList)
                        {
                            if (releaseModel.releaseStatuses.Count != 0)
                            {
                                i++;
                                ws.Cells["A" + i].Value = releaseModel.Release_Name;
                                ws.Cells["A" + i].Style.WrapText = true;
                                ws.Cells["A" + i].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
                                ws.Cells["A" + i].Style.Font.Color = SpreadsheetColor.FromName(ColorName.Blue);
                                ws.Cells["A" + i].Style.Font.Weight = ExcelFont.BoldWeight;
                                for (int s = 0; s < releaseModel.releaseStatuses.Count; s++)
                                {
                                    switch (releaseModel.releaseStatuses[s].Release_Status)
                                    {
                                        case "DEV":
                                            ws.Cells["B" + i].Value = releaseModel.releaseStatuses[s].Month + " " + releaseModel.releaseStatuses[s].day + ", " + releaseModel.releaseStatuses[s].Year;
                                            ws.Cells["B" + i].Style.WrapText = true;
                                            ws.Cells["C" + i].Value = releaseModel.releaseStatuses[s].Impacts;
                                            ws.Cells["C" + i].Style.WrapText = true;
                                            ws.Cells["D" + i].Value = releaseModel.releaseStatuses[s].TFS_Url;
                                            ws.Cells["D" + i].Style.WrapText = true;
                                            break;
                                        case "TEST":
                                            ws.Cells["E" + i].Value = releaseModel.releaseStatuses[s].Month + " " + releaseModel.releaseStatuses[s].day + ", " + releaseModel.releaseStatuses[s].Year;
                                            ws.Cells["E" + i].Style.WrapText = true;
                                            ws.Cells["F" + i].Value = releaseModel.releaseStatuses[s].Impacts;
                                            ws.Cells["F" + i].Style.WrapText = true;
                                            ws.Cells["G" + i].Value = releaseModel.releaseStatuses[s].TFS_Url;
                                            ws.Cells["G" + i].Style.WrapText = true;
                                            break;
                                        case "STAGE":
                                            ws.Cells["H" + i].Value = releaseModel.releaseStatuses[s].Month + " " + releaseModel.releaseStatuses[s].day + ", " + releaseModel.releaseStatuses[s].Year;
                                            ws.Cells["H" + i].Style.WrapText = true;
                                            ws.Cells["I" + i].Value = releaseModel.releaseStatuses[s].Impacts;
                                            ws.Cells["I" + i].Style.WrapText = true;
                                            ws.Cells["J" + i].Value = releaseModel.releaseStatuses[s].TFS_Url;
                                            ws.Cells["J" + i].Style.WrapText = true;
                                            break;
                                        case "LIVE":
                                            ws.Cells["K" + i].Value = releaseModel.releaseStatuses[s].Month + " " + releaseModel.releaseStatuses[s].day + ", " + releaseModel.releaseStatuses[s].Year;
                                            ws.Cells["K" + i].Style.WrapText = true;
                                            ws.Cells["L" + i].Value = releaseModel.releaseStatuses[s].Impacts;
                                            ws.Cells["L" + i].Style.WrapText = true;
                                            ws.Cells["M" + i].Value = releaseModel.releaseStatuses[s].TFS_Url;
                                            ws.Cells["M" + i].Style.WrapText = true;
                                            break;
                                    }
                                }
                            }
                        }
                    }
                }
                String path = Server.MapPath(@"~/App_Data");
                ef.Save(path + "/Product Development Release Calender Data.xlsx");
                Session["exportedData"] = null;
                var fullPathToFile = Server.MapPath("~/App_Data/Product Development Release Calender Data.xlsx");
                var mimeType = "application/vnd.ms-excel";
                var fileContents = System.IO.File.ReadAllBytes(fullPathToFile);

                return new FileContentResult(fileContents, mimeType)
                {
                    FileDownloadName = Path.GetFileName(fullPathToFile)
                };
            }
            else
            {
                data = "No Data To Export";
            }
            return null;
        }
        public FileContentResult GetFile()
        {
            var fullPathToFile = Server.MapPath("~/App_Data/test.pdf");
            var mimeType = "application/pdf";
            var fileContents = System.IO.File.ReadAllBytes(fullPathToFile);

            return new FileContentResult(fileContents, mimeType)
            {
                FileDownloadName = Path.GetFileName(fullPathToFile)
            };
        }

    }
}
