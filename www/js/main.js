// <! [CDATA [
// Wait for Apache Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);
var isClearAbono = true;
var timeOutFind = null;
// PhoneGap is ready
function onDeviceReady() {
	navigator.splashscreen.hide();
    
}

mccApp = function(){}

mccApp.prototype = function() {
    var _flightForCheckin = null,
    _flightForDetails=null,
    _ffNum = null, 
    _customerData = null,
    _login = false,    
    run = function(){
        var that = this;
        //$seatPicker=$('#seatPicker');

        $("labelVersion").text('Update: ' + AppVersion.version);

        alert('test');
        $('#cliente').on('pagebeforeshow',$.proxy(_clearClient,that));
        $('#addcredito').on('pagebeforeshow',$.proxy(_clearCredito,that));
        $('#abono').on('pagebeforeshow',$.proxy(_clearAbono,that));
        
        $('#resumen').on('pagebeforeshow',$.proxy(_loadResumen,that));
        $('#detailPrestamos').on('pagebeforeshow',$.proxy(_loadCreditDay,that));
        
        //$('#tripDetail').on('pagebeforeshow',$.proxy(_initTripDetail,that));
        //$('#boardingPass').on('pageshow',$.proxy(_initBoardingPass,that));
        $('#logon').on('pagecreate',$.proxy(_initLogon,that));
        
        $('#home').on('pagecreate',$.proxy(_initHome,that));
        
        
        $('#abonoRuta').on('pagebeforeshow',$.proxy(_loadScoll,that));
        $('#abonoRutaPend').on('pagebeforeshow',$.proxy(_loadScollPend,that));
               
        $('#gasto').on('pagebeforeshow',$.proxy(_loadGasto,that));
        
        $('#settings').on('pagebeforeshow',$.proxy(_getList,that));
        
        $('#changeInfo').on('pagebeforeshow',$.proxy(_setInfoFile,that));
        
        $('#dateFormatPage').on('pagebeforeshow',$.proxy(_setNewDate,that));
        
        $("#validateFileLoad").click(function(event, ui){
            fileAppNew.validateLoadMcc();
        });
        
        /*$("#changeInfoFile").click(function(event, ui){
            $.mobile.changePage("#changeInfo", { transition: "flip" });            
            //fileAppNew.changeInfo();
        });*/
        
        $("#restoreBackUp").click(function(event, ui){
            $.mobile.loading("show", {
                text: 'Restaurando BackUp...',
                textVisible: true,
                theme: 'a',
                textonly: false
        	});  
            fileAppNew.restoreBackUp();
        });
        
        $("#abonoCero").click(function(event, ui){
            fileAppNew.abonoCero();
        });
        
        $("#logOut").click(function(event, ui){
            fileAppNew.loadDataFile();
            
            $.mobile.changePage("#logon", { transition: "flip" });
        });
        
        $("#txtAbono").bind("change", function(event, ui){
            fileAppNew.changeSaldoActual(this.value);
        });
        
        $("#baseMoney").bind("change", function(event, ui){
            fileAppNew.changeBase(this.value);
        });
        
        $("#searchCliente").bind("keyup", function(event, ui){

            var meValue = this.value;
            if(this.value == ''){
                clearTimeout(timeOutFind);
                fileAppNew.findItemsClients(meValue);
            }else{
                clearTimeout(timeOutFind);                
                timeOutFind = setTimeout(function(){
                    fileAppNew.findItemsClients(meValue);
                },800);
            }
            
        });
        
        $("#searchCredito").bind("keyup", function(event, ui){
            var meValue = this.value;
            if(this.value == ''){
                clearTimeout(timeOutFind);
                fileAppNew.findItemCredito(meValue,'lstCredito');
            }else{
                clearTimeout(timeOutFind);                
                timeOutFind = setTimeout(function(){
                    fileAppNew.findItemCredito(meValue,'lstCredito');
                },800);
            }
        });
        
         $("#searchCreditoHist").bind("keyup", function(event, ui){
             var meValue = this.value;
            if(this.value == ''){
                clearTimeout(timeOutFind);
                fileAppNew.findItemCredito(meValue,'lstCreditoHistorico');
            }else{
                clearTimeout(timeOutFind);                
                timeOutFind = setTimeout(function(){
                    fileAppNew.findItemCredito(meValue,'lstCreditoHistorico');
                },800);
            }
        });
        
        $("#saveAbono").click(function(){            
            fileAppNew.saveAbono(this);    
        });
        
        $("#viewHistory").click(function(){            
            fileAppNew.viewHistory(this);    
        });
        
        $("#viewPerson").click(function(){            
            fileAppNew.viewPerson(this);    
        });
        
        $("#saveCredit").click(function(){            
            fileAppNew.saveCredit();    
        });
        
        $("#saveClient").click(function(){            
            fileAppNew.saveClient();    
        });
        
        $("#saveGasto").click(function(){            
            fileAppNew.saveGasto();    
        });        
        
        $("#txtMontoP").bind("change", function(event, ui){
            calcSum();
        })
        
        $("#txtMontoGA").bind("change", function(event, ui){
            calcSum();
        })
        
        $("#selectPorcentaje").bind("change", function(event, ui){
            calcSum();
            //alert('c');
        })
        
        $("#regresaAbono").click(function(){                       
            fileAppNew.returnAbono();                        
        });
                
        $("#newFileRead").click(function(){                       
            $.mobile.changePage('#dateFormatPage', { transition: 'flip' });
            //fileAppNew.saveNewFile();                        
        });
        $("#btnGenerate").click(function(){                       
            fileAppNew.saveNewFile();                        
        });
        $("#btnDateNew").click(function(){                       
            fileAppNew.setGenerateDate();                        
        });
        
        $("#dateFile").click(function(){                       
            fileAppNew.getDateFile();                        
        });       
        
        $("#findUltimo").click(function(){                       
            fileAppNew.getPositionRuta();                        
        });
        
        $("#findLast").click(function(){                       
            fileAppNew.getLastRuta();                        
        });
        
        $("#next").click(function(){                       
            fileAppNew.pagineo(this,1);
        });
        $("#prev").click(function(){                       
            fileAppNew.pagineo(this,-1);
        });
        
        $("#nextPend").click(function(){                       
            fileAppNew.getNewListPend(1);
        });
        $("#prevPend").click(function(){                       
            fileAppNew.getNewListPend(-1);
        });
        
        $("#flip-1").on("slidestop", function( event, ui ) {
            //alert(JSON.stringify($("#flip-1").slider( "option" )));
            //alert(document.getElementById("flip-1").value);
            
            if(document.getElementById("flip-1").value == 'on'){
                deviceInfoApp.start();    
            }else{
                deviceInfoApp.stop();    
            }
            
        });
        
        $("#downLoadFile").click(function(){                       
            deviceInfoApp._addRequest(2);
        });
        $("#resumLoadFile").click(function(){                       
            deviceInfoApp._addRequest(1);
        });
        //saveNewFile
        /*$("#sliderPlazo").bind("change", function(event, ui){
            calcSum();
        })
        $("#selectInteres").bind("change", function(event, ui){
            calcSum();
        });*/
        
        //valida cliente existente
        $("#txtNit").bind('change',function(){
           fileAppNew.validationClient('nit', this.value); 
        });
        $("#txtNoIdent").bind('change',function(){
           fileAppNew.validationClient('identificacion', this.value); 
        });
    },
    _loadScoll = function(){
                
        setTimeout(function(){
            //$('.rutaX').height($("#abonoRuta").height() - 32);
            fileAppNew.pagineo(null,0);
        },500);
          
    },
    _loadScollPend = function(){
                
        setTimeout(function(){
            //$('.rutaX').height($("#abonoRuta").height() - 32);            
            fileAppNew.getNewListPend(0);
        },500);
          
    },
    _clearClient=function(){
        
        //if(document.getElementById('txtNoIdent').value === ''){
            //document.getElementById('txtIdCliente').value = '';
            document.getElementById('txtNoIdent').value = '';
            document.getElementById('txtNombre').value = '';
            document.getElementById('txtdomicilio').value = '';
            document.getElementById('txttel').value = '';
            document.getElementById('txtcel').value = '';
            document.getElementById('txtcorreo').value = '';
        //}
        
        document.getElementById('txtIdCliente').value = getCorrelCliente();
        
    },
    _setNewDate= function(){
      fileAppNew.setNewDate();        
    },
    _setInfoFile= function(){
        fileAppNew.loadInfo();
    },
    _loadGasto= function(){
      fileAppNew.loadGasto();    
    },
    _loadResumen= function(){
         fileAppNew.loadResumen();  
    },
    _loadCreditDay=function(){
        fileAppNew.loadCreditDay();  
    },
    _getList=function(){
        document.getElementById('nameFileKey').value = fileSelName + '_' + fileAppNew.client.uuidSucursal;
        console.log('before show');
        console.log(isAdminApp);
        if(isAdminApp){
            $('#detailCnn').show();
        }else{
            $('#detailCnn').hide();            
        }
        
    },
    _clearAbono=function(){
        
        if(isClearAbono){
            document.getElementById('txtIdCreditoA').value = '';  
            document.getElementById('txtTotal').value = '';  
            document.getElementById('txtActual').value = '';  
            document.getElementById('txtAbono').value = '';  
        }
        isClearAbono = true;
    },
    _clearCredito=function(){
      
        $("#listClientCredit").empty();
        document.getElementById('txtIdCreditoU').value = '';  
        document.getElementById('searchCliente').value = '';  
        document.getElementById('txtCliente').value = '';  
        //document.getElementById('txtComent').value = '';  
        document.getElementById('txtMontoP').value = '';  
        document.getElementById('txtMontoGA').value = '0';  
        //document.getElementById('sliderPlazo').value = 23;  
        /*document.getElementById('txtInteres').value = '';  
        document.getElementById('txtCuota').value = '';  
        document.getElementById('txtMI').value = '';  
        document.getElementById('txtFI').value = '';  
        document.getElementById('txtFF').value = '';  */
                
    },
    _initTripDetail = function(){
        var seg = _flightForDetails.segments[0];
	    $('#tripDetail-title').text(seg.from + ' to ' + seg.to);
	    $('#tripDetail-flightNum').text(seg.flightNum);
	    $('#tripDetail-depart').text(seg.departDate + ' at ' + seg.time);
	    $('#tripDetail-seat').text(seg.seat);
	    seg = _flightForDetails.segments[1];
	    $('#tripDetail-return-title').text(seg.from + ' to ' + seg.to);
	    $('#tripDetail-return-flightNum').text(seg.flightNum);
	    $('#tripDetail-return-depart').text(seg.departDate + ' at ' + seg.time);
        $('#tripDetail-return-seat').text(seg.seat);
    },
    
    _initBoardingPass = function(){
        currentseg = _flightForCheckin.segments[_flightForCheckin.currentSegment];

	    $('#boardingpass-cnum').text(_flightForCheckin.cNum);
	    $('#boardingpass-passenger').text(_customerData.firstName + ' ' + _customerData.lastName);
	    $('#boardingpass-seat').text(currentseg.seat);
	    $('#boardingpass-gate').text(currentseg.gate);
	    $('#boardingpass-depart').text(currentseg.time);
	    var flight = currentseg.flightNum + ':' + currentseg.from + ' to ' + currentseg.to;
	    $('#boardingpass-flight').text(flight);
    },
    _initHome = function(){
      
        //fileAppNew.renderData();
        //fileAppNew.loadRuta();
        //fileAppNew.pagineo(null,1);
        
    },
    _initLogon = function(){
        
        if (!_login) {
            
	    	$('#btnLogin').click(function () {
alert('click')
                if(fileAppNew.validaLogin(document.getElementById('userName').value,document.getElementById('pwd').value)){                
                }
                _login = true;
	    		return false;
	    	});
	    }
      
    },
    _initRuta = function(){
        
        alert(_login);
        if(_login){
         fileAppNew.loadRuta();
        }
        
    },
    _initCheckIn = function(){
        var currentseg = _flightForCheckin.segments[_flightForCheckin.currentSegment],
	    seat = currentseg.seat,
	    flight = currentseg.from + ' to ' + currentseg.to;
	    $('#checkIn-flight-number').text(currentseg.flightNum);
	    $('#checkIn-flight-destination').text(flight);
        
	    $('#checkIn-seat').text(seat);
    },
    
    _handleLogOn = function (ff, success) {
		if (success) {
			_ffNum = ff;
			airData.getDataforFF(_ffNum,_handleDataForFF);
		}
	},
    
    _handleDataForFF = function (data) {
        $flightList = $('#myTripsListView');
		_customerData = data;
		$('#ffname').text(data.firstName);
		$('#ffnum').text(data.ffNum);
		$('#currentStatus').text(data.status);
		$('#miles').text(data.miles);
		$('#numberOfFlights').text(data.flights.length);
		for (var i in data.flights) {
			var flight = data.flights[i],
            currentSegment = flight.segments[flight.currentSegment];
			$flightList.append('<li id="' + flight.id + '"><a href="#tripDetail" data-transition="slide">' + currentSegment.from + ' to ' + currentSegment.to + '</a></li>');
			var item = $('#' + flight.id, $flightList);
			item.data('flight', flight);
			if (flight.timeToCheckIn) {

				item.addClass('checkIn');
				$('a', item).attr('href', '#checkIn');
			}
			else {
				item.addClass('tripDetail');
			}
		}
		$.mobile.changePage('#home', { transition: 'flip' });

	};
    
    return {
        run:run,
    };
}();
//]]>