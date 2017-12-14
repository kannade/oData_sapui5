sap.ui.define([], function() {
	"use strict";

	return {
		formatDateToOData: function(oDate) {
			oDate.setHours(0, -oDate.getTimezoneOffset(), 0, 0);
			// вариант 1 через sapui5
			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern: "yyyy-MM-ddTHH:mm:ss"});
			var sDate = oDateFormat.format(oDate);

			// вариант 2 чистый JS
			// var sDate = oDate.toISOString().substring(0, 19);

			var sVal = "datetime'" + encodeURIComponent(sDate) + "'";
			return sVal;
		}
	};
});