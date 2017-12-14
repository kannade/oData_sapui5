sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/ui/model/odata/v2/ODataModel"
], function(JSONModel, Device, ODataModel) {
	"use strict";

	return {
		createDeviceModel: function() {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createODataMdl: function(sGroupId) {
			// var sUrl = "/sap/opu/odata/sap/ZHR_ESS_EMPLOYEES_SRV";
			var sUrl = "/sap/opu/odata/sap/ZHR_TEST1_SRV";
			var oMdl = new ODataModel(sUrl, {
				useBatch: true,
				defaultCountMode: "None", // "Request",	// 
				defaultBindingMode: "TwoWay"
			});

			var aDeferredGroup = oMdl.getDeferredGroups();
			aDeferredGroup.push(sGroupId);
			oMdl.setDeferredGroups(aDeferredGroup);
			return oMdl;
		},

		createSelMdl: function() {
			var oSelMdl = new JSONModel({
				orgeh: "50001627"
			});
			return oSelMdl;
		}
	};
});