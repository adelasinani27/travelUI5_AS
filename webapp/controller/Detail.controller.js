sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";
    return Controller.extend("flightui5as.controller.Detail", {
        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteDetail").attachPatternMatched(this._onObjectMatched, this);
        },
        _onObjectMatched: function (oEvent) {
    var sCarrid = oEvent.getParameter("arguments").Carrid;
    var oGlobalModel = this.getOwnerComponent().getModel("flightDataModel");
    var aData = oGlobalModel.getData();
    // Find index of flight
    var iIndex = aData.findIndex(function (item) {
        return item.Carrid === sCarrid;
    });
    if (iIndex === -1) {
        console.warn("No flight found for Carrid:", sCarrid);
        return;
    }
    this.getView().bindElement({
        path: "/"+iIndex,
        model: "flightDataModel"
    });
}
,
        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteMain", {}, true);
        }
    });
});
