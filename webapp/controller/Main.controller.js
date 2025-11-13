sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "flightui5as/formatter/Formatter",
    "sap/m/MessageToast"
], (Controller, Formatter, MessageToast) => {
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

            // var addparam = {
            //    Carrid: sCarrid,
            //    Carrname: sCarrname,
            //    Currcode: sCurrcode,
            //    Url: sUrl

            // };

            var that=this;
            var oDataModel = this.getOwnerComponent().getModel();
            this.oDialog.setBusy(true);
            //var sPath = "/FlightAS";
            oDataModel.callFunction("/create_airline", {
                method: "POST" ,
                urlParameters: mParams,
                success: function (oData, response) {
                    //NXIRR SUCCESS MESAGGE
                    //MBYLL DIALOGUN (POPUPI)
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