sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";
    return Controller.extend("flightui5as.controller.Main", {
        onInit() {
            var oFlightJSONModel = new sap.ui.model.json.JSONModel();
            var that = this;
            var oDataModel = this.getOwnerComponent().getModel();
            var sPath = "/FlightAS";
            oDataModel.read(sPath, {
                sorters: [new sap.ui.model.Sorter("Carrid", false)],
                success: function (oresponse) {
                    oFlightJSONModel.setData(oresponse.results);
                    that.getOwnerComponent().setModel(oFlightJSONModel, "flightDataModel");
                },
                error: function (oerror) { 
                    console.log("error")
                },
            });
        },
        onRowPress: function (oEvent) {
            var oItem = oEvent.getParameter("listItem") || oEvent.getSource();
            var oCtx = oItem.getBindingContext("flightDataModel");
            var sCarrid = oCtx.getProperty("Carrid");
            this.getOwnerComponent().getRouter().navTo("RouteDetail", { Carrid: sCarrid });
        }
    });
});
