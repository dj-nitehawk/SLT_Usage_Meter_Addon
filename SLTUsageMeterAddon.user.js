// ==UserScript==
// @name         SLT Usage Meter
// @version      3.4
// @description  Calculate off peak data
// @author       dj-NiteHawk
// @match        https://internetvas.slt.lk/dashboard
// @updateURL    https://github.com/dj-nitehawk/SLT_Usage_Meter_Addon/raw/master/SLTUsageMeterAddon.user.js
// @downloadURL  https://github.com/dj-nitehawk/SLT_Usage_Meter_Addon/raw/master/SLTUsageMeterAddon.user.js
// ==/UserScript==

(function () {
  'use strict';

  var interval = setInterval(myTimer, 500);

  function myTimer() {

    function daysInThisMonth() {
      var now = new Date();
      return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    }

    var peakElement = document.querySelector("#root > div > div > div:nth-child(3) > div > div > div > div:nth-child(3) > div.col-md-8 > div > div:nth-child(1) > div > div > div > div:nth-child(1) > div > div > div:nth-child(4) > h6");
    var peakTotalGB = parseFloat(peakElement.innerHTML.split(" ")[5].replace("GB", "").replace(" ", ""));
    var peakUsedGB = parseFloat(peakElement.innerHTML.split(" ")[2].split(">")[2].replace("GB", ""));
    var totalElement = document.querySelector("#root > div > div > div:nth-child(3) > div > div > div > div:nth-child(3) > div.col-md-8 > div > div:nth-child(1) > div > div > div > div:nth-child(2) > div > div > div:nth-child(4) > h6");
    var totalUsedGB = peakUsedGB;
    var totalGB = peakTotalGB;
    if (totalElement) {
      totalUsedGB = parseFloat(totalElement.innerHTML.split(" ")[2].split(">")[2].replace("GB", ""));
      totalGB = parseFloat(totalElement.innerHTML.split(" ")[5].replace("GB", ""));
    }
    var targetElement = document.querySelector("#root > div > div > div:nth-child(3) > div > div > div > div:nth-child(3) > div.col-md-8 > div > div:nth-child(1) > div > h2");

    var totalRemainGB = (totalGB - totalUsedGB);
    var peakRemainGB = (peakTotalGB - peakUsedGB);
    var offPeakTotalGB = (totalGB - peakTotalGB);
    var offPeakUsedGB = (totalUsedGB - peakUsedGB);
    var offPeakRemainGB = (totalRemainGB - peakRemainGB);
    var remainDays = ((daysInThisMonth() + 1) - (new Date()).getDate());
    var perDayGB = (peakTotalGB / daysInThisMonth());
    var neededGB = (perDayGB * remainDays);
    var bufferGB = (peakRemainGB - neededGB);
    var balanceGB = (parseFloat(perDayGB) + parseFloat(bufferGB));

    var color = "";
    if (bufferGB < 0 - perDayGB) {
      color = "red";
    }
    if (bufferGB > 0 - perDayGB && bufferGB < 0) {
      color = "green";
    }

    var peakLabel = "";
    var offPeakLabel = "";

    if (totalElement) {
      peakLabel = "Peak ";
      offPeakLabel = "Off-Peak Balance: " + offPeakRemainGB.toFixed(2) + " GB | Total: " + offPeakTotalGB.toFixed(0) + "GB";
    }

    targetElement.innerHTML =
      "<div style='text-align:center;border: 1px solid #e6e6e6;box-shadow: 3px 5px 10px 0px #9e9e9e;background-color: #f3f3f3;border-radius: 18px;padding: 10px;'>" +
      "<span style='font-size:35px; color:" + color + ";'>" +
      peakLabel + "Buffer: " + balanceGB.toFixed(2) + " GB</span><br/>" +
      peakLabel + "Balance: " + peakRemainGB.toFixed(2) + " GB | Total: " + peakTotalGB.toFixed(0) + " GB<br/>" +
      offPeakLabel +
      "</div>";

    clearInterval(interval);
  }
})();
