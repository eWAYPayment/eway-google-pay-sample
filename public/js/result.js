function queryResult() {
    const params = new URLSearchParams(window.location.search);
    const accessCode = params.get('AccessCode');
    const body = {
        accessCode: accessCode
    };

    $.ajax({
        type: "POST",
        url: "/payments/result/",
        data: body,
        success: function (data) {
            showResult(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Error, status = " + textStatus + ", " +
                "error thrown: " + errorThrown
            );
        }
    });
}

function showResult(resultData) {
    var pre = $("#preResult");
    var strResult = library.json.prettyPrint(resultData);
    pre.html(strResult).show(150);
}

window.onload = queryResult();