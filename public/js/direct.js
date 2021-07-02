const request = {
    "paymentInstrument": {
        "paymentType": "GooglePay",
        "walletDetails": {
            "Token": "<<GPay Token Goes Here>>"
        }
    },
    "Payment": {
        "TotalAmount": 100,
        "currencyCode": "AUD"
    },
    "Method": "ProcessPayment",
    "TransactionType": "Ecom"
};

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
            $("#EWAY_GOOGLEPAY_NETWORKTOKEN").val(data);
             var subtotal = FormatMoney(($("#amountExample").val()));
            var request = setupRequest(data, subtotal);
            $(".overlay").show();
            $.ajax({
                url: "/payments/direct/",
                type: "POST",
                data: request,
                success: function (resultData) {
                    if (resultData !== "" ) {
                        $("#preExample").hide();
                        $("form").hide();
                        $(".overlay").hide();
                        $("#basicReq").hide();
                         $("#resetBtn").show(200);

                       showResult(resultData);
                    } else if (resultData.type === "content") {
                        show_errormessages_top(resultData.data);
                        $("#loader-wrapper").fadeOut("slow");
                    }
                }
            });
        }
    },
};

function showResult(resultData) {
    var pre = $("#preResult");
    var strResult = library.json.prettyPrint(resultData);
    pre.html(strResult).show(200);
}

function setupRequest(token){
    request.paymentInstrument.walletDetails.Token = token;
    request.Payment.TotalAmount = $("#amountExample").val() * 100;

    return request;
}

function setVisibility(){
    $("#preResult").hide();
    $(".overlay").hide();
    $("#resetBtn").hide();
}

function reset(){
        window.location.reload();
    }

window.onload = ()=>{
    showExample(request);
    setVisibility();
};
