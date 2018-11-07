document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    //navigator.splashscreen.hide();
	localStorageApp = new localStorageApp();
	localStorageApp.run();
}

function localStorageApp() {
}

localStorageApp.prototype = {
	run:function() {
		var that = this;
		/*document.getElementById("insertVariable").addEventListener("click", function() {
			that._insertVariable.apply(that, arguments);
		});
		document.getElementById("searchVariable").addEventListener("click", function() {
			that._getVariable.apply(that, arguments);
		});
		document.getElementById("clearLocalStorage").addEventListener("click", function() {
			that._clearLocalStorage.apply(that, arguments);
		});
		document.getElementById("removeVariable").addEventListener("click", function() {
			that._removeVariable.apply(that, arguments);
		});*/
	},
    
    
	insertVariable:function(variableNameInput,valueInput) {
		localStorage.setItem(variableNameInput, valueInput);
	},
    
	getVariable:function(getRemoveVariableNameInput) {
		var result = null;
		if (localStorage.getItem(getRemoveVariableNameInput) != undefined) {
			result = localStorage.getItem(getRemoveVariableNameInput);
		}
		else {
			result = null;
		}
        return result;
	},
    
	removeVariable:function(searchRemoveNameInput) {
		var result = false;
		if (localStorage.getItem(searchRemoveNameInput) != undefined) {
			localStorage.removeItem(searchRemoveNameInput);
			result = true;
		}
		else {
			result = false;
		}
        return result
	},
    
	_clearLocalStorage:function() {
		localStorage.clear();
	}
}