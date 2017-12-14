sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"alfa/hr/ess/Employees/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("alfa.hr.ess.Employees.Component", {
		sMailGroup: "sMailGroup",
		metadata: {
			manifest: "json"
		},

		init: function() {
			UIComponent.prototype.init.apply(this, arguments);
			this.setModel(models.createDeviceModel(), "device");

			this.setModel(models.createODataMdl(this.getGroupId()));
			this.setModel(models.createSelMdl(), "SelMdl");

			// инициализация роутера
			this.getRouter().initialize();
		},

		getGroupId: function() {
			return this.sMailGroup;
		}
	});
});