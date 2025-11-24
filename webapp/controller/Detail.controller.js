sap.ui.define([
    "sap/ui/core/mvc/Controller",
    // "sap/ui/model/json/JSONModel",
    "flightui5as/formatter/Formatter",
    "sap/m/MessageToast"
], (Controller, Formatter, MessageToast) => {
    "use strict";

    return Controller.extend("flightui5as.controller.Detail", {

        formatter: Formatter,

        onInit: function () {

            debugger
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

                success: function (oresponse) {
                    console.log(oresponse);
                    oDetailJSONModel.setData(oresponse);
                    that.getView().setModel(oDetailJSONModel, "FlDetailModel");
                    console.log(that.getView().getModel("FlDetailModel"));
                },
                error: function (oerror) { },
            });
        },
        onDeleteDetailRow: function (oEvent) {
            var oButton = oEvent.getSource();
            var oContext = oButton.getBindingContext("FlDetailModel");
            var oRowData = oContext.getObject();
            debugger
            this._rowToDelete = oRowData;
            // Informative delete message using Connid and Fldate
            var message = "Delete flight " + oRowData.Connid + " on " + oRowData.Fldate + "?";
            this._showDeleteConfirmation(message);
        },
        _showDeleteConfirmation: function(sMessage) {
            if (!this.oDeleteDialog) {
                this.loadFragment({
                    name: "flightui5as.fragment.DeleteConfirmation"
                }).then(
                    function (oDialog) {
                        this.oDeleteDialog = oDialog;
                        this.getView().byId("deleteConfirmText").setText(sMessage);
                        this.oDeleteDialog.open();
                    }.bind(this)
                );
            } else {
                this.getView().byId("deleteConfirmText").setText(sMessage);
                this.oDeleteDialog.open();
            }
        },

        onConfirmDelete: function () {
            if (!this._rowToDelete) {
                return;
            }
            var that = this;
            var oDataModel = this.getOwnerComponent().getModel();

            // Pass all necessary key parameters for delete
            var params = {
                Carrid: this._rowToDelete.Carrid,
                Connid: this._rowToDelete.Connid,
                // Fldate: this._rowToDelete.Fldate,
            
            };

            this.oDeleteDialog.setBusy(true);

            oDataModel.callFunction("/delete_flight_detail", {
                method: "POST",
                urlParameters: params,
                success: function (oData, response) {
                    that.oDeleteDialog.setBusy(false);
                    that.oDeleteDialog.close();
                    // that._refreshDetails();
                    MessageToast.show("Flight deleted successfully");
                    that._rowToDelete = null;
                },
                error: function (oError) {
                    that.oDeleteDialog.setBusy(false);
                    MessageToast.show("Error deleting flight");
                    that.oDeleteDialog.close();
                    that._rowToDelete = null;
                }
            });
        },


        onCancelDelete: function () {
            this.oDeleteDialog.close();
            this._rowToDelete = null;
        },

        // _refreshDetails: function () {
        //     // Refresh the details for the current Carrid
        //     var oRouter = this.getOwnerComponent().getRouter();
        //     var sCarrid = this.getView().getBindingContext().getProperty("Carrid");
        //     // Or keep Carrid in the controller as needed
        //     this._onObjectMatched({ getParameter: () => ({ Carrid: sCarrid }) });
        // }
    });
});
