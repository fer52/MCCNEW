document.addEventListener("deviceready", onDeviceReady, false);
var timeCnn = null;
var timeOnline = null, keyOnline = '';
var timeResponse = null;
var lapsResponse = 0;

var urlCloud = "http://appmcc.websolutions.com.gt/device.ashx";
//"http://localhost:58005/mccAppOnline/device.ashx";
//url: "http://appmcc.websolutions.com.gt/device.ashx",


function onDeviceReady() {
	//navigator.splashscreen.hide();
	deviceInfoApp = new deviceInfoApp();
	deviceInfoApp.run();
}

function deviceInfoApp() {
}

deviceInfoApp.prototype = {
    getUUID: function() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random()*8)%8 | 0;
            d = Math.floor(d/8);
            return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        });
        return uuid;
    },
    startOnline: function(){
        var me = this;
        clearInterval(timeOnline);
        //if(fileAppNew.client.ipInfo==1){
                        
            timeOnline = setInterval(function(){
                me._getRequest(fileAppNew.client.uuidFile);
                //console.log(keyOnline)
            },120000);

        //}
        
    },
    stopOnline:function(){
        clearInterval(timeOnline);        
    },
    start: function(){
        var that = this;        
        //$("#keyDevice").text('asdf');
        
        $("#keyDevice").text(that.getUUID());

        timeCnn = setInterval(function(){
            that._getRequest($("#keyDevice").text());
        },6000);
        
    },
    stop: function(){
      
        $("#keyDevice").text('');
        
        clearInterval(timeCnn);
        
    },
    _addRequest:function(type){
      
        var that = this;
        if(document.getElementById('keyDeviceCnn').value == ''){
            showAlert('Ingrese una llave')
            return;
        }
        
        var parametro = { tipo: 'addRequest', type: type, key: document.getElementById('keyDeviceCnn').value};
        $.ajax({
            type: "POST",
            dataType: "json",
            //url: "http://appmcc.websolutions.com.gt/device.ashx",
            url: urlCloud,
            crossDomain: true,
            data: parametro,
            cache: false,
            success: function (info) {
                //console.log(info);
                if(info.response){                    
                    
                    $.mobile.loading("show", {
                        text: 'Esperando Respuesta...',
                        textVisible: true,
                        theme: 'a',
                        textonly: false
                    });
                    
                    that._getResponse(document.getElementById('keyDeviceCnn').value);
                    /*timeResponse = setInterval(function(){
                        that._getResponse(document.getElementById('keyDeviceCnn').value);
                    },4000);*/
                    
                }else{
                    showAlert(info.ex);
                }
            },
            error: function (msg) {
                /*alert('error');
                alert('ERROR: ' + msg.status + ' ' + msg.statusText);*/
            }
        });
        
    },
    _getResponse:function(key){
        var that = this;
        lapsResponse += 1;
        
        var parametro = { tipo: 'getResponse', key: key};
        //alert('getreponse');
        $.ajax({
            type: "POST",
            dataType: "json",
            //url: "http://mccapp.bellamor.net/device.ashx",
            url: urlCloud,
            crossDomain: true,
            data: parametro,
            cache: false,
            timeout:36000,
            success: function (info) {
                //console.log(info);
                if(info.response && info.info != ''){                    
                    //that._addResponse(info.info.type);
                    lapsResponse = 0;
                    if(info.info.type == 1){
                        $.mobile.loading("show", {
                            html: info.info.data.replace(/nl/g, '<br/>') + '<br/><button data-iconpos="notext" role="button" data-role="button" onclick="hiddeLoadData()" class="ui-link ui-btn ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-inline ui-shadow ui-corner-all" data-inline="true" data-icon="delete">Hide</button>',
                            text: 'Datos',
                            textVisible: true,
                            theme: 'b',
                            textonly: false
                        });
                    }else{
                        console.log('downLoadNew data');
                        AppDownload.downLoadNew(info.info.data,info.info.url);
                        //AppDownload.downLoadNew(info.info.url);
                    }
                    
                }else{
                    
                    if(lapsResponse == 8){
                        lapsResponse = 0;
                        showAlert('Tiempo de espera Agotada');
                        $.mobile.loading("hide");
                        clearInterval(timeResponse);
                    }else{
                        setTimeout(function(){ 
                            that._getResponse(document.getElementById('keyDeviceCnn').value);
                        }, 5000);
                    }
                }
            },
            error: function (msg) {
                console.log('error console');
                console.log(msg);
                console.log(msg.toString());
                alert('error');
                
                /*alert('error');
                alert('ERROR: ' + msg.status + ' ' + msg.statusText);*/
            }
        });       
        
    },
    _getRequest:function(key){
        var that = this;
        console.log('getrequest');
        console.log(key);
        if(key == ''){
            showAlert('Ingrese una llave')
            return;
        }
        
        var parametro = { tipo: 'getRequest', key: key};
        $.ajax({
            type: "POST",
            dataType: "json",
            //url: "http://mccapp.bellamor.net/device.ashx",
            url: urlCloud,
            crossDomain: true,
            data: parametro,
            cache: false,
            success: function (info) {
                //console.log(info);
                if(info.response && info.info != null){                    
                    that._addResponse(info.info.type);
                }
            },
            error: function (msg) {
                /*alert('error');
                alert('ERROR: ' + msg.status + ' ' + msg.statusText);*/
            }
        });
        
    },
    _addResponse:function(type){
        
        var data = '';
        var url = '';
        var keyFile = '';
        //alert('addResponse');
        if(type == 1){
            data = fileAppNew.loadResumen();
            url = '';    
            keyFile = $("#keyDevice").text();
        }else if(type == 2){
            //url = AppDownload.uploadFile();
            //alert(url);            
            var geo = localStorageApp.getVariable('geoMcc');
            if(geo == '' || geo == undefined){
                fileAppNew.client.geo = [];
            }else{
                fileAppNew.client.geo = JSON.parse(geo);
            }
            fileAppNew.client.tasa = "tsa";
            
            data = JSON.stringify(fileAppNew.client);
            url = document.getElementById('nameFileKey').value;
            keyFile = $("#keyDevice").text();
            //data = JSON.stringify({data: 'prueba', demo:'prueba'});
        } else if(type == 3){
            
            var geo = localStorageApp.getVariable('geoMcc');
            if(geo == '' || geo == undefined){
                fileAppNew.client.geo = [];
            }else{
                fileAppNew.client.geo = JSON.parse(geo);
            }
            fileAppNew.client.tasa = "tsa";
            
            data = JSON.stringify(fileAppNew.client);
            url = '';  
            keyFile = fileAppNew.client.uuidFile;
        }
        
        var parametro = { tipo: 'addResponse', key: keyFile, data: data, url: url};
            $.ajax({
                type: "POST",
                dataType: "json",
                //url: "http://mccapp.bellamor.net/device.ashx",
                url: urlCloud,
                crossDomain: true,
                data: parametro,
                cache: false,
                success: function (info) {
                    //console.log(info);
                    
                },
                error: function (msg) {
                    /*alert('error');
                    alert('ERROR: ' + msg.status + ' ' + msg.statusText);*/
                }
            });
        
    },
    addDevice: function(){
        var that = this;
        var parametro = { tipo: 'addDevice', name: that._viewDeviceName()};

        //var parametro = { tipo: 'addDevice', name: 'prueba'};

        /*$.ajax({
             type: "POST",
            dataType: "json",
            url: "http://mccapp.bellamor.net/device.ashx",
            crossDomain: true,
            data: parametro,
            cache: false,
            success: function (info) {
				console.log(info);
            },
            error: function (msg) {
                alert('error');
                alert('ERROR: ' + msg.status + ' ' + msg.statusText);
            }
        });*/
    },
	run:function() {
		var me = this;
        
        clearInterval(timeCnn); 
        clearInterval(timeResponse);
        clearInterval(timeOnline); 
        lapsResponse = 0;
        
		/*document.getElementById("deviceName").addEventListener("click", function() {
			that._viewDeviceName.apply(that, arguments);
		});
		document.getElementById("deviceCordovaVersion").addEventListener("click", function() {
			that._viewCordovaVersion.apply(that, arguments);
		});
		document.getElementById("devicePlatform").addEventListener("click", function() {
			that._viewDevicePlatform.apply(that, arguments);
		});
		document.getElementById("deviceUUID").addEventListener("click", function() {
			that._viewDeviceUUID.apply(that, arguments);
		});
		document.getElementById("deviceVersion").addEventListener("click", function() {
			that._viewDeviceVersion.apply(that, arguments);
		});*/
	},
    
	_viewDeviceName : function() {
		/*var infoField = document.getElementById("infoField");
		infoField.innerHTML = device.model;*/
        return device.model;
	},
    
	_viewCordovaVersion : function() {
		/*var infoField = document.getElementById("infoField");
		infoField.innerHTML = device.cordova;*/
        return device.cordova;
	},
    
	_viewDevicePlatform : function () {
		/*var infoField = document.getElementById("infoField");
		infoField.innerHTML = device.platform;*/
        return device.platform;
	},
    
	_viewDeviceUUID : function () {
		/*var infoField = document.getElementById("infoField");
		infoField.innerHTML = device.uuid;*/
        return device.uuid;
	},
    
	_viewDeviceVersion:function viewDeviceVersion() {
		/*var infoField = document.getElementById("infoField");
		infoField.innerHTML = device.version;*/
        return device.version;
	}
};