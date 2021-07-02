
const request = {
    "Payment": {
        "TotalAmount": 100
    },
    "RedirectUrl": url + "/index.html",
    "CancelUrl": url + "/index.html",
    "Method": "ProcessPayment",
    "TransactionType": "Purchase"
};

function submitRsp() {
    console.log('Begining request');
    $(".overlay").show();
    $.ajax({
        type: "POST",
        url: "/payments/rsp/",
        data: request,
        success: function (data) {
            window.location.href = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Error, status = " + textStatus + ", " +
                "error thrown: " + errorThrown
            );
        }
    });
}

window.onload = showExample(request);