// ==UserScript==
// @name         SLT Usage Meter
// @version      4.1.1
// @description  Calculate off peak data
// @author       dj-NiteHawk
// @match        https://myslt.slt.lk/boardBand/summary
// @updateURL    https://github.com/dj-nitehawk/SLT_Usage_Meter_Addon/raw/master/SLTUsageMeterAddon.user.js
// @downloadURL  https://github.com/dj-nitehawk/SLT_Usage_Meter_Addon/raw/master/SLTUsageMeterAddon.user.js
// ==/UserScript==

(function () {
    'use strict';

    function daysInThisMonth() {
        var now = new Date();
        return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    }

    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    var timer1 = setInterval(Usage, 1000);

    function Usage() {

        var peakElement = getElementByXpath('//div[text()="Standard"]/..//div[@class="used-of"]');
        var peakTotalGB = parseFloat(peakElement.innerText.split(" ")[4]);
        var peakUsedGB = parseFloat(peakElement.innerText.split(" ")[0]);
        var totalElement = getElementByXpath('//div[text()="Total (Standard + Free)"]/..//div[@class="used-of"]');
        var totalUsedGB = peakUsedGB;
        var totalGB = peakTotalGB;
        if (totalElement) {
            totalUsedGB = parseFloat(totalElement.innerText.split(" ")[0]);
            totalGB = parseFloat(totalElement.innerText.split(" ")[4]);
        }
        var targetElement = getElementByXpath('//p[@class="graph-body-title"]');

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
            color = "#cf1010";
        }
        if (bufferGB > 0 - perDayGB && bufferGB < 0) {
            color = "#55c755";
        }

        var peakLabel = "";
        var offPeakLabel = "";

        if (totalElement) {
            peakLabel = "Peak ";
            offPeakLabel = "Off-Peak Balance: " + offPeakRemainGB.toFixed(2) + " GB | Total: " + offPeakTotalGB.toFixed(0) + "GB";
        }

        targetElement.innerHTML =
            "<div style='text-align:center;border: 1px solid #275596; background-color: #0b2a58;border-radius: 7px;padding: 10px;color: #cdcdcd;margin: 20px;'>" +
            "<span style='font-size:35px; color:" + color + ";'>" +
            peakLabel + "Buffer: " + balanceGB.toFixed(2) + " GB</span><br/>" +
            peakLabel + "Balance: " + peakRemainGB.toFixed(2) + " GB | Total: " + peakTotalGB.toFixed(0) + " GB<br/>" +
            offPeakLabel +
            "</div>";

        clearInterval(timer1);
    }

    var timer2 = setInterval(AnyTimeUsage, 1000);

    function AnyTimeUsage() {

        var totalElement = getElementByXpath('//div[text()="Any Time Usage."]/..//div[@class="used-of"]');
        var totalUsedGB = parseFloat(totalElement.innerText.split(" ")[0]);
        var totalGB = parseFloat(totalElement.innerText.split(" ")[4]);

        var targetElement = getElementByXpath('//p[@class="graph-body-title"]');

        var totalRemainGB = (totalGB - totalUsedGB);
        var remainDays = ((daysInThisMonth() + 1) - (new Date()).getDate());
        var perDayGB = (totalGB / daysInThisMonth());
        var neededGB = (perDayGB * remainDays);
        var bufferGB = (totalRemainGB - neededGB);
        var balanceGB = (parseFloat(perDayGB) + parseFloat(bufferGB));

        var color = "";
        if (bufferGB < 0 - perDayGB) {
            color = "#cf1010";
        }
        if (bufferGB > 0 - perDayGB && bufferGB < 0) {
            color = "#55c755";
        }

        targetElement.innerHTML =
            "<div style='text-align:center;border: 1px solid #275596; background-color: #0b2a58;border-radius: 7px;padding: 10px;color: #cdcdcd;margin: 20px;'>" +
            "<span style='font-size:35px; color:" + color + ";'>" +
            "Buffer: " + balanceGB.toFixed(2) + " GB</span><br/>" +
            "Balance: " + totalRemainGB.toFixed(2) + " GB | Total: " + totalGB.toFixed(0) + " GB<br/>"
            "</div>";

        clearInterval(timer2);
    }
})();
