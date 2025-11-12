sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "flightui5as/formatter/Formatter"
], (Controller, JSONModel, Formatter) => {
    "use strict";
    return Controller.extend("flightui5as.controller.Main", {
        formatter: Formatter,
        
        onInit() {
            var oFlightJSONModel = new sap.ui.model.json.JSONModel();
            var that = this;
            var oDataModel = this.getOwnerComponent().getModel();
            var sPath = "/FlightAS";
            oDataModel.read(sPath, {
                sorters: [new sap.ui.model.Sorter("Carrid", false)],
                success: function (oresponse) {
                    oFlightJSONModel.setData(oresponse.results);
                    that.getView().setModel(oFlightJSONModel, "flightDataModel");
                },
                error: function (oerror) { 
                    console.log("error")
                },
            });
        },
        onListPress: function (oItem) {
            this.getOwnerComponent().getRouter().navTo("Detail", {
                Carrid: oItem.getSource().getBindingContext("flightDataModel").getProperty("Carrid")
            });
        }
    });
});
