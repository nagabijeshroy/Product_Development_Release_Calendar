using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProductDevReleaseCalender.Models
{
    public class ReleaseModel
    {
        public int Release_Id { get; set; }
        public int Application_Id { get; set; }
        public String Release_Name { get; set; }

        private List<ReleaseStatusModel> ReleaseStatusList = new List<ReleaseStatusModel>();
        public List<ReleaseStatusModel> releaseStatuses
        {
            set
            {
                releaseStatuses = value;
            }
            get
            {
                return ReleaseStatusList;
            }
        }
    }
}