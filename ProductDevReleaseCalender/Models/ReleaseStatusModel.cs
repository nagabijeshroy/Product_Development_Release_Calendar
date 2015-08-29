using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProductDevReleaseCalender.Models
{
    public class ReleaseStatusModel
    {
        public int Release_Status_Id { get; set; }
        public int Release_Id { get; set; }
        public String Release_Status { get; set; }
        public int day { get; set; }
        public String Month { get; set; }
        public String Year { get; set; }
        public String Impacts { get; set; }
        public String TFS_Url { get; set; }
    }
}