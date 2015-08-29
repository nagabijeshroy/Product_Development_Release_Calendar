using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ProductDevReleaseCalender.Models
{
    public class ApplicationModel
    {
        public String Application_Name { get; set; }
        public int Application_Id { get; set; }
        private List<ReleaseModel> releaseList = new List<ReleaseModel>();
        public List<ReleaseModel> releasesList
        {
            set
            {
                releasesList = value;
            }
            get
            {
                return releaseList;
            }
            
        }
    }
}