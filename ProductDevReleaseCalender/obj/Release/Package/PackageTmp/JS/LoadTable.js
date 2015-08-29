$(function () {
    $("table td").click(function (e) {
        $('#dialog2').html('<img src="http://preloaders.net/preloaders/287/Filling%20broken%20ring.gif"> loading...');
        var $element = $(this);
        var yearValue = $("#YearDropDownList").val();
        var month = $("#MonthDropDownList").val();
        var isLeapYear = false;
        if (yearValue % 400 == 0 || yearValue % 4 == 0) {
            isLeapYear = true;
        }
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
        //alert the row index that was clicked
        var date = $("table td").index(this);
        var table = $("#Table1");
        var Column = $('td', table);
        var monthYear = Column.eq(0).html();
        //alert(monthYear);
        if (date > days && (date % (days + 1)) != 0) {
            var actualDate = (date - (parseInt(date / (days + 1)))) % (days);
            actualDate = (actualDate ? actualDate : actualDate + (days));
            var textData = Column.eq(date - actualDate).text();
            //console.log(textData);

            //var rId = document.getElementsByClassName("hiddenClass");
            // var release_Id = rId[date - actualDate].value;
            //for(var i=0; i<rId.length ;i++){
            //    console.log("Release ID " + rId[i].value+" i : "+i);
            //}
            var release_Id = $(".hiddenClass:eq(" + (date - actualDate) + ")").val();
            //var release_Id = rId[date - actualDate].value;
            //console.log("Release Id" + release_Id);
            if (typeof String.prototype.startsWith != 'function') {
                String.prototype.startsWith = function (str) {
                    return str.length > 0 && this.substring(0, str.length) === str;
                }
            };
            //alert("Row first field data:"+textData);
            if (textData.startsWith("A") == false) {

                var colText = Column.eq(date).text();
                colText = $.trim(colText);
                //console.log("column Text" + colText.length);
                var releaseStatusId = "";
                if (colText != "") {
                    //releaseStatusId = colText.substring(0, 6);
                    //colText = colText.substring(7);
                }
                var selectedIndex = "";
                var selected_Text = "";
                $.ajax({
                    dataType: "json",
                    cache: false,
                    url: "Home/GetReleaseStatusReleaseId",
                    data: { "releaseId": release_Id },
                    method: "POST",
                    success: function (responseText) {
                        var str = JSON.stringify(responseText);
                        var obj = jsonParse(str);
                        var A = ['DEV', 'TEST', 'STAGE', 'LIVE'];
                        var newStatuses = $(A).not(obj).get();
                        if (newStatuses.length != 0) {
                            for (var i = 0; i < newStatuses.length ; i++) {
                                selected_Text += '<option value="' + newStatuses[i] + '">' + newStatuses[i] + '</option>';
                            }
                        }
                        if (colText.length == 0) {
                            selectedIndex = '<select name="statusVal" required id="statusV"><option value="" selected>Select Status</option>' + selected_Text + '</select>';
                        } else {
                            selectedIndex = '<input type="text" readonly name="statusVal" id="statusV" value="' + colText + '" />';
                        }

                        var daysText = '<select name="dayVal" id="dayV" onchange = "javascript:checkDateConflict();">';
                        for (var i = 1; i <= days; i++) {
                            if (i == actualDate) {
                                daysText += '<option value="' + i + '" selected>' + i + '</option>';
                            } else {
                                daysText += '<option value="' + i + '">' + i + '</option>';
                            }
                        }
                        daysText += '</select><label id="conflictErrorMessage"></label>';
                        $(function () {
                            var columnHtmlText = '<label class="dialogLabel">Release Name</label> : <input type="text" required name="releaseName" readonly="true" id="relName" value="' + textData + '" /><br /><br />';
                            columnHtmlText += '<label class="dialogLabel">Month</label> : <input type="text" required name="monthVal" readonly="true" id="monthV" value="' + month + '" /><br /><br />';
                            columnHtmlText += '<label class="dialogLabel">Year</label> : <input type="text" required name="yearVal" readonly="true" id="yearV" value="' + yearValue + '" /><br /><br />';
                            columnHtmlText += '<label class="dialogLabel">Day</label> : <input name="dayVal" readonly="true" id="dayV" value = "' + actualDate + '"><br /><br />';
                            columnHtmlText += '<label class="dialogLabel">Impacts</label> : <textarea name="impacts" id="impacts" rows ="4" cols = "50"></textarea><br /><br />';
                            columnHtmlText += '<label class="dialogLabel">TFS Url</label> : <textarea name="TFS_Url" rows ="4" cols = "50" id="TFS_Url" ></textarea><br /><br />';
                            columnHtmlText += '<label class="dialogLabel">Status</label> : ' + selectedIndex + '';
                            var scriptText = '<script src="../JS/pdrc.js" type="text/javascript"><link rel="stylesheet" type="text/css" href="../../CSS/style.css" />';
                            if (colText.length == 0) {
                                if (newStatuses.length != 0) {
                                    $("#dialog2").html(columnHtmlText+scriptText);

                                    $("#dialog2").dialog({
                                        title: "Create New Release status Details",
                                        buttons: {
                                            Submit: function () {
                                                var releaseId = release_Id;
                                                var Month = month;
                                                var year = yearValue;
                                                var day = actualDate;
                                                var impacts = $("#impacts").val();
                                                var TFSUrl = $("#TFS_Url").val();
                                                var status = $("#statusV").val();
                                                $("#impacts").css("border-color", "black");
                                                $("#TFS_Url").css("border-color", "black");
                                                $("#statusV").css("border-color", "black");
                                                if (status != "" && releaseId != "" && day != "" && month != "" && year != "" && impacts != "" && TFSUrl != "") {
                                                    //alert(releaseId + day + status);
                                                    impacts = $.trim(impacts);
                                                    TFSUrl = $.trim(TFSUrl);
                                                    if (TFSUrl != "" && impacts != "") {
                                                        $.post("Home/CreateReleaseStatus", { "releaseId": releaseId, "status": status, "day": day, "Month": Month, "Year": year, "impacts": impacts, "TFSUrl": TFSUrl }, function (data) {
                                                            //alert(data);
                                                            $("#dialog2").dialog('close');
                                                            $("#loadScript").html(scriptText);
                                                            getData();
                                                        });
                                                    } else {
                                                        if (impacts == "") {
                                                            $("#impacts").css("border-color", "red");
                                                        }
                                                        if (TFSUrl == "") {
                                                            $("#TFS_Url").css("border-color", "red");
                                                        }
                                                    }
                                                } else {
                                                    if (status == "") {
                                                        $("#statusV").css("border-color", "red");
                                                    }
                                                }
                                            },
                                            Cancel: function () {
                                                $(this).dialog('close');
                                            }
                                        },
                                        modal: true
                                    });
                                } else {
                                    alert("Sorry!! You cannot add any more Statuses to this Release");
                                }
                            } else {
                                var releaseStatusId;
                                $element.siblings(":first").andSelf().find("input:hidden").each(function (i, elem) {
                                    releaseStatusId = elem.value;
                                });
                                $.ajax({
                                    dataType: "json",
                                    cache: false,
                                    url: "Home/GetReleaseStatus",
                                    data: { "releaseStatusId": releaseStatusId },
                                    method: "POST",
                                    success: function (responseText) {
                                        var str = JSON.stringify(responseText);
                                        var obj = jsonParse(str);
                                        //console.log(obj);
                                        var yearText = "";
                                        var monthText = "";
                                        var dayText = "";
                                        monthText += '<select name="month" id="monthV"><option Value="" >Select Month</option>' +
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
                                        '<option Value="DEC" > DEC </option></select>';
                                        yearText += '<select name="year" id="yearV"><option value="">Select Year</option>';
                                        for (var i = 2015; i < 2021; i++) {
                                            if(i==yearValue){
                                                yearText += '<option value="' + i + '" selected>' + i + '</option>';
                                            } else {
                                                yearText += '<option value="' + i + '">' + i + '</option>';
                                            }
                                        }
                                        yearText += "</select>";
                                        var loadDayText = "";
                                        var columnHtmlText = '<label class="dialogLabel">Release Name</label> : <input type="text" required name="releaseName" readonly="true" id="relName" value="' + textData + '" /><input type="hidden" id="rIdVal" name="rIdVal" value="' + release_Id + '" /><br /><br />';
                                        columnHtmlText += '<label class="dialogLabel">Year</label> : <input type="hidden" required name="yearVal" readonly="true" id="yearHidden" value="' + yearValue + '" />' + yearText + '<br /><br />';
                                        columnHtmlText += '<label class="dialogLabel">Month</label> : <input type="hidden" required name="monthVal" readonly="true" id="monthHidden" value="' + month + '" />' + monthText + '<br /><br />';
                                        loadDayText += '<label class="dialogLabel">Day</label> : ' + daysText + '<br /><br />';
                                        //console.log(loadDayText);
                                        columnHtmlText += '<div id="loadDays">' + loadDayText + '</div>';
                                        columnHtmlText += '<label class="dialogLabel">Impacts</label> : <textarea name="impacts" id="impacts" rows ="4" cols = "50">' + obj.Impacts + '</textarea><br /><br />';
                                        columnHtmlText += '<label class="dialogLabel">TFS Url</label> : <textarea name="TFS_Url" id="TFS_Url"  rows ="4" cols = "50" >' + obj.TFS_Url + '</textarea><br /><br />';
                                        columnHtmlText += '<label class="dialogLabel">Status</label> : ' + selectedIndex;
                                        var scriptText = '<script src="../JS/pdrc.js" type="text/javascript"></script></script><script src="../JS/loadDay.js" type="text/javascript"></script><link rel="stylesheet" type="text/css" href="../../CSS/style.css" />';
                                        $("#dialog2").html(columnHtmlText+scriptText);
                                    },
                                    error: function () {
                                        alert("error");
                                    }
                                });

                                //console.log(releaseStatusId);
                                $("#dialog2").dialog({
                                    title: "Update New Release Status Details",
                                    buttons: {
                                        Update: function () {
                                            var Month = $("#monthV").val();
                                            var year = $("#yearV").val();
                                            var day = $("#dayV").val();
                                            var status = $("#statusV").val();
                                            var impacts = $("#impacts").val();
                                            var TFSUrl = $("#TFS_Url").val();
                                            $("#impacts").css("border-color", "black");
                                            $("#TFS_Url").css("border-color", "black");
                                            $("#statusV").css("border-color", "black");
                                            $("#dayV").css("border-color", "black");
                                            var error = $("#conflictErrorMessage").text();
                                            if(error.length <= 15){
                                            if (status != "" && releaseStatusId != "" && impacts != "" && TFSUrl != "" && day != "" && Month!="" && year !="") {
                                                // alert(releaseStatusId + status + day);
                                                //alert(releaseId + day + status);
                                                impacts = $.trim(impacts);
                                                TFSUrl = $.trim(TFSUrl);
                                                if (TFSUrl != "" && impacts != "") {
                                                    $.post("Home/UpdateReleaseStatus", { "releaseStatusId": releaseStatusId, "status": status, "day": day, "Month": Month, "Year": year, "impacts": impacts, "TFSUrl": TFSUrl }, function (data) {
                                                        //alert(data);
                                                        $("#dialog2").dialog('close');
                                                        $("#loadScript").html(scriptText);
                                                        getData();
                                                    });
                                                } else {
                                                    if (impacts == "") {
                                                        $("#impacts").css("border-color", "red");
                                                    }
                                                    if (TFSUrl == "") {
                                                        $("#TFS_Url").css("border-color", "red");
                                                    }
                                                }
                                            }
                                            else {
                                                if (status == "") {
                                                    $("#statusV").css("border-color", "red");
                                                }
                                                if (impacts == "") {
                                                    $("#impacts").css("border-color", "red");
                                                }
                                                if (TFSUrl == "") {
                                                    $("#TFS_Url").css("border-color", "red");
                                                }
                                                if (day == "") {
                                                    $("#dayV").css("border-color", "red");
                                                }
                                                if (Month == "") {
                                                    $("#monthV").css("border-color", "red");
                                                }
                                                if(year == ""){
                                                    $("#yearV").css("border-color", "red");
                                                }
                                            }
                                            } else {
                                                alert("Please correct errors before you Update the information");
                                            }
                                        },
                                        Delete: function () {
                                            if (releaseStatusId != "") {
                                                if (confirm('Are you sure you want to Delete this Release Status?')) {
                                                    $.post("Home/DeleteReleaseStatus", { "releaseStatusId": releaseStatusId }, function (data) {
                                                        //alert(data);
                                                        $("#dialog2").dialog('close');
                                                        $("#loadScript").html(scriptText);
                                                        getData();
                                                    });
                                                }
                                            }
                                        },
                                        Cancel: function () {
                                            $(this).dialog('close');
                                        }
                                    },
                                    modal: true
                                });
                            }

                        });
                    },
                    error: function () {
                        alert("error");
                    }
                });


                //alert("actual Date : "+ actualDate);
                //alert("actual Date Text: "+Column.eq(date).text());
            }

        }
    });
    $('table tbody tr td').click(function (e) {
        $('#dialog2').html('<img src="http://preloaders.net/preloaders/287/Filling%20broken%20ring.gif"> loading...');
        var elementClicked = $(e.target)
        if (elementClicked.is("img") && elementClicked.hasClass("deleteImage")) {
            var date = $("table tbody tr td").index(this);
            var table = $("#Table1");
            var Column = $('td', table);
            var text = Column.eq(date).text();
            var apps = ["A - Amgen VirMedica", "A - Novartis", "A - Clinical PPRP", "A - Genzyme", "A - PANF Portal", "A - eBR", "A - RxRescue", "A - Provider Portal", "A - Reporting Portal", "A - Web Configuration Tool", "A - Site Locator", "A - Patient Plus"];
            //console.log(textData);
            //var rId = document.getElementsByClassName("hiddenClass");
            //var release_Id = rId[date].value;
            var release_Id = $(".hiddenClass:eq(" + (date) + ")").val();
            //var applicationId = rId[date].id;
            var applicationId = $(".hiddenClass:eq(" + (date) + ")").attr('id');
            //console.log(release_Id + applicationId);
            var yearValue = $("#YearDropDownList").val();
            var monthValue = $("#MonthDropDownList").val();
            var errorText = "";
            $(function () {
                var applnText = "";
                applnText += '<option value="">Select Application</option>';
                var a = 0;
                for (var i = 200001; i <= 200012; i++, a++) {
                    if (i == applicationId) {
                        applnText += '<option value="' + +i + '" selected>' + apps[a] + '</option>';
                    } else {
                        applnText += '<option value="' + +i + '">' + apps[a] + '</option>';
                    }
                }
                $("#dialog2").html('<label class="dialogLabel">Release Name</label> : <input type ="text" required name="releaseName" id="releaseName" value="' + text + '" /><br /><br />' +
                    '<label class="dialogLabel">Month</label> : <input type="text" readonly value="' + monthValue + '" id="month" name="month" /><br /><br />' +
                    '<label class="dialogLabel">Year</label> : <input type="text" readonly value="' + yearValue + '" id="year" name="year" /><br /><br />' +
                    '<label class="dialogLabel">Application</label> : <select name="applicationName" required id="applicationName">' + applnText + '</select><br />');
                var scriptText = '<script src="../JS/pdrc.js" type="text/javascript"></script><link rel="stylesheet" type="text/css" href="../../CSS/style.css" />';
                $("#dialog2").dialog({
                    title: "Update Existing Release Details",
                    buttons: {
                        Update: function () {
                            var applicationName = $("#applicationName").val();
                            var releaseName = $("#releaseName").val();
                            var month = $("#month").val();
                            var year = $("#year").val();
                            $("#releaseName").css("border-color", "black");
                            $("#month").css("border-color", "black");
                            $("#year").css("border-color", "black");
                            $("#applicationName").css("border-color", "black");
                            if (releaseName != "" && month != "" && year != "" && applicationName != "" && release_Id != "") {
                                releaseName = $.trim(releaseName);
                                month = $.trim(month);
                                applicationName = $.trim(applicationName);
                                release_Id = $.trim(release_Id);
                                if (releaseName != "" && month != "" && year != "" && applicationName != "" && release_Id != "") {
                                    $.post("Home/UpdateRelease", { "releaseName": releaseName, "month": month, "year": year, "applicationId": applicationName, "releaseId": release_Id }, function (data) {
                                        //alert(data);
                                        $("#dialog2").dialog('close');
                                        $("#loadScript").html(scriptText);
                                        getData();
                                    });
                                } else {
                                    if (releaseName == "") {
                                        $("#releaseName").css("border-color", "red");
                                    }
                                    if (month == "") {
                                        $("#month").css("border-color", "red");
                                    }
                                    if (year == "") {
                                        $("#year").css("border-color", "red");
                                    }
                                    if (applicationName == "") {
                                        $("#applicationName").css("border-color", "red");
                                    }
                                }
                            } else {
                                if (releaseName == "") {
                                    $("#releaseName").css("border-color", "red");
                                }
                                if (month == "") {
                                    $("#month").css("border-color", "red");
                                }
                                if (year == "") {
                                    $("#year").css("border-color", "red");
                                }
                                if (applicationName == "") {
                                    $("#applicationName").css("border-color", "red");
                                }
                            }
                        },
                        Delete: function () {
                            if (confirm("Are you sure you want to delete this Release?")) {
                                if (release_Id != "") {
                                    $.post("Home/DeleteRelease", { "releaseId": release_Id }, function (data) {
                                        //alert(data);
                                        $("#dialog2").dialog('close');
                                        $("#loadScript").html(scriptText);
                                        getData();
                                    });
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
            // alert(text);
        }
        else if (elementClicked.is("img") && elementClicked.hasClass("manageImage")) {
            var yearValue = $("#YearDropDownList").val();
            var monthValue = $("#MonthDropDownList").val();
            var date = $("table tbody tr td").index(this);
            var table = $("#Table1");
            var Column = $('td', table);
            var text = Column.eq(date).text();
            var apps = ["A - Amgen VirMedica", "A - Novartis", "A - Clinical PPRP", "A - Genzyme", "A - PANF Portal", "A - eBR", "A - RxRescue", "A - Provider Portal", "A - Reporting Portal", "A - Web Configuration Tool", "A - Site Locator", "A - Patient Plus"];
            //console.log(textData);
            //var rId = document.getElementsByClassName("hiddenClass");
            //var release_Id = rId[date].value;
            var release_Id = $(".hiddenClass:eq(" + (date) + ")").val();
            var selected_Text = "";
            $.ajax({
                dataType: "json",
                cache: false,
                url: "Home/GetReleaseStatusReleaseId",
                data: { "releaseId": release_Id },
                method: "POST",
                success: function (responseText) {
                    var str = JSON.stringify(responseText);
                    var obj = jsonParse(str);
                    var A = ['DEV', 'TEST', 'STAGE', 'LIVE'];
                    var newStatuses = $(A).not(obj).get();
                    if (newStatuses.length != 0) {
                        for (var i = 0; i < newStatuses.length ; i++) {
                            selected_Text += '<option value="' + newStatuses[i] + '">' + newStatuses[i] + '</option>';
                        }
                        //var applicationId = rId[date].id;
                        var applicationId = $(".hiddenClass:eq(" + (date) + ")").attr('id');
                        //console.log(release_Id + applicationId);
                        var htmlText = "";
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
                            var a=0;
                            for (var i = 200001; i <= 200012; i++, a++) {
                                if (i == applicationId) {
                                    applnText += '<option value="' + +i + '" selected>' + apps[a] + '</option>';
                                } else {
                                    applnText += '<option value="' + +i + '">' + apps[a] + '</option>';
                                }
                            }
                            $("#dialog2").html('<label class="dialogLabel">Release Name</label> : <input type ="text" readonly name="releaseName" id="releaseName" value="' + text + '"/><input type="hidden" id="rIdVal" name="rIdVal" value="' + release_Id + '" /><br /><br />' +
                                '<label class="dialogLabel">Year</label> : <select name="year" id="year">' + htmlTextYear + '</select><br /><br />' +
                                '<label class="dialogLabel">Month</label> : <select name="month" id="month">' + htmlText + '</select><br /><br />' +
                                '<div id="loadDay"></div>' +
                                '<label class="dialogLabel">Release Status</label> : <select name="releaseStatus" id="releaseStatus">' +
                                '<option value="" selected>Select Status</label> :</option>' + selected_Text +
                                '</select><br /><br />'+
                                '<label class="dialogLabel">Impacts</label> : <textarea name="impacts" id="impacts" rows ="4" cols = "50"></textarea><br /><br />' +
                                '<label class="dialogLabel">TFS Url</label> : <textarea name="TFS_Url" id="TFS_Url" rows ="4" cols = "50"></textarea><br /><br />' +
                                '<label class="dialogLabel">Application</label> : <select name="applicationName" id="applicationName" disabled>' + applnText + '</select><br /><link rel="stylesheet" type="text/css" href="../../CSS/style.css" /><script src="../JS/loadDay.js" type="text/javascript"></script>');
                            $("#dialog2").dialog({
                                title: "Manage Existing Release Details",
                                buttons: {
                                    Submit: function () {
                                        var applicationName = $("#applicationName").val();
                                        var releaseName = $("#releaseName").val();
                                        var month = $("#month").val();
                                        var year = $("#year").val();
                                        var day = $("#day").val();
                                        var impacts = $("#impacts").val();
                                        var TFSUrl = $("#TFS_Url").val();
                                        var releaseStatus = $("#releaseStatus").val();
                                        $("#releaseName").css("border-color", "black");
                                        $("#month").css("border-color", "black");
                                        $("#year").css("border-color", "black");
                                        $("#applicationName").css("border-color", "black");
                                        $("#releaseStatus").css("border-color", "black");
                                        $("#impacts").css("border-color", "black");
                                        $("#TFS_Url").css("border-color", "black");
                                        var error = $("#conflictErrorMessage").text();
                                        if (error.length <= 15) {
                                            if (month != "" && day != "" && year != "" && releaseName != "" && releaseStatus != "" && applicationName != "" && impacts != "" && TFSUrl != "") {
                                                releaseName = $.trim(releaseName);
                                                impacts = $.trim(impacts);
                                                TFSUrl = $.trim(TFSUrl);
                                                if (releaseName != "" && impacts != "" && TFSUrl != "") {
                                                    $.post("Home/CreateReleaseStatus", { "releaseId": release_Id, "status": releaseStatus, "day": day, "Month": month, "Year": year, "impacts": impacts, "TFSUrl": TFSUrl }, function (data) {
                                                        //alert(data);
                                                        $("#dialog2").dialog('close');
                                                        getData();
                                                    });
                                                } else {
                                                    if (releaseName == "") {
                                                        $("#releaseName").css("border-color", "red");
                                                    }
                                                    if (impacts == "") {
                                                        $("#impacts").css("border-color", "red");
                                                    }
                                                    if (TFSUrl == "") {
                                                        $("#TFS_Url").css("border-color", "red");
                                                    }
                                                }
                                            } else {
                                                if (releaseName == "") {
                                                    $("#releaseName").css("border-color", "red");
                                                }
                                                if (month == "") {
                                                    $("#month").css("border-color", "red");
                                                }
                                                if (year == "") {
                                                    $("#year").css("border-color", "red");
                                                }
                                                if (applicationName == "") {
                                                    $("#applicationName").css("border-color", "red");
                                                }
                                                if (releaseStatus == "") {
                                                    $("#releaseStatus").css("border-color", "red");
                                                }
                                                if (impacts == "") {
                                                    $("#impacts").css("border-color", "red");
                                                }
                                                if (TFSUrl == "") {
                                                    $("#TFS_Url").css("border-color", "red");
                                                }
                                            }
                                        } else {
                                                alert("Please correct errors before you Update the information");
                                         }
                                    },
                                    Cancel: function () {
                                        $(this).dialog('close');
                                    }
                                },
                                modal: true
                            });
                        });
                    } else {
                        alert("Sorry !! Managing this applicationis not possible");
                    }
                },
                error: function () {
                    alert("error");
                }
            });
        }
    });
});

