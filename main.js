var json;
var currencyCode;
var formatCode = /[A-Za-z]/;
var formatCurrency = /\d{1,6}(,\d{1,2})?/;
var currencyList = [];
var index = 0;
var id;
var PLN = {};
url = "http://api.nbp.pl/api/exchangerates/tables/a/?format=json";

$(document).ready(function () {
    PobierzJSON();
    Uzupelnij();
    sprawdzKlawiature();
});

function PobierzJSON() {
    $.getJSON(url, function (data) {

        json = data[0].rates; // pobranie walut
        // Dodanie zlotówki
        PLN["currency"] = "Polska złotówka";
        PLN["code"] = "PLN"
        PLN["mid"] = "1"
        json.push(PLN);

        var toCurrencyInput = document.getElementById("toCurrencyCodeDataList");
        var fromCurrencyDropdown = document.getElementById("fromCurrencyDropdown");
        json.forEach(function (item) {
            currencyList.push(item.code);
            var option2 = document.createElement('option');
            option2.text = item.code;
            fromCurrencyDropdown.appendChild(option2);
        });
    });
}


function PobierzWartosc(indx) {

    index = indx.selectedIndex;

    if (currencyQtyInput != null && id != null) {
        Oblicz(currencyQtyInput);
    }

    $('#result').text('');
    $('#result').append(onclick, "<p> Kup i Sprzedaj 1 " + json[index].currency + " za: " + Math.round(json[index].mid * 100) / 100 + " PLN.</p>");


}

function walidacja() {
    currencyCode = document.getElementById("toCurrencyCodeInput").value.toUpperCase();

    if (formatCode.test(currencyCode) && currencyCode.length == 3) {
        $('#change').text('');
        if ($.inArray(currencyCode, currencyList) != -1) {
            id = $.inArray(currencyCode, currencyList);
            if (currencyQtyInput != null && index != null) {
                Oblicz(currencyQtyInput);
            }
        }
        else if ($.inArray(currencyCode, currencyList) == -1) {
            PokazZagrozenie('#BrakWaluty');
        }

    }
    else if (!formatCode.test(currencyCode) && currencyCode != "") {
        PokazZagrozenie('#bladFormatu');
    }

}

function PokazZagrozenie(alertId) {
    $(alertId).slideDown(500, function () {// <- czas zwiniecia uwagi
        setTimeout(function () {
            $(alertId).slideUp(500); // <--- czas rozwiniecia uwagi
        }, 1800); // <--- ta wartosc to czas pokazania uwagi
    });

}


function Oblicz() {

    currencyQtyInput = document.getElementById("currencyQtyInput").value;
    if (formatCurrency.test(currencyQtyInput) && currencyCode != null && currencyCode.length == 3 && currencyQtyInput > 0) {
        $('#change').text('');
        $('#change').val(Math.round((json[index].mid * currencyQtyInput * 100) / json[id].mid) / 100 + " " + currencyCode);

    }
}

function Uzupelnij() {
    $('#toCurrencyCodeInput').autocomplete(
        {
            source: currencyList,
            select: function (event, ui) {
                setTimeout(walidacja, 100);
            }
        });
}

/*    ZABRANIA WPISANIA PRZECINKOW gdy w html jest min=0
function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : event.keyCode;
    return !(charCode > 31 && (charCode < 48 || charCode > 57));
}

*/
function sprawdzKlawiature() {
    $('#currencyQtyInput').keydown(function (k) {
        /*
           8 - backspace
           9 - tab
           13 - enter
           46 - delete
           110 - kropka
           188 - przecinek 
           190 - tez kropa
           39 prawa strzalka
           37 - lewa strzalka
        */
        if ($.inArray(k.keyCode, [8, 9, 13, 37, 39, 46, 110, 188, 190]) !== -1) {
            return;
        }
        /*
           numpad 0	96
           numpad 1	97
           numpad 2	98
           numpad 3	99
           numpad 4	100
           numpad 5	101
           numpad 6	102
           numpad 7	103	
           numpad 8	104
           numpad 9	105

           od 46 do 57 to liczby na literami
       */
        if ((k.keyCode < 96 || k.keyCode > 105) && (k.keyCode < 48 || k.keyCode > 57)) {
            k.preventDefault();
            PokazZagrozenie('#blednyFormatKwoty');
        }
    });
}
