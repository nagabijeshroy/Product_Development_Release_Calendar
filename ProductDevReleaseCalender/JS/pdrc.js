function showPop() {
    $('#dialog2').html('<img src="http://preloaders.net/preloaders/287/Filling%20broken%20ring.gif"> loading...');
    var yearValue = $("#YearDropDownList").val();
    var monthValue = $("#MonthDropDownList").val();
    var htmlText = "";
    var apps = ["A - Amgen VirMedica", "A - Novartis", "A - Clinical PPRP", "A - Genzyme", "A - PANF Portal", "A - eBR", "A - RxRescue", "A - Provider Portal", "A - Reporting Portal", "A - Web Configuration Tool", "A - Site Locator", "A - Patient Plus"];
    htmlText += '<option Value="" >Select Month</option>' +
                            '<option Value="JAN" > JAN </option>' +
                            '<option Value="FEB" > FEB </option>' +
                            '<option Value="MAR" > MAR </option>' +
                            '<option Value="APR" > APR </option>' +
                            '<option Value="MAY" > MAY </option>' +
                            '<option Value="JUNE" > JUNE </option>' +
                            '<option Value="JULY" > JULY </option>' +
                            '<option Value="AUG" > AUG </option>' +
                            '<option Value="SEP" > SEP </option>' +
                            '<option Value="OCT" > OCT </option>' +
                            '<option Value="NOV" > NOV </option>' +
                            '<option Value="DEC" > DEC </option>';
    var htmlTextYear = "";
    htmlTextYear += '<option value="">Select Year</option>';
    for (var i = 2015; i < 2021; i++) {
        htmlTextYear += '<option value="' + i + '">' + i + '</option>';
    }
    var errorText = "";
    $(function () {
        var applnText = "";
        applnText += '<option value="">Select Application</option>';
        var a = 0;
        for (var i = 200001; i <= 200012; i++, a++) {
            applnText += '<option value="' + +i + '">' + apps[a] + '</option>';
        }
        $("#dialog2").html('<label class="dialogLabel">Release Name</label> : <input type ="text" name="releaseName" id="releaseName"/><br /><br />' +
            '<label class="dialogLabel">Year</label> : <select name="year" id="year">' + htmlTextYear + '</select><br /><br />' +
            '<label class="dialogLabel">Month</label> : <select name="month" id="month">' + htmlText + '</select><br /><br />' +
            '<div id="loadDay"></div>' +
            '<label class="dialogLabel">Status</label> : <select name="releaseStatus" id="releaseStatus"><option value="" selected>Select Status</option><option value="DEV">DEV</option><option value="TEST">TEST</option><option value="STAGE">STAGE</option><option value="LIVE">LIVE</option></select><br /><br />' +
            '<label class="dialogLabel">Impacts</label> : <textarea name="impacts" id="impacts" rows ="4" cols = "50"></textarea><br /><br />' +
            '<label class="dialogLabel">TFS Url</label> : <textarea name="TFS_Url" id="TFS_Url"  rows ="4" cols = "50" ></textarea><br /><br />' +
            '<label class="dialogLabel">Application</label> : <select name="applicationName" id="applicationName">' + applnText + '</select><br /><script src="../JS/loadDay.js" type="text/javascript"></script>');
        $("#dialog2").dialog({
            title: "New Release Details",
            buttons: {
                Submit: function () {
                    var applicationName = $("#applicationName").val();
                    var releaseName = $("#releaseName").val();
                    var month = $("#month").val();
                    var year = $("#year").val();
                    var day = $("#day").val();
                    var releaseStatus = $("#releaseStatus").val();
                    var impacts = $("#impacts").val();
                    var TFS_Url = $("#TFS_Url").val();
                    $("#releaseName").css("border-color", "black");
                    $("#month").css("border-color", "black");
                    $("#day").css("border-color", "black");
                    $("#year").css("border-color", "black");
                    $("#releaseStatus").css("border-color", "black");
                    $("#applicationName").css("border-color", "black");
                    $("#TFS_Url").css("border-color", "black");
                    $("#impacts").css("border-color", "black");
                    if (month != "" && day != "" && year != "" && releaseName != "" && releaseStatus != "" && applicationName != "" && TFS_Url != "" && impacts != "") {
                        releaseName = $.trim(releaseName);
                        TFS_Url = $.trim(TFS_Url);
                        impacts = $.trim(impacts);

                        if (releaseName != "" && TFS_Url != "" && impacts != "") {
                            $.post("Home/CreateRelease", { "applicationName": applicationName, "releaseName": releaseName, "month": month, "year": year, "day": day, "releaseStatus": releaseStatus, "Impacts": impacts, "TFS_Url": TFS_Url }, function (data) {
                                //alert(data);
                                $("#dialog2").dialog('close');
                                getData();
                            });
                        } else {
                            if (releaseName == "") {
                                $("#releaseName").css("border-color", "red");
                            }
                            if (TFS_Url == "") {
                                $("#TFS_Url").css("border-color", "red");
                            }
                            if (impacts == "") {
                                $("#impacts").css("border-color", "red");
                            }
                        }
                    } else {
                        if (releaseName == "") {
                            $("#releaseName").css("border-color", "red");
                        }
                        if (month == "") {
                            $("#month").css("border-color", "red");
                        }
                        if (day == "") {
                            $("#day").css("border-color", "red");
                        }
                        if (year == "") {
                            $("#year").css("border-color", "red");
                        }
                        if (releaseStatus == "") {
                            $("#releaseStatus").css("border-color", "red");
                        }
                        if (applicationName == "") {
                            $("#applicationName").css("border-color", "red");
                        }
                        if (TFS_Url == "") {
                            $("#TFS_Url").css("border-color", "red");
                        }
                        if (impacts == "") {
                            $("#impacts").css("border-color", "red");
                        }
                    }
                },
                Cancel: function () {
                    $(this).dialog('close');
                }
            },
            modal: true
        });
    });
}
function searchApp() {
    var applicationId = $("#appName").val();
    var allReleases = 0;
    if (applicationId == "all") {
        allReleases = 1;
    } else {
        allReleases = 0;
    }
    $("#loadTable").html("");
    //console.log(applicationId + allReleases);
    if (applicationId != "") {
        $("#appName").css("border-color", "black");
        if (applicationId == "all") {
            applicationId = 0;
        }
        $.ajax({
            dataType: "json",
            cache: false,
            url: "Home/searchReleases",
            data: { "applicationId": applicationId, "allReleases": allReleases },
            method: "POST",
            success: function (responseText) {
                var str = JSON.stringify(responseText);
                //console.log(str);
                if (str.length > 2) {
                    //console.log(str.length);
                    var obj = jsonParse(str);
                    //$("#displayData").html(str + obj[0].releasesList.length);

                    var htmlTableText = '<tr><td></td>';
                    htmlTableText += '<td>DEV</td><td>TEST</td><td>STAGE</td><td>LIVE</td></tr>';
                    for (var i = 0; i < obj.length; i++) {
                        if (obj[i].releasesList.length != 0) {
                            htmlTableText += '<tr class="apN"><td>' + obj[i].Application_Name + '</td>';
                            for (var d = 0; d < 4; d++) {
                                htmlTableText += '<td></td>';
                            }
                            htmlTableText += '</tr>';
                            var k = 0;
                            for (var j = 0; j < obj[i].releasesList.length; j++) {
                                if (obj[i].releasesList[j].releaseStatuses.length != 0) {
                                    if (k == 0) {
                                        k++
                                        htmlTableText += '<tr class="relN1"><td>' + obj[i].releasesList[j].Release_Name + '</td>';
                                    } else {
                                        k = 0;
                                        htmlTableText += '<tr class="relN2"><td>' + obj[i].releasesList[j].Release_Name + '</td>';
                                    }
                                    var dev = "", test = "", stage = "", live = "";
                                    for (var s = 0; s < obj[i].releasesList[j].releaseStatuses.length; s++) {
                                        if (obj[i].releasesList[j].releaseStatuses.length != 0) {
                                            switch (obj[i].releasesList[j].releaseStatuses[s].Release_Status) {
                                                case "TEST": test = obj[i].releasesList[j].releaseStatuses[s].Month + " " + obj[i].releasesList[j].releaseStatuses[s].day + "," + obj[i].releasesList[j].releaseStatuses[s].Year; break;
                                                case "STAGE": stage = obj[i].releasesList[j].releaseStatuses[s].Month + " " + obj[i].releasesList[j].releaseStatuses[s].day + "," + obj[i].releasesList[j].releaseStatuses[s].Year; break;
                                                case "DEV": dev = obj[i].releasesList[j].releaseStatuses[s].Month + " " + obj[i].releasesList[j].releaseStatuses[s].day + "," + obj[i].releasesList[j].releaseStatuses[s].Year; break;
                                                case "LIVE": live = obj[i].releasesList[j].releaseStatuses[s].Month + " " + obj[i].releasesList[j].releaseStatuses[s].day + "," + obj[i].releasesList[j].releaseStatuses[s].Year; break;
                                                default: break;
                                            }
                                        }
                                    }
                                    htmlTableText += '<td>' + dev + '</td><td>' + test + '</td><td>' + stage + '</td><td>' + live + '</td>';
                                    htmlTableText += '</tr>';
                                }
                            }
                        }
                    }
                    //console.log(htmlTableText);
                    $("#Table1").html("");
                    $("#MonthDropDownList").val("");
                    $("#YearDropDownList").val("");
                    $("#MonthDropDownList").prop("disabled", true);
                    $("#loadSearchResults").html(htmlTableText);
                    $("#loadTable").html('<script src="../JS/selectivizr-min.js" type="text/javascript"></script>' +
                        '<script src="../JS/selectivizr.js" type="text/javascript"></script>'
                        + '<script src="../JS/json_sans_eval.js" type="text/javascript"></script>');
                } else {
                    $("#loadTable").html("<h3>Sorry!! No Results Found </h3>");
                    $("#loadSearchResults").html("");
                }
            },
            error: function () {
                alert("error");
            }
        });
    } else {
        $("#appName").css("border-color", "red");
    }
}

