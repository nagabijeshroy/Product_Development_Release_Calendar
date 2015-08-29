$(function () {
    var year = $("#year").val();
    var yearVal = $("#yearV").val();
    var monthHidden = $("#monthHidden").val();
    //console.log(monthHidden);
    //console.log(yearVal);
    switch (monthHidden) {
        case "JAN": $("#monthV").prop('selectedIndex', 1); break;
        case "FEB": $("#monthV").prop('selectedIndex', 2); break;
        case "MAR": $("#monthV").prop('selectedIndex', 3); break;
        case "APR": $("#monthV").prop('selectedIndex', 4); break;
        case "MAY": $("#monthV").prop('selectedIndex', 5); break;
        case "JUNE": $("#monthV").prop('selectedIndex', 6); break;
        case "JULY": $("#monthV").prop('selectedIndex', 7); break;
        case "AUG": $("#monthV").prop('selectedIndex', 8); break;
        case "SEP": $("#monthV").prop('selectedIndex', 9); break;
        case "OCT": $("#monthV").prop('selectedIndex', 10); break;
        case "NOV": $("#monthV").prop('selectedIndex', 11); break;
        case "DEC": $("#monthV").prop('selectedIndex', 12); break;
    }
    if (year == "") {
        $("#month").prop("disabled", true);
        $("#loadDay").html("");
    }
    if (yearVal == "") {
        $("#monthV").prop("disabled", true);
        $("#loadDays").html("");
    }
    $("#month").change(function () {
        var month = $("#month").val();
        if (month == "") {
            $("#loadDay").html("");
        }
        getDay();
    });
    $("#year").change(function () {
        var year = $("#year").val();
        if (year == "") {
            $("#month").prop("disabled", true);
            $("#month").val("Select Month");
            $("#loadDay").html("");
        } else {
            $("#month").prop("disabled", false);
            getDay();
        }
    });
    $("#yearV").change(function () {
        var year = $("#yearV").val();
        //console.log(year);
        if (year == "") {
            $("#monthV").prop("disabled", true);
            $("#monthV").val("Select Month");
            $("#loadDays").html("");
        } else {
            $("#monthV").prop("disabled", false);
            $("#monthV").prop('selectedIndex', 0);
            $("#loadDays").html("");
            getDays();
        }
    });
    $("#monthV").change(function () {
        var month = $("#monthV").val();
        //console.log(month);
        if (month == "") {
            $("#loadDays").html("");
        }
        getDays();
    });
    
});
function getDay() {
    var month = $("#month").val();
    var year = $("#year").val();
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
        var htmlTextDay = '<label class="dialogLabel">Day</label> : <select name="day" id="day" onchange="javascript: checkData();"><option value="">Select Day</option>';
        for (var i = 1; i <= days ; i++) {
            htmlTextDay += '<option value="' + i + '">' + i + '</option>';
        }
        htmlTextDay += '</select><label id="conflictErrorMessage"></label><br /><br />';
        $("#loadDay").html(htmlTextDay);
    }
}
function getDays() {
    var month = $("#monthV").val();
    var year = $("#yearV").val();
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
        var htmlTextDay = '<label class="dialogLabel">Day</label> : <select name="day" id="dayV" onchange="javascript: checkDateConflict();"><option value="">Select Day</option>';
        for (var i = 1; i <= days ; i++) {
            htmlTextDay += '<option value="' + i + '">' + i + '</option>';
        }
        htmlTextDay += '</select><label id="conflictErrorMessage"></label><br /><br />';
        $("#loadDays").html(htmlTextDay);
    }
}
function checkData() {
    var month = $("#month").val();
    var day = $("#day").val();
    var releaseId = $("#rIdVal").val();
    var year = $("#year").val();
    if (month != "" && day != "" && releaseId != "" && year != "") {
        $.ajax({
            dataType: "json",
            cache: false,
            url: "Home/CheckDateConflict",
            data: { "releaseId": releaseId, "day": day, "month": month, "year": year },
            method: "POST",
            success: function (responseText) {
                var str = JSON.stringify(responseText);
                //console.log(str);
                if (str.length > 2) {
                    //console.log(str.length);
                    var obj = jsonParse(str);
                    if (obj.Release_Status != null) {
                    $("#day").css("border-color","red");
                    $("#conflictErrorMessage").html("Conflicting with " + obj.Release_Status + " on " + obj.day + " " + obj.Month + " , " + obj.Year);
                    $("#conflictErrorMessage").css("border-color","red");
                } else {
                    $("#day").css("border-color", "green");
                    $("#conflictErrorMessage").html("No Conflicts!!");
                }
            }
            },
            error: function () {

            }
        });
    }

}

function checkDateConflict() {
    var month = $("#monthV").val();
    var day = $("#dayV").val();
    var releaseId = $("#rIdVal").val();
    var year = $("#yearV").val();
    if (month != "" && day != "" && releaseId != "" && year != "") {
        $.ajax({
            dataType: "json",
            cache: false,
            url: "Home/CheckDateConflict",
            data: { "releaseId": releaseId, "day": day, "month": month, "year": year },
            method: "POST",
            success: function (responseText) {
                var str = JSON.stringify(responseText);
                //console.log(str);
                if (str.length > 2) {
                    //console.log(str.length);
                    var obj = jsonParse(str);
                    var statusVal = $("#statusV").val();
                    if (obj.Release_Status != null) {
                        //console.log("Status : ");
                        if (obj.Release_Status != statusVal) {
                            $("#dayV").css("border-color", "red");
                            $("#conflictErrorMessage").html("Conflicting with " + obj.Release_Status + " on " + obj.day + " " + obj.Month + " , " + obj.Year);
                            $("#conflictErrorMessage").css("border-color", "red");
                        } else {
                            $("#dayV").css("border-color", "black");
                            $("#conflictErrorMessage").html("No Conflicts!!");
                        }
                    } else {
                        $("#dayV").css("border-color", "green");
                        $("#conflictErrorMessage").html("No Conflicts!!");
                    }
                }
            },
            error: function () {

            }
        });
    }

}

//function checkDatas() {
//    var month = $("#monthV").val();
//    var day = $("#dayV").val();
//    var releaseId = $("#rIdVal").val();
//    var year = $("#yearV").val();
//    if (month != "" && day != "" && releaseId != "" && year != "") {
//        $.ajax({
//            dataType: "json",
//            cache: false,
//            url: "Home/CheckDateConflict",
//            data: { "releaseId": releaseId, "day": day, "month": month, "year": year },
//            method: "POST",
//            success: function (responseText) {
//                var str = JSON.stringify(responseText);
//                //console.log(str);
//                if (str.length > 2) {
//                    //console.log(str.length);
//                    var obj = jsonParse(str);
//                    var statusVal = $("#statusV").val();
//                    if (obj.Release_Status != null) {
//                        console.log("Status : ");
//                        if (obj.Release_Status != statusVal) {
//                        $("#dayV").css("border-color", "red");
//                        $("#conflictErrorMessage").html("Conflicting with " + obj.Release_Status + " on " + obj.day + " " + obj.Month + " , " + obj.Year);
//                        $("#cnflictErrorMessage").css("border-color", "red");
//                        } else {
//                            $("#dayV").css("border-color", "black");
//                            $("#conflictErrorMessage").html("No Conflicts!!");
//                        }
//                    } else {
//                        $("#dayV").css("border-color", "green");
//                        $("#conflictErrorMessage").html("No Conflicts!!");
//                    }
//                }
//            },
//            error: function () {

//            }
//        });
//    }

//}