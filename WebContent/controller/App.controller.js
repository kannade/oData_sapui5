sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/FilterOperator",
	"../model/util"
], function(
	Controller, ODataModel, JSONModel, MessageToast, MessageBox, FilterOperator, Util) {
	"use strict";

	return Controller.extend("alfa.hr.ess.Employees.controller.App", {
		onInit: function() {
			sap.ui.core.UIComponent.getRouterFor(this).attachRoutePatternMatched(this.onRouteMatched, this);
		},

		onRouteMatched: function() {
			this.onChangeFilter();
		},

		onChangeFilter: function() {
			var oTbl = this.getView().byId("__table0");
			var oSelMdl = this.getOwnerComponent().getModel("SelMdl");
			if (!oSelMdl) {
				return;
			}
			var sOrgeh = oSelMdl.getProperty("/orgeh");
			var oBindInfo = oTbl.getBindingInfo("items");

			if (oBindInfo) {
				oTbl.bindItems({
					path: oBindInfo.path, // "/EmployeeEmail", // 
					template: oBindInfo.template,
					filters: new sap.ui.model.Filter("orgeh", FilterOperator.EQ, sOrgeh)
				});
			}
		},

		onSaveBtn: function() {
			var oMdl = this.getView().getModel();

			var oBusyDlg = this.byId("BusyDlg") || new sap.m.BusyDialog(this.createId("BusyDlg"));
			oBusyDlg.open();

			oMdl.submitChanges({
				success: function() {
					MessageToast.show("Success");
					oBusyDlg.close();
				},
				error: function() {
					MessageToast.show("Error");
					oBusyDlg.close();
				}
			});
		},

		onChangeEmail: function(oEvt) {
			var objSelected = oEvt.getSource().getBindingContext().getObject();

			var oChDataMdl = new sap.ui.model.json.JSONModel(objSelected);
			this.getView().setModel(oChDataMdl, "chData");

			var oDialog = this.getView().byId("dlgId");
			if (!oDialog) {
				oDialog = new sap.ui.xmlfragment(this.getView().getId(),
					"alfa.hr.ess.Employees.view.ChangeValue", this);
				this.getView().addDependent(oDialog);
			}
			oDialog.open();
		},

		onSaveDlg: function() {
			var that = this;
			var oChDataMdl = this.getView().getModel("chData");
			var oChData = oChDataMdl.getData();
			var oDataMdl = this.getView().getModel();
			var oBusyDlg = this.byId("BusyDlg") || new sap.m.BusyDialog(this.createId("BusyDlg"));
			oBusyDlg.open();
			var sAddr = "/EmployeeEmails(pernr='" + oChData.pernr + "'" + ",begda=" + Util.formatDateToOData(oChData.begda) + ")";
			oDataMdl.update(sAddr, oChData, {
				success: function() {
					oBusyDlg.close();
					MessageToast.show("E-mail сохранен");
					var oDlg = this.getView().byId("dlgId");
					if (oDlg) {
						oDlg.close();
						this.onChangeFilter();
					}
				},
				error: function(oEvt) {
					that.handleError(oEvt);
					var oDlg = this.getView().byId("dlgId");
					if (oDlg) {
						oDlg.close();
					}
				}
			});

		},

		onDeleteBtn: function() {
			var that = this;
			var oChDataMdl = this.getView().getModel("chData");
			var oChData = oChDataMdl.getData();
			var oDataMdl = this.getView().getModel();
			var oBusyDlg = this.byId("BusyDlg") || new sap.m.BusyDialog(this.createId("BusyDlg"));
			oBusyDlg.open();
			var sAddr = "/EmployeeEmails(pernr='" + oChData.pernr + "'" + ",begda=" + Util.formatDateToOData(oChData.begda) + ")";
			oDataMdl.remove(sAddr, {
				success: function() {
					oBusyDlg.close();
					MessageToast.show("E-mail успешно удален");
				},
				error: function(oEvt) {
					that.handleError(oEvt);
				}
			});
		},

		onDeleteInTableEmailBtn: function() {
			var oSelItm = this.getView().byId("__table0").getSelectedItems();
			var oMdl = this.getView().getModel();

			var oBusyDlg = this.byId("BusyDlg") || new sap.m.BusyDialog(this.createId("BusyDlg"));
			oBusyDlg.open();

			oSelItm.forEach(function(item) {
				var oDta = item.getBindingContext().getObject();
				if (oDta) {
					oMdl.remove("/EmployeeEmails(pernr='" + oDta.pernr + "'" + ",begda=" + Util.formatDateToOData(oDta.begda) + ")", {
						groupId: this.getOwnerComponent().getGroupId()
					});
				}
			}.bind(this));

			oMdl.submitChanges({
				success: function(oEvt) {
					for (var attr in oEvt) {
						if (oEvt[attr].length) {
							oEvt[attr].forEach(function(item, i) {
								if (item.response && item.response.statusCode === "400") {
									try {
										var oMessage = JSON.parse(item.response.body);
										var sMsg = oMessage.error.message.value;
										MessageBox.error(sMsg);
									} catch (err) {
										MessageToast.show("Ошибка");
									}
								}
							});
						}
					}

					oBusyDlg.close();
				},
				error: function() {
					MessageBox.error("Error");
					oBusyDlg.close();
				},
				groupId: this.getOwnerComponent().getGroupId()
			});
		},

		onCloseDlg: function() {
			var oDlg = this.getView().byId("dlgId");
			if (oDlg) {
				oDlg.close();
			}
		},

		onCreateBtn: function() {
			var oChData = this.getView().getModel("chData").getData();

			var oDataMdl = this.getView().getModel();
			var oNewItem = {};
			oNewItem.pernr = oChData.pernr;
			oNewItem.email = oChData.email;
			oNewItem.begda = oChData.begda;
			oNewItem.begda.setHours(0, -oNewItem.begda.getTimezoneOffset(), 0, 0);
			oDataMdl.setUseBatch(false);
			var oBusyDlg = this.byId("BusyDlg") || new sap.m.BusyDialog(this.createId("BusyDlg"));
			oBusyDlg.open();
			oDataMdl.create("/EmployeeEmails", oNewItem, {
				success: function() {
					oBusyDlg.close();
					MessageToast.show("E-mail создан");
					oDataMdl.setUseBatch(true);
				},
				// лучше использовать bind
				error: this.handleError.bind(this)
					// error: function(oEvt) {
					// 	that.handleError(oEvt);
					// }
			});
			// oDataMdl.setUseBatch(true);
		},

		handleError: function(oEvt) {
			// вернем режим в batch
			var oDataMdl = this.getView().getModel();
			if (oDataMdl) {
				oDataMdl.setUseBatch(true);
			}

			var oBusyDlg = this.byId("BusyDlg");
			oBusyDlg.close();

			// Вариант 1 передача через header
			if (oEvt.headers.error) {
				MessageBox.error(decodeURIComponent(oEvt.headers.error));
			} else {
				// Вариант 2 передача в теле ответа
				try {
					var sMsg = decodeURIComponent(JSON.parse(oEvt.responseText).error.innererror.errordetails["0"].message);
					MessageBox.error(sMsg);
				} catch (err) {
					MessageToast.show("Ошибка");
				}
			}
		},

		onTblDetail: function(oEvt) {
			var oItem = oEvt.getSource();
			var selObj = oItem.getBindingContext().getObject();

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("detail", {
				empId: selObj.pernr
			});
		}
	});
});