function exportExcel() {
    var applicationId = $("#appName").val();
    var allReleases = 0;
    if (applicationId == "all") {
        allReleases = 1;
    } else {
        allReleases = 0;

    }
    if (applicationId != "") {
        $("#appName").css("border-color", "black");
        if (applicationId == "all") {
            applicationId = 0;
        }
        $.ajax({
            dataType: "json",
            cache: false,
            url: "Home/ExportDataToExcel",
            data: { "applicationId": applicationId, "allReleases": allReleases },
            method: "POST",
            success: function (responseText) {
                var str = JSON.stringify(responseText);
                //console.log(str);
                if (str.length > 2) {
                    window.open("/Home/DownloadExcel");
                } else {
                    alert("Sorry!! No Data found to export to Excel");
                }
            },
            error: function () {
                alert("error");
            }
        });
    } else {
        $("#appName").css("border-color", "red");
    }
}
$(function () {
    var year = $("#YearDropDownList").val();
    if (year == "") {
        $("#MonthDropDownList").prop("disabled", true);
    }
    $("#YearDropDownList").change(function () {
        var year = $("#YearDropDownList").val();
        if (year == "") {
            $("#MonthDropDownList").prop("disabled", true);
            $("#MonthDropDownList").val("Select Month");
            $("#Table1").html("");
        } else {
            $("#MonthDropDownList").prop("disabled", false);
            getData();
        }
    });
    $("#MonthDropDownList").change(function () {
        getData();
    });
});
function getData() {
    $('#Table1').html('<img src="http://preloaders.net/preloaders/287/Filling%20broken%20ring.gif"> loading...');
    var year = $("#YearDropDownList").val();
    var month = $("#MonthDropDownList").val();
    var isLeapYear = false;
    if (month != "" && year != "") {
        if (year % 400 == 0 || year % 4 == 0)
            isLeapYear = true;
        var days = 31;
        switch (month) {
            case "JAN": days = 31; break;
            case "FEB": if (isLeapYear)
                days = 29;
            else days = 28;
                break;
            case "MAR": days = 31; break;
            case "APR": days = 30; break;
            case "MAY": days = 31; break;
            case "JUNE": days = 30; break;
            case "JULY": days = 31; break;
            case "AUG": days = 31; break;
            case "SEP": days = 30; break;
            case "OCT": days = 31; break;
            case "NOV": days = 30; break;
            case "DEC": days = 31; break;
        }
        $.ajax({
            dataType: "json",
            cache: false,
            url: "Home/GetReleases",
            data: { "Year": year, "Month": month },
            method: "POST",
            success: function (responseText) {
                //console.log(responseText);
                var str = JSON.stringify(responseText);
                if (str.length > 2) {
                    //console.log(str.length);

                    var obj = jsonParse(str);
                    //$("#displayData").html(str + obj[0].releasesList.length);

                    var htmlTableText = '<tr><td>' + month + ', ' + year + '<input type="hidden" value="" class="hiddenClass"/></td>';
                    for (var i = 0; i < days; i++) {
                        htmlTableText += '<td>' + (i + 1) + '<input type="hidden" value="" class="hiddenClass"/></td>';
                    }
                    htmlTableText += '</tr>';
                    for (var i = 0; i < obj.length; i++) {
                        if (obj[i].releasesList.length != 0) {
                            htmlTableText += '<tr class="appName"><td>' + obj[i].Application_Name + '<input type="hidden" value="" class="hiddenClass"/></td>';
                            for (var d = 0; d < days; d++) {
                                htmlTableText += '<td><input type="hidden" value="" class="hiddenClass" /></td>';
                            }
                            htmlTableText += '</tr>';
                            var k = 0;
                            for (var j = 0; j < obj[i].releasesList.length; j++) {
                                if (obj[i].releasesList[j].releaseStatuses.length != 0) {
                                    if (k == 0) {
                                        htmlTableText += '<tr class="releaseName1"><td>' + obj[i].releasesList[j].Release_Name + '<img src="../Images/edit.png" class="deleteImage" title="Click here to edit the Current Release Details" /><img src="../Images/manage.png" class="manageImage" title="Click here to Manage the Current Release Statuses" /><input type="hidden" class="hiddenClass" value="' + obj[i].releasesList[j].Release_Id + '" id="' + obj[i].Application_Id + '"/></td>';
                                        k++;
                                    } else {
                                        k = 0;
                                        htmlTableText += '<tr class="releaseName2"><td>' + obj[i].releasesList[j].Release_Name + '<img src="../Images/edit.png" class="deleteImage" title="Click here to edit the Current Release Details" /><img src="../Images/manage.png" class="manageImage" title="Click here to Manage the Current Release Statuses" /><input type="hidden" class="hiddenClass" value="' + obj[i].releasesList[j].Release_Id + '" id="' + obj[i].Application_Id + '"/></td>';
                                    }
                                    var s = 0;
                                    for (var d = 0; d < days; d++) {
                                        htmlTableText += '<td>';
                                        if (obj[i].releasesList[j].releaseStatuses.length != 0 && s < obj[i].releasesList[j].releaseStatuses.length) {
                                            if (obj[i].releasesList[j].releaseStatuses[s].day == (d + 1)) {
                                                htmlTableText += obj[i].releasesList[j].releaseStatuses[s].Release_Status;
                                                htmlTableText += '<input type="hidden" class="hiddenClass" value="' + obj[i].releasesList[j].releaseStatuses[s].Release_Status_Id + '" />';
                                                s++;
                                            } else {
                                                htmlTableText += ' <input type="hidden" class="hiddenClass" value="" />';
                                            }
                                        } else {
                                            htmlTableText += ' <input type="hidden" class="hiddenClass" value="" />';
                                        }
                                        htmlTableText += '</td>';
                                    }
                                    htmlTableText += '</tr>';
                                }
                            }
                        }
                    }
                    $("#Table1").html(htmlTableText);
                    $("#loadSearchResults").html("");
                    $("#appName").val("");
                    $("#loadTable").html('<script src="../JS/LoadTable.js" type="text/javascript"></script>' +
                        '<script src="../JS/selectivizr-min.js" type="text/javascript"></script>' +
                        '<script src="../JS/selectivizr.js" type="text/javascript"></script>'
                        + '<script src="../JS/json_sans_eval.js" type="text/javascript"></script>');
                } else {
                    $("#loadTable").html("<h3>Sorry!! No Results Found </h3>");
                    $("#Table1").html("");
                    $("#loadSearchResults").html("");
                }
            },
            error: function () {
                alert('error');
            }
        });
    } else {
        $("#Table1").html("");
    }
}


































/*function ShowPopup() {
    $(function () {
        var htmlText = "";
        for (var i = 1; i <= 12; i++) {
            htmlText += '<option value="' + (i) + '">' + i + '</option>';
        }
        var htmlTextYear = "";
        for (var i = 2015; i < 2021; i++) {
            htmlTextYear += '<option value="' + i + '">' + i + '</option>';
        }
        $("#dialog").html('Application Name : <input type ="text" name="applicationName" id="applicationName"/><br /><br />' +
            'Month &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <select name="month" id="month">' + htmlText + '</select><br /><br />' +
                'Year &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <select name="year" id="year">' + htmlTextYear + '</select>');
        $("#dialog").dialog({
            title: "New Application Details",
            buttons: {
                Submit: function () {
                    var applicationName = $("#applicationName").val();
                    var month = $("#month").val();
                    var year = $("#year").val();
                    alert(applicationName + month + year);
                    $.post("Default.aspx", { "applicationName": applicationName, "month": month, "year": year }, function (data) {
                        alert(data);
                        $("#dialog").dialog('close');
                    });
                },
                Cancel: function () {
                    $(this).dialog('close');
                }
            },
            modal: true
        });
    });
}*/