sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "flightui5as/Formatter/Formatter",
], (Controller, Formatter) => {
    "use strict";

    return Controller.extend("flightui5as.controller.Detail", {

        formatter: Formatter,

        onInit: function () {
            
           console.log("Direct test formatter:", Formatter);
           // Duhet të shfaqë objekt me getCarrierLogo, formatTableDates, urlFormatter
           console.log("Direct test formatter LH:", Formatter.getCarrierLogo && Formatter.getCarrierLogo("LH"));

            this.getOwnerComponent().getRouter().getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);
            this.getView().getModel("FlDetailModel");
            
        },

        _onObjectMatched: function (oEvent) {
    var sCarrid = oEvent.getParameter("arguments").Carrid;
    var that = this;
    var oDataModel = this.getOwnerComponent().getModel();
    var sPath = "/FlightAS(Carrid='" + sCarrid + "',IsActiveEntity=true)";
    var oDetailJSONModel = new sap.ui.model.json.JSONModel();

    oDataModel.read(sPath, {
        urlParameters: {
            "$expand": "to_FlightDetailAS"
        },

        success: function (oresponse){
            console.log(oresponse);
            oDetailJSONModel.setData(oresponse);
            that.getView().setModel(oDetailJSONModel, "FlDetailModel");
            console.log(that.getView().getModel("FlDetailModel"));
        },
        error: function (oerror) { },
    });
},
    });
});