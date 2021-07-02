const request = {
    "Payment": {
        "TotalAmount": 100
    },
    "RedirectUrl": url + "/result.html",
    "Method": "ProcessPayment",
    "TransactionType": "Purchase"
};

function getAccessCode() {
    console.log('Begining request');

    $.ajax({
        type: "POST",
        url: "/payments/getAccessCode/",
        data: request,
        success: function (result) {
            $("#stepOne").hide();
            $("#stepTwo").show();
            pupulateHiddenFields(result);
            showResult(result);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Error, status = " + textStatus + ", " +
                "error thrown: " + errorThrown
            );
        }
    });
}

function showResult(result) {
    var pre = $("#preAccessCode");
    var strResult = library.json.prettyPrint(result);

    $("#containerGPay").show();
    pre.html(strResult).show(100);
}

function setVisibility() {
    $("#preExample").show();
    $("#stepTwo").hide();
    $(".overlay").hide();
}


function pupulateHiddenFields(data) {
    document.payment_form.action = data.attributes.FormActionURL;
    $('input[name="EWAY_ACCESSCODE"]').val(data.attributes.AccessCode);

}


googlePayJs = {
    googlePay: {
        getCountryCode: function () {
            const countryCode = $("meta[id='payment-country-code']").attr("content") || "AU";
            return countryCode;
        },
        getCurrencyCode: function () {
            const currencyCode = $("meta[id='payment-currency-code']").attr("content") || "AUD";
            return currencyCode;
        },
        totalCharge: function () {
            var subtotal = FormatMoney(($("#amountExample").val()));

            var totalPrice = {
                amount: subtotal,
                type: "FINAL"
            };
            return totalPrice;
        },
        sendPayment: function (data) {
            $('input[name="EWAY_GOOGLEPAY_NETWORKTOKEN"]').val(data);
            $(".overlay").show();
            submitForm();
        }
    }
};

function submitForm() {
    const form = document.getElementById('payment_form');
    form.submit();
}

//an option to submit with JSONP, replace submitForm() with ewayAjax()
function ewayAjax() {
    var form = document.getElementById("payment_form");
    eWAY.process(
        form, {
            autoRedirect: false,
            onComplete: function (data) {
                // this is a callback to hook into when the requests completes
                console.log('The JSONP request has completed. Response:' + data);
                if (data != undefined) {
                    window.location.replace(data.RedirectUrl);
                }
            },
            onError: function (e) {
                // this is a callback you can hook into when an error occurs
                alert('There was an error processing the request');
            },
            onTimeout: function (e) {
                // this is a callback you can hook into when the request times out
                alert('The request has timed out.');
            }
        }
    );

}

window.onload = () => {
    showExample(request);
    setVisibility();
};
