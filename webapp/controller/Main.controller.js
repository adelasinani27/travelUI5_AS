sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "flightui5as/formatter/Formatter",
    "sap/m/MessageToast",
    "sap/ui/export/Spreadsheet"
], (Controller, Formatter, MessageToast, Spreadsheet) => {
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
                    console.log(oresponse);
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
                Carrid: oItem.getSource().getBindingContext("flightDataModel").getProperty().Carrid
            });
       },

        //***************************************************
        //********************Open Create Dialog*************
        //************************************************** */
        onAddNewRecord: function () {
            if (!this.oDialog) {
                this.loadFragment({
                    name: "flightui5as.fragment.CreateAirline", ///home/user/projects/flight_ui5_as/webapp/fragment/CreateAirline.fragment.xml
                }).then(
                    function (oDialog) {
                        this.oDialog = oDialog;
                        this.oDialog.open();
                    }.bind(this)
                );
            } else {
                this.oDialog.open();
            }
        },


        onCreateNewRecord: function(){
            //debugger;
            var sCarrid = this.getView().byId("carrIDInput").getValue();

            if(!sCarrid){
                MessageToast.show("Empty CarrID is not allowed");
                return;
            };
            
            var mParams = {
            Carrid: this.getView().byId("carrIDInput").getValue(),
            Carrname: this.getView().byId("carrNameInput").getValue(),
            Currcode: this.getView().byId("currCodeInput").getValue(),
            Url: this.getView().byId("URLInput").getValue(),
            };
            var that=this;
            var oDataModel = this.getOwnerComponent().getModel();
            this.oDialog.setBusy(true);
            //var sPath = "/FlightAS";
            oDataModel.callFunction("/create_airline", {
                method: "POST" ,
                urlParameters: mParams,
                success: function (oData, response) {
                    //NXIRR SUCCESS MESAGGE
                    //MBYLL DIALOGUN (POPUPI)        NE ECLIPSE, UPDATE FIELD, DHE PA PERFSHIRE CARRID...
                    that.oDialog.close(); //close the dialog
                    that.oDialog.setBusy(false);//set dialog busy false
                    that.readFlight(that);//update the model//new function
                    MessageToast.show("Airline created successfully");

                    //I MARRIM TE DHENAT NGA TAB ME READ DHE TE DHENAT E LEXUARA JA JAPIM MODELIT=>
                    //oFlightJSONModel.setData(oresponse.results);
                    //that.getView().setModel(oFlightJSONModel, "flightDataModel");
                },
                error: function (oerror) { 
                    MessageToast.show("An error occurred");
                    that.oDialog.close();
                  }
            });
        },

    
        onCancelRecord: function(){
            this.oDialog.close();
        },

        onUpdateRecord: function () {
            
            var oTable = this.getView().byId("flightTable");
            var oSelectedItem = oTable.getSelectedItem(); // Use getSelectedItem() for SingleSelectLeft mode
            
            
            if (!oSelectedItem) {
                MessageToast.show("Please select an airline to update");
                return;
            }
             
            // Get the data of the selected item
            var oContext = oSelectedItem.getBindingContext("flightDataModel");
            var oSelectedData = oContext.getObject();

             console.log("Selected airline data:", oSelectedData);
            
            // Store selected data in a local model for the dialog
            var oUpdateModel = new sap.ui.model.json.JSONModel(oSelectedData);
            this.getView().setModel(oUpdateModel, "updateModel");
            
            // Open the update dialog
            if (!this.oUpdateDialog) {
                this.loadFragment({
                    name: "flightui5as.fragment.UpdateAirline" // FIXED: Changed to match actual fragment name
                }).then(
                    function (oDialog) {
                        this.oUpdateDialog = oDialog;
                        this.oUpdateDialog.open();
                    }.bind(this)
                );
            } else {
                this.oUpdateDialog.open();
            }
        },

        onSaveUpdatedRecord: function () {
            // Get values from the dialog inputs
            var sCarrid = this.getView().byId("carrIDInputUpdate").getValue();
            var sCarrname = this.getView().byId("carrNameInputUpdate").getValue();
            var sCurrcode = this.getView().byId("currCodeInputUpdate").getValue();
            var sUrl = this.getView().byId("URLInputUpdate").getValue();
            
            // Validation: Check if required fields are filled
            if (!sCarrid || !sCarrname || !sCurrcode) {
                MessageToast.show("Please fill all required fields");
                return;
            }
            
            // Prepare parameters for the backend call
            var mParams = {
                Carrid: sCarrid,
                Carrname: sCarrname,
                Currcode: sCurrcode,
                Url: sUrl
            };
            
            var that = this;
            var oDataModel = this.getOwnerComponent().getModel();
            
            // Set dialog to busy state
            this.oUpdateDialog.setBusy(true);
            
            // Call the backend update function
            oDataModel.callFunction("/update_airline", {
                method: "POST",
                urlParameters: mParams,
                success: function (oData, response) {
                    // Close the dialog
                    that.oUpdateDialog.close();
                    // Remove busy state
                    that.oUpdateDialog.setBusy(false);
                    // Refresh the table data
                    that.readFlight(that);
                    // Show success message
                    MessageToast.show("The Airline Updated Successfully");
                },
                error: function (oError) {
                    // Remove busy state
                    that.oUpdateDialog.setBusy(false);
                    // Show error message
                    MessageToast.show("An error occurred while updating");
                    that.oUpdateDialog.close();
                }
            });
        },

        //***************************************************
        //********************CANCEL UPDATE DIALOG***********
        //***************************************************
        onCancelUpdateRecord: function () {
            this.oUpdateDialog.close();
        },


        onDeleteSingleItem: function(oEvent) {
            var oButton = oEvent.getSource();
            var oContext = oButton.getBindingContext("flightDataModel");
            var oData = oContext.getObject();
            
            // Store for deletion
            this._itemToDelete = oData;
            
            // Show confirmation dialog
            this._showDeleteConfirmation(
                "Are you sure you want to delete airline " + oData.Carrid + " (" + oData.Carrname + ")?"
            );
        },

        // Show confirmation dialog
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

        // Confirm deletion
        onConfirmDelete: function() {
            if (!this._itemToDelete) {
                return;
            }
            
            var that = this;
            var oDataModel = this.getOwnerComponent().getModel();
            var mParams = {
                Carrid: this._itemToDelete.Carrid,
                
            };
            
            this.oDeleteDialog.setBusy(true);
            
            oDataModel.callFunction("/delete_airline", {
                method: "POST",
                urlParameters: mParams,
                success: function (oData, response) {
                    that.oDeleteDialog.setBusy(false);
                    that.oDeleteDialog.close();
                    that.readFlight(that);
                    MessageToast.show("Airline deleted successfully");
                    that._itemToDelete = null;
                },
                error: function (oError) {
                    that.oDeleteDialog.setBusy(false);
                    MessageToast.show("An error occurred while deleting");
                    that.oDeleteDialog.close();
                    that._itemToDelete = null;
                }
            });
        },

        // Cancel deletion
        onCancelDelete: function() {
            this.oDeleteDialog.close();
            this._itemToDelete = null;
        },


        onExport: function () {
            var oModel = this.getView().getModel("flightDataModel");
            var aData = oModel.getData();   // your table data array
            if (!aData || aData.length === 0) {
                sap.m.MessageToast.show("No data to export.");
                return;
            }
            // Define Excel Columns (match your table)
            var aCols = [
                { label: "Carrid", property: "Carrid" },
                { label: "Carrname", property: "Carrname" },
                { label: "Url", property: "Url" }
              
            ];
            // Spreadsheet settings
            var oSettings = {
                workbook: {
                    columns: aCols
                },
                dataSource: aData,
                fileName: "Air.xlsx"
            };
            var oSpreadsheet = new sap.ui.export.Spreadsheet(oSettings);
            oSpreadsheet.build()
                .then(function () {
                    sap.m.MessageToast.show("Excel downloaded.");
                })
                .catch(function (error) {
                    console.error(error);
                })
                .finally(function () {
                    oSpreadsheet.destroy();
                });
        },




        readFlight: function(that){
            //ca kemi deklaruar ne onINIT, nje read te flight dhe mbushim modelin...that.getowner.component....
            var oFlightModel = that.getView().getModel("flightDataModel");
            var oDataModel = that.getOwnerComponent().getModel();
            var sPath = "/FlightAS";

            oDataModel.read(sPath,{
                sorters: [new sap.ui.model.Sorter("Carrid", false)],
                success: function(oresponse){
                    console.log(oresponse);
                    oFlightModel.setData(oresponse.results);
                },
                error: function (oerror){},
            });

        },
    });
});