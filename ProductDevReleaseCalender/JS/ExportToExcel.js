function exportToExcel() {
    var applicationId = $("#appName").val();
    if (applicationId == "all") {
        allReleases = 1;
    } else {
        allReleases = 0;
    }
    if (applicationId != "") {
        $.ajax({
            cache: false,
            url: "Home/ExcelExport",
            data: { "applicationId": applicationId },
            method: "POST",
            dataType: 'json',
            success: function (responseText) {
                var str = JSON.stringify(responseText);
                //console.log(str);
                if (str.length > 2) {
                    window.location = 'Home/Download?file=' + returnValue;
                }
            },
            error: function () {
                
            }
        });
    }
}