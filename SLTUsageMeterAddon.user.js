// ==UserScript==
// @name         SLT Usage Meter
// @version      3.2
// @description  Calculate off peak data
// @author       dj-NiteHawk
// @match        https://internetvas.slt.lk/dashboard
// @updateURL    https://github.com/dj-nitehawk/SLT_Usage_Meter_Addon/raw/master/SLTUsageMeterAddon.user.js
// @downloadURL  https://github.com/dj-nitehawk/SLT_Usage_Meter_Addon/raw/master/SLTUsageMeterAddon.user.js
// ==/UserScript==

(function() {
    'use strict';

    var interval = setInterval(myTimer, 500);

    function myTimer(){

        function daysInThisMonth() {
            var now = new Date();
            return new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
        }

        var peakElement = document.querySelector("#root > div > div > div:nth-child(3) > div > div > div > div:nth-child(3) > div.col-md-8 > div > div:nth-child(1) > div > div > div > div:nth-child(1) > div > div > div:nth-child(4) > h6");
        var peakTotalGB = parseFloat(peakElement.innerHTML.split(" ")[5].replace("GB","").replace(" ",""));
        var peakUsedGB = parseFloat(peakElement.innerHTML.split(" ")[2].split(">")[2].replace("GB",""));
        var totalElement = document.querySelector("#root > div > div > div:nth-child(3) > div > div > div > div:nth-child(3) > div.col-md-8 > div > div:nth-child(1) > div > div > div > div:nth-child(2) > div > div > div:nth-child(4) > h6");
        var totalUsedGB = parseFloat(totalElement.innerHTML.split(" ")[2].split(">")[2].replace("GB",""));
        var totalGB = parseFloat(totalElement.innerHTML.split(" ")[5].replace("GB",""));
        var targetElement = document.querySelector("#root > div > div > div:nth-child(3) > div > div > div > div:nth-child(3) > div.col-md-8 > div > div:nth-child(1) > div > h2");

        var totalRemainGB = (totalGB - totalUsedGB);
        var peakRemainGB = (peakTotalGB - peakUsedGB);
        var offPeakTotalGB = (totalGB - peakTotalGB);
        var offPeakUsedGB = (totalUsedGB - peakUsedGB);
        var offPeakRemainGB = (totalRemainGB - peakRemainGB);
        var remainDays = ((daysInThisMonth()+1) - (new Date()).getDate());
        var perDayGB = (peakTotalGB / daysInThisMonth());
        var neededGB = (perDayGB * remainDays);
        var bufferGB = (peakRemainGB - neededGB);
        var balanceGB = (parseFloat(perDayGB) + parseFloat(bufferGB));

        var color = "";
        if (bufferGB < 0-perDayGB){
            color = "red";
        }
        if (bufferGB > 0-perDayGB && bufferGB < 0){
            color = "green";
        }

        targetElement.innerHTML =
            "<div style='text-align:center'>"+
            "<span style='font-size:35px; color:" + color + ";'>"+
            "Peak Buffer: " + balanceGB.toFixed(2) + " GB</span><br/>"+
            "Peak Balance: " + peakRemainGB.toFixed(2) + " GB | Total: " + peakTotalGB.toFixed(0) + " GB<br/>"+
            "Off-Peak Balance: " + offPeakRemainGB.toFixed(2) + " GB | Total: " + offPeakTotalGB.toFixed(0) + "GB"+
            "</div>";

        clearInterval(interval);
    }
})();
