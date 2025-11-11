sap.ui.define([
    "sap/ui/model/type/Time",
    "sap/ui/core/format/DateFormat"
], function (Time, DateFormat) {
    "use strict";

    return {
        formatTableDates: function (oDate) {
            if (!oDate) {
                return "";
            }

            var date = new Date(oDate);

            // Format to DD.MM.YYYY
            var day = String(date.getDate()).padStart(2, "0");
            var month = String(date.getMonth() + 1).padStart(2, "0");
            var year = date.getFullYear();

            return day + "." + month + "." + year;
        },

        urlFormatter: function (sUrl, sCarrname) {
            if (!sUrl) {
                if (sCarrname) {
                    return "www." + sCarrname.replace(/\s+/g, '').toLowerCase() + ".com";
                } else {
                    return "www.defaultairline.com";
                }
            }
            return sUrl;
        },

    getCarrierLogo: function (sCarrid) {
    var sPath;
    switch (sCarrid) {
        case "LH":
            sPath = "img/lufthansa.png";
            break;
        case "AB":
            sPath = "img/Logo_airberlin.svg.png";
            break;
        default:
            sPath = "img/default_logo.png";
            break;
    }
    return sPath;
}
    };
});
