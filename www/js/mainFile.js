// <! [CDATA [

//NOTE: Cordova File api has some issues with file reading in iOS 6
document.addEventListener("deviceready", onDeviceReady, false);
//Activate :active state
document.addEventListener("touchstart", function() {
}, false);

var resultTextDataTemp = '',
    resultTextData = '',
    resultTextDataLoad = '',
    idRecord = '',
    pwAdminApp = 'adminMcc_App',
    isAdminApp = false;

var fileSelName = 'dataMcc';
var fileDownName = 'dataMccLoad';        

function onDeviceReady() {
    //navigator.splashscreen.hide();
    fileAppNew = new FileApp();
    fileAppNew.run();
}

function FileApp() {
}

FileApp.prototype = {
    fileSystemHelper: null,
    fileNameField: null,
    textField: null,
    result: '',
    client:null,
    newListR:[],
    newListPend:[],
    newClient:null,
    itemColor:null,
    itemColorH:null,
    paginaRuta:0,
    paginaRutaPend:0,
    sizeRuta: 10,
    lastSelect:0,
    jsonVerific:'',
    jsonVerific1: '',
    geo: [],
    setGenerateDate:function() {
        var lst = this.client.cliente;        
        var index, indexCr, item, itemCr;
        
        var f = document.getElementById('dateNew').value;
        var sp = f.toString().split('-');
        var now = new Date(sp[0], parseFloat(sp[1]) - 1, sp[2]);    
        var setNewDate = now.getFullYear().toString() + '-' + (now.getMonth() + 1).toString() + '-' + now.getDate().toString();
        //var setNewDateG = now.getFullYear().toString() + (now.getMonth()+1).toString() + now.getDate().toString();

        var selDate = $("input:radio[name ='radio-date']:checked").val();
        
        if (selDate == 'NaN-NaN-NaN' || selDate == undefined || selDate == '') {
            showAlert('Debe de seleccionar una fecha a Cambiar');
            return false;
        }
        
        if (document.getElementById('dateNew').value == '') {
            showAlert('Ingrese una Fecha Nueva');
            return false;
        }
        
        for (index = 0; index < lst.length; ++index) {
            item = lst[index];
            for (indexCr = 0; indexCr < item.creditos.length; indexCr++) {
                itemCr = item.creditos[indexCr];            
            
                if (itemCr.nuevo == 1 && itemCr.fecha == selDate) {
                    itemCr.fecha = setNewDate;
                }
                
                var ab;
                for (ab in itemCr.abonos) {
                    if (itemCr.abonos[ab].n == 1 && itemCr.abonos[ab].f == selDate) {
                        itemCr.abonos[ab].f = setNewDate;
                    }
                }                    
            }
        }  
        
        /*----------geo-------*/
        /*var geo = localStorageApp.getVariable('geoMcc');
        if(geo == '' || geo == undefined){
        geo = [];
        }else{
        geo = JSON.parse(geo);
        index = 0;
        var g;
        for (index = 0; index < geo.length; ++index) {
        g = geo[index];
        if(g.fs == ){
        g.fs = setNewDateG;
        }
        }
        }  */      
        
        idRecord = '';
        this.setNewDate();        
        this.saveNewFileAction();
        
        setTimeout(function() {
            $.mobile.loading("hide"); 
            showAlert('Fecha Cambiada')
        }, 2000);                
    },
    setNewDate:function() {
        var lstDates = [];  
        var lst = this.client.cliente;
        
        var index, indexCr, item, itemCr;
        //var fecha = now.getFullYear().toString() + '-' + (now.getMonth()+1).toString() + '-' + now.getDate().toString();
        for (index = 0; index < lst.length; ++index) {
            item = lst[index];
            for (indexCr = 0; indexCr < item.creditos.length; indexCr++) {
                itemCr = item.creditos[indexCr];            
            
                if (itemCr.nuevo == 1 && lstDates.indexOf(itemCr.fecha) == -1) {
                    lstDates.push(itemCr.fecha)    
                }
                
                var ab;
                for (ab in itemCr.abonos) {
                    if (itemCr.abonos[ab].n == 1 && lstDates.indexOf(itemCr.abonos[ab].f) == -1) {
                        lstDates.push(itemCr.abonos[ab].f)    
                    }
                }                    
            }
        }
        
        var r, l;
        //clearComboBox("selectOldDate");
        $("#dataGroup").empty()
        if (lstDates.length > 0) {
            index = 0;
            var x = $("#dataGroup");
            for (index = 0; index < lstDates.length; index++) {
                var id = 'radio-date-' + index;
                //checked="checked"
                var chk = index == 0 ? 'checked="checked"' : '';
                x.append('<input type="radio" name="radio-date" ' + chk + ' id="' + id + '" value="' + lstDates[index] + '" ><label for="' + id + '">' + lstDates[index] + '</label>');
                /*r = document.createElement("input");
                r.type = 'radio';
                r.value = lstDates[index];
                r.id = id;
                r.name =  'radio-date'
                l = document.createElement("label");
                l.for = id;
                $(l).text(lstDates[index]);
                x.append(r);    
                x.append(l);  */  
            }
        }
    },
    abonoCero:function() {
        var lst = this.newListPend;        
        var i = 0, indexCr = 0;        
        
        var now = getSelDate(), itemCr;
        var fecha = now.getFullYear().toString() + '-' + (now.getMonth() + 1).toString() + '-' + now.getDate().toString();
        
        for (i=0;i < lst.length;i++) {
            for (indexCr = 0; indexCr < lst[i].creditos.length; indexCr++) {
                itemCr = lst[i].creditos[indexCr];
            
                itemCr.abonos.splice(0, 0, {
                                         "n":1,
                                         "m":0,
                                         "f":fecha
                                     });
            }
        }       
        //fcanu
        i = 0;
        indexCr = 0;
        if (this.client.filtraPro == 1) {
            var lstComplete = this.client.cliente;
            //alert(lstComplete.length);
            for (i=0;i < lstComplete.length;i++) {
                for (indexCr = 0; indexCr < lstComplete[i].creditos.length; indexCr++) {
                    itemCr = lstComplete[i].creditos[indexCr];
                    if (itemCr.uuidPromotor != this.client.uuid) {
                        itemCr.abonos.splice(0, 0, {
                                                 "n":1,
                                                 "m":0,
                                                 "f":fecha
                                             });
                    }
                }
            }       
        }
        
        this.getNewListPend(0);
        idRecord = '';
        this.saveNewFileAction();
                
        lst = i = indexCr = now = fecha = null;
    },
    changeSaldoActual: function(value) {
        document.getElementById('txtActual').value = $("#txtActual").attr('dataSActual') + ' / ' + (parseFloat($("#txtActual").attr('dataSActual')) - parseFloat(value));
    },
    changeBase: function(value) {
        var me = this;
      
        var lst = this.client;
        
        lst.base = parseFloat(value);
        idRecord = '';
        me.saveNewFileAction();
        
        me.refreshBase(lst.base, parseFloat($("#txtPrestamoRV").text()), parseFloat($("#txtGastoRV").text()), parseFloat($("#txtAbonoRv").text()));
    },
    refreshBase:function(base, prestamos, gastos, abono) {
        var total = 0;
        
        if (!base) {
            base = 0;
        }
        
        total = (base + abono) - (gastos + prestamos);               

        $("#txtTotalBase").text(total);
    },
    getDateFile:function() {
        if (this.client && this.client.fecha) {
            var f = this.client.fecha.toString();
            f = f.substr(6, 2) + '/' + f.substr(4, 2) + '/' + f.substr(0, 4);
            var s = document.getElementById('date2').value.toString().split('-');
            s = s[2] + '/' + s[1] + '/' + s[0];
            showAlert('Fecha de Sistema: ' + s + '  Fecha de Archivo: ' + f + ' Archivo Procesando: ' + fileSelName);
        }else {
            showAlert('Fecha de Archivo Invalida');
        }
    },
    pagineo: function(btn, index) {
        //return;
        this.showMsg('Generando Ruta, Espere...');
        
        var textPag = $("#pageNavigator");
        
        textPag.text('Pagina 0/0');
        
        var ls = $('#lstCreditoRuta');        
        
        var me = this;                               
        var lst = this.newListR;
        var pageTotal = 0;
        var pageDecimal = 0;
        
        pageDecimal = lst.length / me.sizeRuta;
        pageTotal = parseFloat(pageDecimal.toFixed(0));
        
        if ((lst.length % me.sizeRuta) > 0 && pageTotal < pageDecimal) {
            pageTotal = parseFloat(pageDecimal.toFixed(0)) + 1;
        }
        
        ls.empty();
        
        /*
        pageTotal = lst.length / me.sizeRuta;
        pageTotal = parseFloat(pageTotal.toFixed(0));
        
        if((lst.length % me.sizeRuta)>0){
        pageTotal += 1;
        }*/
        
        me.paginaRuta += index;
        
        if (me.paginaRuta === 0) {
            me.paginaRuta = 1;
            //return;
        }        
        if (me.paginaRuta > pageTotal) {
            me.paginaRuta = pageTotal;
        }        
        
        textPag.text('Pagina ' + me.paginaRuta.toString() + '/' + pageTotal.toString());
        
        var index, indexCr, indexAb, item, itemCr, itemAb, li;
        var agregar = false;
        var posPag = parseFloat(me.paginaRuta * me.sizeRuta);
        var posIni = parseFloat(posPag - me.sizeRuta);
        
        /*alert(lst.length);
        alert(posIni);
        alert(posPag);*/
        for (index = posIni; index < posPag; index++) {
            if (!lst[index]) {
                break;
            }
            
            item = lst[index];
            agregar = false;
            color = false;
            li = '';
            var dateSel;
            var sp;
            var dateCr;
            var classSelect = '';

            for (indexCr = 0; indexCr < item.creditos.length; indexCr++) {
                itemCr = item.creditos[indexCr];

                if (me.client.filtraPro == 1) {
                    if (itemCr.uuidPromotor == me.client.uuid) {
                        var cuota = itemCr.cuota;
                        var sumaAbDia = 0, indexAb = 0, sumaTotal = 0;
                        var validatePay = true;
                        classSelect = 'addNewBonus';
                        for (indexAb=0;indexAb < itemCr.abonos.length;indexAb++) {
                            itemAb = itemCr.abonos[indexAb];

                            dateSel = getSelDate();
                            if (itemAb.f.toString().indexOf('/') > 0) {
                                sp = itemAb.f.toString().split('/');
                                dateCr = new Date(sp[2], parseFloat(sp[1]) - 1, sp[0]);
                            }else {
                                sp = itemAb.f.toString().split('-');
                                dateCr = new Date(sp[0], parseFloat(sp[1]) - 1, sp[2]);
                            }                                

                            if (itemAb.n == 1 && dateSel.getDate() == dateCr.getDate()) {
                                if (validatePay) {
                                    color = true;
                                    classSelect = 'addbonusRuta';
                                        
                                    cuota = itemAb.m;
                                    validatePay = false;
                                }
                                sumaAbDia += 1;
                                //break;
                            }                                
                            sumaTotal += parseFloat(itemAb.m);
                        }
                        //console.log((parseFloat(itemCr.monto) + parseFloat(itemCr.interes)));
                        //console.log(parseFloat(sumaTotal)) 
                        if (parseFloat(sumaTotal) >= (parseFloat(itemCr.monto) + parseFloat(itemCr.interes))) {
                            classSelect = 'historyCredit';
                        }
                            
                        agregar = true;        
                        li += '<li class="ui-btn-icon-right" ><a mccRIndice="' + index + '" id="liR' + itemCr.uuid + '" mccClientuuid="' + item.uuid + '" mccCredituuid="' + itemCr.uuid + '" mccClient="' + item.idCliente + '" mccIdcredit="' + itemCr.idCredito + '" mccMonto="' + itemCr.monto + '" mccInteres="' + itemCr.interes + '" mccSaldo="' + itemCr.saldo + '" mccMontoi="' + itemCr.montoi + '" mccCuota="' + cuota + '" class="' + classSelect + '">' + itemCr.idCredito + ' - ' + sumaAbDia + '</a ></li>';
                    }
                }else {
                    var cuota = itemCr.cuota;
                    classSelect = 'addNewBonus';
                    for (indexAb=0;indexAb < itemCr.abonos.length;indexAb++) {
                        itemAb = itemCr.abonos[indexAb];
                            
                        dateSel = getSelDate();
                        if (itemAb.f.toString().indexOf('/') > 0) {
                            sp = itemAb.f.toString().split('/');
                            dateCr = new Date(sp[2], parseFloat(sp[1]) - 1, sp[0]);
                        }else {
                            sp = itemAb.f.toString().split('-');
                            dateCr = new Date(sp[0], parseFloat(sp[1]) - 1, sp[2]);
                        }      
                            
                        if (itemAb.n == 1 && dateSel.getDate() == dateCr.getDate()) {
                            color = true;
                            classSelect = 'addbonusRuta';
                            cuota = itemAb.m;
                                
                            break;
                        }
                    }
                    
                    var sumaAbDia = 0;
                    indexAb = 0
                    for (indexAb=0;indexAb < itemCr.abonos.length;indexAb++) {
                        itemAb = itemCr.abonos[indexAb];
                        //var nowF = getSelDate();var fecha = now.getFullYear().toString() + '-' + (now.getMonth()+1).toString() + '-' + now.getDate().toString();

                        dateSel = getSelDate();
                        if (itemAb.f.toString().indexOf('/') > 0) {
                            sp = itemAb.f.toString().split('/');
                            dateCr = new Date(sp[2], parseFloat(sp[1]) - 1, sp[0]);
                        }else {
                            sp = itemAb.f.toString().split('-');
                            dateCr = new Date(sp[0], parseFloat(sp[1]) - 1, sp[2]);
                        }                                

                        if (itemAb.n == 1 && dateSel.getDate() == dateCr.getDate()) {
                            sumaAbDia += 1;
                        }
                    }
                       
                    agregar = true;        
                    li += '<li class="ui-btn-icon-right" ><a mccRIndice="' + index + '" id="liR' + itemCr.uuid + '" mccClientuuid="' + item.uuid + '" mccCredituuid="' + itemCr.uuid + '" mccClient="' + item.idCliente + '" mccIdcredit="' + itemCr.idCredito + '" mccMonto="' + itemCr.monto + '" mccInteres="' + itemCr.interes + '" mccSaldo="' + itemCr.saldo + '" mccMontoi="' + itemCr.montoi + '" mccCuota="' + cuota + '" class="' + classSelect + '">' + itemCr.idCredito + ' - ' + sumaAbDia + '</a ></li>';
                }                
            }

            if (color) {
                ls.append('<li class="' + classSelect + '" data-role="list-divider" id="li' + item.uuid + '">' + item.Nombre + ' - ' + item.idCliente + '</li>');
            }else {
                ls.append('<li data-role="list-divider" id="li' + item.uuid + '">' + item.Nombre + ' - ' + item.idCliente + '</li>');
            }

            if (li!=='') {
                ls.append(li);
            }   
        }       
        
        ls.listview('refresh');
        
        $('a.addbonusRuta, a.addNewBonus').click(function() {
            $.mobile.changePage("#abono", { transition: "flip" });            
            var it = $(this);                       
                          
            fileAppNew.itemColor = 1;
            fileAppNew.lastSelect = it.attr('mccRIndice');
             
            setDataBonus(it);
        });
        
        //ls.listview("refresh");
        setTimeout(function() {
            $.mobile.loading("hide");
        }, 500);                
      
        ls = me = lst = null;
    },viewPerson: function() {
        var idCredito = document.getElementById('txtIdCreditoA').value;
        var idCliente = idCredito.substr(0, idCredito.length - 1);
        var lst = this.client.cliente;
        
        var info = '';
        for (index = 0; index < lst.length; index++) {
            item = lst[index];
            
            if (idCliente === item.idCliente) {
                info += 'Nombre: ' + item.Nombre; 
                info += '<br/>Teléfono: ' + (item.Telefono ? item.Telefono : item.tl);
                info += '<br/>Domicilio: ' + (item.domicilio ? item.domicilio :item.dm);
                break;
            }                
        }
        
        $.mobile.loading("show", {
                             html: info + '<br/><button data-iconpos="notext" role="button" data-role="button" onclick="hiddeLoadData()" class="ui-link ui-btn ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-inline ui-shadow ui-corner-all" data-inline="true" data-icon="delete">Hide</button>',
                             text: 'datos',
                             textVisible: true,
                             theme: 'b',
                             textonly: false
                         });
    },
    viewHistory: function() {        
        $.mobile.changePage("#viewDetail", { transition: "flip" });            
        $("#returnHistory").attr("href", "#abono")
        isClearAbono = false;
        var index, indexCr, indexAbono, item, itemCr, itemAb;
        var idCredito = document.getElementById('txtIdCreditoA').value;
        var uidClient = document.getElementById('txtUuidClient').value;
        var idCliente = idCredito.substr(0, idCredito.length - 1);
        var lst = this.client.cliente;

        $('#lstViewDetail').empty();
        
        $('#lblCreditoHist').text(idCredito);        
        
        var detailHistory = $('#lstViewDetail');
        var dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
             
        for (index = 0; index < lst.length; index++) {
            item = lst[index];
            
            if (idCliente === item.idCliente && uidClient == item.uuid) {
                li = '';
                for (indexCr = 0; indexCr < item.creditos.length; indexCr++) {
                    itemCr = item.creditos[indexCr];
                
                    if (itemCr.idCredito === idCredito) {
                        for (indexAbono = 0; indexAbono < itemCr.abonos.length; ++indexAbono) {
                            itemAb = itemCr.abonos[indexAbono];
                            
                            var f = itemAb.f;                                
                            var fL = f.split('-')
                            var dt = new Date(fL[0], parseFloat(fL[1]) - 1, fL[2]);
                            var dStr = dias[dt.getUTCDay()];
                            var icon = parseFloat(itemAb.m) > 0 ? 'ui-btn-icon-right':'';
                            detailHistory.append('<li class="' + icon + '"><a> ' + dStr + ' ' + itemAb.f + ' - ' + itemAb.m + '</a></li>');
                        }            
                        break;                            
                    }                
                }
                break;
            }                
        }     
        
        detailHistory.listview('refresh');
    },
    pagineoPend: function(btn, index) {
        //return;               
        this.showMsg('Generando Ruta Pendiente, Espere...');
        
        var textPag = $("#pageNavigatorPend");
        
        textPag.text('Pagina 0/0');
        
        var ls = $('#lstCreditoPendiente');        
        
        var me = this;                               
        var lst = this.newListPend;
        var pageTotal = 0;
        var pageDecimal = 0;
        
        pageDecimal = lst.length / me.sizeRuta;
        pageTotal = parseFloat(pageDecimal.toFixed(0));
        
        if ((lst.length % me.sizeRuta) > 0 && pageTotal < pageDecimal) {
            pageTotal = parseFloat(pageDecimal.toFixed(0)) + 1;
        }
        
        ls.empty();
        
        /*
        pageTotal = lst.length / me.sizeRuta;
        pageTotal = parseFloat(pageTotal.toFixed(0));
        
        if((lst.length % me.sizeRuta)>0){
        pageTotal += 1;
        }*/
        
        me.paginaRutaPend += index;
        
        if (me.paginaRutaPend === 0) {
            me.paginaRutaPend = 1;
            //return;
        }        
        if (me.paginaRutaPend > pageTotal) {
            me.paginaRutaPend = pageTotal;
        }        
        
        textPag.text('Pagina ' + me.paginaRutaPend.toString() + '/' + pageTotal.toString());
        
        var index, indexCr, indexAb, item, itemCr, itemAb, li;
        var agregar = false;
        var styleStr = '';
        var posPag = parseFloat(me.paginaRutaPend * me.sizeRuta);
        var posIni = parseFloat(posPag - me.sizeRuta);
        
        /*alert(lst.length);
        alert(posIni);
        alert(posPag);*/
        for (index = posIni; index < posPag; index++) {
            if (!lst[index]) {
                break;
            }
            
            item = lst[index];
            //data-role="list-divider"
            agregar = false;
            color = false;
            li = '';
            var dateSel;
            var sp;
            var dateCr;
            //alert('ind' + index);
            //alert(item.creditos.length);
            for (indexCr = 0; indexCr < item.creditos.length; indexCr++) {
                itemCr = item.creditos[indexCr];
            
                //if(itemCr.idCredito.toString().indexOf(text) !== -1){
                    
                //$('#lstCredito').append('<li class="ui-btn-icon-right"><a class="addbonus">' + itemCr.idCredito + '</a ></li>').listview('refresh');
                var cuota = itemCr.cuota;
                
                styleStr = '';
                for (indexAb=0;indexAb < itemCr.abonos.length;indexAb++) {
                    itemAb = itemCr.abonos[indexAb];
                        
                    dateSel = getSelDate();
                    if (itemAb.f.toString().indexOf('/') > 0) {
                        sp = itemAb.f.toString().split('/');
                        dateCr = new Date(sp[2], parseFloat(sp[1]) - 1, sp[0]);
                    }else {
                        sp = itemAb.f.toString().split('-');
                        dateCr = new Date(sp[0], parseFloat(sp[1]) - 1, sp[2]);
                    }       
                    
                    if (itemAb.n === 1 && dateSel.getDate() == dateCr.getDate()) {
                        styleStr = ' style="background-color:green;color:white" ';
                        color = true;
                            
                        cuota = itemAb.m;
                            
                        break;
                    }
                }
                
                agregar = true;        
                li += '<li class="ui-btn-icon-right" ><a mccRIndice="' + index + '" ' + styleStr + ' id="liRP' + itemCr.uuid + '" mccClientuuid="' + item.uuid + '" mccCredituuid="' + itemCr.uuid + '" mccClient="' + item.idCliente + '" mccIdcredit="' + itemCr.idCredito + '" mccMonto="' + itemCr.monto + '" mccInteres="' + itemCr.interes + '" mccSaldo="' + itemCr.saldo + '" mccMontoi="' + itemCr.montoi + '" mccCuota="' + cuota + '" class="addbonusPendiente">' + itemCr.idCredito + '</a ></li>';
                //}                                
            }
             
            //if(agregar){
            if (color) {
                ls.append('<li style="background-color:green;color:white" data-role="list-divider" id="liP' + item.uuid + '">' + item.Nombre + ' - ' + item.idCliente + '</li>');
            }else {
                ls.append('<li data-role="list-divider" id="liP' + item.uuid + '">' + item.Nombre + ' - ' + item.idCliente + '</li>');
            }
            //ls.append('<li data-role="list-divider">' + item.Nombre + ' - ' + item.idCliente + '</li>').listview('refresh');
            //ls.append(li).listview('refresh');
            if (li!=='') {
                ls.append(li);
            }
            //}
        }       
        
        ls.listview('refresh');
        
        $('.addbonusPendiente').click(function() {
            $.mobile.changePage("#abono", { transition: "flip" });            
            var it = $(this);                       
                          
            fileAppNew.itemColor = 2;

            setDataBonus(it);
        });
        
        //ls.listview("refresh");
        setTimeout(function() {
            $.mobile.loading("hide");
        }, 500);                
      
        ls = me = lst = null;
    },
    loadRuta: function() {
        this.showMsg('Generando Ruta, Espere...');
        
        var ls = $('#lstCreditoRuta');
        var me = this;                               
        var lst = this.client.cliente;

        var index, indexCr, indexAb, item, itemCr, itemAb, li;
        var agregar = false;
        var styleStr = '';
showAlert(lst.length)
        for (index = 0; index < lst.length; index++) {
            item = lst[index];
            //data-role="list-divider"
            agregar = false;
            color = false;
            li = '';
            for (indexCr = 0; indexCr < item.creditos.length; indexCr++) {
                itemCr = item.creditos[indexCr];
                    
                //$('#lstCredito').append('<li class="ui-btn-icon-right"><a class="addbonus">' + itemCr.idCredito + '</a ></li>').listview('refresh');
                var cuota = itemCr.cuota
                
                styleStr = '';
                for (indexAb=0;indexAb < itemCr.abonos.length;indexAb++) {
                    itemAb = itemCr.abonos[indexAb];
                        
                    if (itemAb.n === 1) {
                        styleStr = ' style="background-color:green;color:white" ';
                        color = true;
                            
                        cuota = itemAb.m;
                            
                        break;
                    }
                }
                
                agregar = true;        
                li += '<li class="ui-btn-icon-right" ><a ' + styleStr + ' id="liR' + itemCr.uuid + '" mccClientuuid="' + item.uuid + '" mccCredituuid="' + itemCr.uuid + '" mccClient="' + item.idCliente + '" mccIdcredit="' + itemCr.idCredito + '" mccMonto="' + itemCr.monto + '" mccInteres="' + itemCr.interes + '" mccSaldo="' + itemCr.saldo + '" mccMontoi="' + itemCr.montoi + '" mccCuota="' + cuota + '" class="addbonusRuta">' + itemCr.idCredito + '</a ></li>';
                //}                                
            }
             
            if (agregar) {
                if (color) {
                    ls.append('<li style="background-color:green;color:white" data-role="list-divider" id="li' + itemCr.uuid + '">' + item.Nombre + ' - ' + item.idCliente + '</li>');
                }else {
                    ls.append('<li data-role="list-divider" id="li' + itemCr.uuid + '">' + item.Nombre + ' - ' + item.idCliente + '</li>');
                }
                //ls.append('<li data-role="list-divider">' + item.Nombre + ' - ' + item.idCliente + '</li>').listview('refresh');
                //ls.append(li).listview('refresh');
                ls.append(li);
            }
        }       
        
        $('.addbonusRuta').click(function() {
            $.mobile.changePage("#abono", { transition: "flip" });            
            var it = $(this);                       
             
            me.itemColor = document.getElementById('liR' + it.attr('mccCredituuid'));
            me.itemColorH = document.getElementById('li' + it.attr('mccCredituuid'));
             
            setDataBonus(it);
        });
        
        //ls.listview("refresh");
        setTimeout(function() {
            $.mobile.loading("hide");
        }, 5000);                
      
        ls = lst = null;
    },
    loadGasto: function() {
        var item = null, lstG = this.client.gastos;  
        var ls = $('#lstGastos');
        var index = 0;
      
        ls.empty();
        
        for (index = 0; index < lstG.length; index++) {
            item = lstG[index];
            
            /*if(document.getElementById(item.uuid)){
            document.getElementById(item.uuid).value = item.valor;
            }else{*/
            ls.append('<li>' + item.nombre + '</li><li><input type="text" id="' + item.uuid + '" value="' + item.valor + '"></li>');
            //}
        }
        ls.listview('refresh');
    },
    loadCreditDay:function() {
        var sumaPrestamo = 0, index, indexCr, 
            itemCr, item, lst = this.client.cliente;
        var dateSel;
        var sp;
        var dateCr;
        dateSel = getSelDate();
        $('#lstCreditoDia').empty();
                      
        for (index = 0; index < lst.length; ++index) {
            item = lst[index];
            for (indexCr = 0; indexCr < item.creditos.length; indexCr++) {
                itemCr = item.creditos[indexCr];
                
                if (itemCr.fecha != undefined) {
                    if (itemCr.fecha.toString().indexOf('/') > 0) {
                        sp = itemCr.fecha.toString().split('/');
                        dateCr = new Date(sp[2], parseFloat(sp[1]) - 1, sp[0]);
                    }else {
                        sp = itemCr.fecha.toString().split('-');
                        dateCr = new Date(sp[0], parseFloat(sp[1]) - 1, sp[2]);
                    }
                }
                
                if (itemCr.nuevo === 1 && dateSel.getDate() == dateCr.getDate()) {
                    $('#lstCreditoDia').append('<li >' + item.Nombre + ' - ' + itemCr.monto + '</li>').listview('refresh');
                }                                               
            }                        
        }  
    },
    loadResumen:function() {
        var sumaPrestamo = 0, sumaAbono = 0, sumaGasto = 0,
            index, indexCr, indexAb, 
            itemCr, item, itemAb, lst = this.client.cliente;
        var lstG = this.client.gastos;
        var dateSel;
        var sp;
        var dateCr;
        dateSel = getSelDate();
        
        for (index = 0; index < lst.length; ++index) {
            item = lst[index];
            for (indexCr = 0; indexCr < item.creditos.length; indexCr++) {
                itemCr = item.creditos[indexCr];
                
                if (itemCr.fecha != undefined) {
                    if (itemCr.fecha.toString().indexOf('/') > 0) {
                        sp = itemCr.fecha.toString().split('/');
                        dateCr = new Date(sp[2], parseFloat(sp[1]) - 1, sp[0]);
                    }else {
                        sp = itemCr.fecha.toString().split('-');
                        dateCr = new Date(sp[0], parseFloat(sp[1]) - 1, sp[2]);
                    }
                }
                
                if (itemCr.nuevo === 1 && dateSel.getDate() == dateCr.getDate()) {
                    sumaPrestamo += parseFloat(itemCr.monto);
                }                               
                for (indexAb = 0; indexAb < itemCr.abonos.length; indexAb++) {
                    itemAb = itemCr.abonos[indexAb];
                    
                    if (itemAb.f.toString().indexOf('/') > 0) {
                        sp = itemAb.f.toString().split('/');
                        dateCr = new Date(sp[2], parseFloat(sp[1]) - 1, sp[0]);
                    }else {
                        sp = itemAb.f.toString().split('-');
                        dateCr = new Date(sp[0], parseFloat(sp[1]) - 1, sp[2]);
                    }    
                    
                    if (itemAb.n === 1 && dateSel.getDate() == dateCr.getDate()) {
                        if (parseFloat(itemAb.m)) {
                            sumaAbono += parseFloat(itemAb.m);                        
                        }else {
                            itemAb.m = 0;
                        }
                    }
                }                
            }                        
        }  
        
        index = 0;
        for (index = 0; index < lstG.length; index++) {
            sumaGasto += parseFloat(lstG[index].valor);
        }
        
        var sumaEstimado = 0;
        var lstRuta = this.newListR;
        index = 0; 
        indexCr = 0;
        indexAb = 0;
        var sumaAbonoCero = 0;
        var isLoadAb = true;
        for (index = 0; index < lstRuta.length; index++) {            
            //indexCr = 0;
            for (indexCr = 0; indexCr < lstRuta[index].creditos.length; indexCr++) {
                itemCr = lstRuta[index].creditos[indexCr];                
                sumaEstimado += parseFloat(itemCr.cuota);   
                
                isLoadAb = true;
                for (indexAb = 0; indexAb < itemCr.abonos.length; indexAb++) {
                    itemAb = itemCr.abonos[indexAb];
                    
                    if (itemAb.f.toString().indexOf('/') > 0) {
                        sp = itemAb.f.toString().split('/');
                        dateCr = new Date(sp[2], parseFloat(sp[1]) - 1, sp[0]);
                    }else {
                        sp = itemAb.f.toString().split('-');
                        dateCr = new Date(sp[0], parseFloat(sp[1]) - 1, sp[2]);
                    }    
                    
                    if (itemAb.n === 1 && dateSel.getDate() == dateCr.getDate()) {   
                        if (parseFloat(itemAb.m) == 0) {
                            sumaEstimado -= parseFloat(itemCr.cuota);
                        }else {
                            sumaEstimado += parseFloat(itemAb.m);
                        }
                        
                        isLoadAb = false;
                    }
                }    
            }   
        }        
        //alert(sumaEstimado);
        
        $('#txtPrestamoRV').text(sumaPrestamo);
        $('#txtAbonoRv').text(sumaAbono);
        $('#txtGastoRV').text(sumaGasto);
      
        //$('#txtTotalEstimado').text(sumaEstimado - sumaAbono);
        //$('#txtTotalEstimado0').text(sumaEstimado - sumaAbonoCero);
        $('#txtTotalEstimado0').text(sumaEstimado);
        
        if (this.client.base) {
            document.getElementById('baseMoney').value = this.client.base;
        }else {
            document.getElementById('baseMoney').value = 0;
        }
        
        this.refreshBase(this.client.base, sumaPrestamo, sumaGasto, sumaAbono);
        
        return "Base: " + document.getElementById('baseMoney').value + " nl Prestamos: " + $('#txtPrestamoRV').text() + " nl Gastos: " + $('#txtGastoRV').text() + " nl Abono: " + $('#txtAbonoRv').text() + " nl Total de Efectivo: " + $("#txtTotalBase").text() + " nl Abono Est. - Abonos cobrados y cuota: " + $('#txtTotalEstimado0').text()
    },
    returnAbono:function() {
        //$.mobile.changePage("#abonoRuta", { transition: "flip" });
        //$.mobile.changePage("#abonoRuta", { transition: "flip" });
        //href="#credito"
        if (this.itemColor === 1) {            
            $.mobile.changePage("#abonoRuta", { transition: "flip" });            
        }else if (this.itemColor === 2) {            
            $.mobile.changePage("#abonoRutaPend", { transition: "flip" });            
        }else {
            $.mobile.changePage("#credito", { transition: "flip" });            
        }     
    },
    saveGasto:function() {
        var i = 0;
        var me = this.client.gastos;
        var item = null;
        
        for (i=0;i < me.length;i++) {
            item = me[i];
            item.valor = document.getElementById(item.uuid).value;
        }
        idRecord = '';
        this.saveNewFileAction();
        setTimeout(function() {
            $.mobile.changePage("#home", { transition: "flip" });
        }, 2000);
        //$.mobile.changePage("#home", { transition: "flip" });
    },
    saveClient:function() {
        var correcto = false;
        var lst = this.client.cliente;
        var me = this;  
        
        if (document.getElementById('txtIdCliente').value === '') {
            return false;
        }
        if (document.getElementById('txtNoIdent').value === '') {
            return false;
        }
        
        if (this.validationClient('identificacion', document.getElementById('txtNoIdent').value)) {
            return false;    
        }
        
        if (this.validationClient('nit', document.getElementById('txtNit').value)) {
            return false;    
        }
        
        if (document.getElementById('txtNombre').value === '') {
            return false;
        }
        if (document.getElementById('txtdomicilio').value === '') {
            return false;
        }
        if (document.getElementById('txttel').value === '') {
            return false;
        }
        /*if(document.getElementById('txtcel').value === ''){
        return false;
        }*/
        /*if(document.getElementById('txtcorreo').value === ''){
        return false;
        }*/
        /*if(document.getElementById('flipSexo').value === ''){
        return false;
        }*/
        if (document.getElementById('selectActividad').value === '') {
            return false;
        }
        idRecord = document.getElementById('txtIdCliente').value;
        
        var now = getSelDate()
        var fechai = now.getDate().toString() + '/' + (now.getMonth() + 1).toString() + '/' + now.getFullYear().toString();
        
        var cliente = {
            "nuevo":1,
            "orden": 88888,
            "uuid":generateUUID(),
            "idCliente":document.getElementById('txtIdCliente').value,
            "Nombre":document.getElementById('txtNombre').value,
            "Telefono":document.getElementById('txttel').value,
            "cel":document.getElementById('txttel').value,
            "genero":document.getElementById('flipSexo').value,
            "actividad":document.getElementById('selectActividad').value,
            "correo":document.getElementById('txtcorreo').value,
            "domicilio":document.getElementById('txtdomicilio').value,
            "identificacion": document.getElementById('txtNoIdent').value,
            "nit": document.getElementById('txtNit').value,
            "fecha": fechai,
            "sh": getHour(),
            "creditos":[]       
        }
        //alert(document.getElementById('txtIdCliente').value);
        lst.push(cliente)
        
        /*try{
        $.ajax({
        url: "192.168.action.ashx",
        method: "POST",
        crossDomain: true,
        data: {
        fecha: '',
        action: "addClient",
        uuidSucursal: '',
        uuidPromotor: '',
        "nuevo": 1,
        "orden": 88888,
        "uuid": 'QERQWREQ',
        "idCliente": 'CL10000ADSFKJ',
        "Nombre": 'JUAN',
        "Telefono": '234523',
        "cel": '2354',
        "genero": 'masculino',
        "actividad": 'asdfasdfas',
        "correo": '',
        "domicilio": '',
        "identificacion": '',
        "creditos": []
        },
        success: function(msg){
        alert('wow'+msg);
        }
        })
        }catch(ex){
            
        }*/
        
        correcto = true;
        
        if (correcto) {
            //$.mobile.changePage("#home", { transition: "flip" });   
            //this.findItemCliente(document.getElementById('txtIdCliente').value);
            //alert(document.getElementById('txtIdCliente').value);             
            this.client.indice += 1;
             
            setTimeout(function() {
                me.saveNewFileAction();
                setTimeout(function() {
                    $.mobile.changePage("#addcredito", { transition: "flip" });            
                    document.getElementById('searchCliente').value = document.getElementById('txtIdCliente').value;
                    fileAppNew.findItemCliente(document.getElementById('txtIdCliente').value);
                }, 2000);
                /*$.mobile.changePage("#addcredito", { transition: "flip" });            
                document.getElementById('searchCliente').value = document.getElementById('txtIdCliente').value;
                fileAppNew.findItemCliente(document.getElementById('txtIdCliente').value);*/
            }, 500);        
        }else {
            showAlert('No se pudo guardar el Cliente.')
        }
    },
    saveCredit:function() {
        var monto = document.getElementById('txtMontoP').value;

        if ($.isNumeric(monto) && monto < 0) {
            document.getElementById('txtMontoP').value = '';  
            
            showAlert('Monto Invalido');
            return;
        }
        
        if (!$.isNumeric(monto)) {
            document.getElementById('txtMontoP').value = '';  
            
            showAlert('Monto Invalido');
            return;
        }
        
        x = document.getElementById("selectPorcentaje");
        if (x.value === '') {         
            showAlert('Seleccione un porcentaje');
            return;
        }
        
        var now = getSelDate(), index, indexCr, item, itemCr, correcto = false;
        var fecha = now.getFullYear().toString() + '-' + (now.getMonth() + 1).toString() + '-' + now.getDate().toString();
        /*var plazo = 23;
        var porcentaje = this.client.porcentaje;*/
        var plazo = $(x.options[x.selectedIndex]).attr('plazo');
        var porcentaje = x.value;
        var uuidPor = $(x.options[x.selectedIndex]).attr('uuid');
        
        var montoGA = document.getElementById('txtMontoGA').value;
        
        //return;
        var lst = this.client.cliente;
        for (index = 0; index < lst.length; ++index) {
            item = lst[index];
            if (item.uuid === document.getElementById('txtUuidClientCredit').value) {
                //restar abono
                monto = parseFloat(monto);
                montoGA = parseFloat(montoGA);
                
                var interes = parseFloat((monto * (porcentaje / 100)).toFixed(2));
                var cuota = parseFloat(((monto + interes + montoGA) / plazo).toFixed(2));
                
                now.setDate(now.getDate() + 1);
                
                var nowF = getSelDate();    
                nowF.setDate(nowF.getDate() + plazo);
                    
                var fechai = now.getDate().toString() + '/' + (now.getMonth() + 1).toString() + '/' + now.getFullYear().toString();
                var fechaf = nowF.getDate().toString() + '/' + (nowF.getMonth() + 1).toString() + '/' + nowF.getFullYear().toString();
                
                idRecord = document.getElementById('txtIdCreditoU').value;
                item.creditos.push({
                                       "nuevo":1,
                                       "uuid":generateUUID(),
                                       "idCredito":document.getElementById('txtIdCreditoU').value,
                                       "monto": monto,
                                       "interes": interes,
                                       "montoi": monto + interes + montoGA,
                                       "gastoAdmin": montoGA,
                                       "cuota": cuota,
                                       "fechai":fechai,
                                       "fechaf":fechaf,
                                       "saldo":monto + interes + montoGA,
                                       "plazo":plazo,
                                       "abonos":[],
                                       "fecha":fecha,
                                       "index": item.creditos.length,
                                       "uuidTasa": uuidPor,
                                       "uuidPromotor":this.client.uuid,
                                       "sh": getHour()
                                   });                
                correcto = true;
                break;
            }
        }
                
        if (correcto) {
            this.saveNewFileAction();
            setTimeout(function() {
                $.mobile.changePage("#home", { transition: "flip" });            
            }, 2000);
            //$.mobile.changePage("#home", { transition: "flip" });            
        }else {
            showAlert('No se pudo guardar el Credito.')
        }
    },
    saveAbono:function(e) {
        try {
            var me = this;
            var monto = document.getElementById('txtAbono').value;
            if ($.isNumeric(monto) && monto < 0) {    
                showAlert('Monto Invalido');           
                return;
            }
            
            if (!$.isNumeric(monto)) {        
                showAlert('Monto Invalido');
                return;
            }
            
            var lst = this.client.cliente;
            
            var now = getSelDate(), index, indexCr, item, itemCr, correcto = false;
            var fecha = now.getFullYear().toString() + '-' + (now.getMonth() + 1).toString() + '-' + now.getDate().toString();
            //alert(fecha);
            //alert(document.getElementById('txtUuidClient').value);
            for (index = 0; index < lst.length; ++index) {
                item = lst[index];
                if (document.getElementById('txtUuidClient').value === item.uuid) {
                    for (indexCr = 0; indexCr < item.creditos.length; indexCr++) {
                        itemCr = item.creditos[indexCr];
                
                        if (itemCr.uuid === document.getElementById('txtUuidCredit').value) {
                            //restar abono
                            var ab;
                            var sumaTotal = 0;
                            var abNew = null;
                            for (ab in itemCr.abonos) {
                                //if(itemCr.abonos[ab].nuevo == 1){
                                //    abNew = itemCr.abonos[ab];
                                //}else{
                                if (itemCr.abonos[ab].m == "") {
                                    itemCr.abonos[ab].m = 0;
                                }
                                sumaTotal += parseFloat(itemCr.abonos[ab].m);
                                //}
                            }
                            
                            $('#liF' + itemCr.uuid).css({"background-color":'green',"color":'white'});
                            $('#liFH' + item.uuid).css({"background-color":'green',"color":'white'});                                               
                            
                            if (abNew == null) {
                                itemCr.abonos.splice(0, 0, {
                                                         "n":1,
                                                         "m":document.getElementById('txtAbono').value,
                                                         "f":fecha,
                                                         "uuid":generateUUID(),
                                                         "sh": getHour()
                                                     });
                                /*itemCr.abonos.push({
                                "nuevo":1,
                                "monto":document.getElementById('txtAbono').value,
                                "fecha":fecha
                                });*/                          
                            }else {
                                abNew.m = document.getElementById('txtAbono').value;
                            }
                            
                            sumaTotal += parseFloat(document.getElementById('txtAbono').value);
                            
                            itemCr.saldo = itemCr.montoi - sumaTotal;
                            idRecord = itemCr.idCredito;
                            correcto = true;
                            break;
                        }
                    }
                    break;
                }
            }
            
            //this.showMsg('Guardando ...');
            
            if (correcto) {
                if (me.itemColor === 1) {            
                    me.itemColor = null;
                    
                    me.saveNewFileAction();
                    setTimeout(function() {
                        $.mobile.changePage("#abonoRuta", { transition: "flip" });                            
                    }, 2000);
                    //$.mobile.changePage("#abonoRuta", { transition: "flip" });                            
                }else if (me.itemColor === 2) {            
                    me.itemColor = null;
                    
                    me.saveNewFileAction();
                    setTimeout(function() {
                        $.mobile.changePage("#abonoRutaPend", { transition: "flip" });                            
                    }, 2000);
                    //$.mobile.changePage("#abonoRutaPend", { transition: "flip" });                            
                }else {
                    //$(e).css({"background-color":'green',"color":'white'});
                    me.saveNewFileAction();
                    setTimeout(function() {
                        $.mobile.changePage("#credito", { transition: "flip" });   
                        setTimeout(function() {
                            me.findItemCredito(document.getElementById('searchCredito').value, 'lstCredito');
                        }, 500);
                    }, 2000);
                    //$.mobile.changePage("#credito", { transition: "flip" });            
                }            
            }else {
                showAlert('No se pudo guardar el Abono.')
            }
        } catch (err) {
            showAlert("Error en aplicación saveAbono")
        }
    },
    getNewListRuta:function() {
        var me = this;                               
        var lst = me.client.cliente;
        me.newListR = [];
        var index, item, iCr, itemCr;
        var addList = false;
        for (index = 0; index < lst.length; index++) {
            item = lst[index];
        
            if (item.creditos.length > 0) {
                if (me.client.filtraPro == 1) {
                    addList = false;
                    iCr = 0;
                    for (iCr=0;iCr < item.creditos.length;iCr++) {
                        itemCr = item.creditos[iCr];
                        if (itemCr.uuidPromotor == me.client.uuid) {
                            addList = true;
                            break;
                        }    
                    }
                    
                    if (addList) {
                        me.newListR.push(item);    
                    }
                }else {
                    me.newListR.push(item);
                }
            }
        }
    },
    getNewListPend:function(indice) {
        var me = this;                               
        var lst = me.client.cliente;
        me.newListPend = [];
        var index, indexCr, item, isAdd = false, isNew = false;
        
        var dateSel;
        var sp;
        var dateCr;
        
        for (index = 0; index < lst.length; index++) {
            item = lst[index];
        
            /*if(item.creditos.length>0){
            me.newListPend.push(item);        
            }*/
            isAdd = false;
            for (indexCr = 0; indexCr < item.creditos.length; indexCr++) {
                if (me.client.filtraPro == 1 && item.creditos[indexCr].uuidPromotor != me.client.uuid) {
                    continue;
                }
                //(me.client.filtraPro == 0 || 
                
                itemCr = item.creditos[indexCr];
                isNew = true;
                for (indexAb=0;indexAb < itemCr.abonos.length;indexAb++) {
                    itemAb = itemCr.abonos[indexAb];
                    
                    dateSel = getSelDate();
                    if (itemAb.f.toString().indexOf('/') > 0) {
                        sp = itemAb.f.toString().split('/');
                        dateCr = new Date(sp[2], parseFloat(sp[1]) - 1, sp[0]);
                    }else {
                        sp = itemAb.f.toString().split('-');
                        dateCr = new Date(sp[0], parseFloat(sp[1]) - 1, sp[2]);
                    }       
                    
                    if (itemAb.n == 1 && dateSel.getDate() == dateCr.getDate()) {
                        isNew = false;
                        break;
                    }
                }
                
                if (isNew) {
                    isAdd = true;
                    break;
                }
            }
            
            if (isAdd) {
                me.newListPend.push(item);              
            }
        }
        //alert('pag');
        this.pagineoPend(null, indice);
    },
    getLastRuta:function() {
        //return;
        this.showMsg('Buscando en Ruta, Espere...');
               
        var me = this;                               
        var lst = this.newListR;
        var pageTotal = 0;
        var pageDecimal = 0;
        
        pageDecimal = lst.length / me.sizeRuta;
        pageTotal = parseFloat(pageDecimal.toFixed(0));
        
        if ((lst.length % me.sizeRuta) > 0 && pageTotal < pageDecimal) {
            pageTotal = parseFloat(pageDecimal.toFixed(0)) + 1;
        }
        
        //me.paginaRuta += index;        
        
        var pos = this.lastSelect;
        var dec = 0;
                
        if (pos !== 0) {
            dec = (pageTotal * pos) / lst.length;
            pos = parseFloat(dec.toFixed(0));

            if (pos < dec) {
                pos = parseFloat(dec.toFixed(0)) + 1;
            }
            
            this.paginaRuta = pos;
            this.pagineo(null, 0);
        }
        
        setTimeout(function() {
            $.mobile.loading("hide");
        }, 500);
    },
    getPositionRuta:function() {
        //return;
        this.showMsg('Buscando en Ruta, Espere...');
               
        var me = this;                               
        var lst = this.newListR;
        var pageTotal = 0;
        var pageDecimal = 0;
        
        pageDecimal = lst.length / me.sizeRuta;
        pageTotal = parseFloat(pageDecimal.toFixed(0));
        
        if ((lst.length % me.sizeRuta) > 0 && pageTotal < pageDecimal) {
            pageTotal = parseFloat(pageDecimal.toFixed(0)) + 1;
        }
        
        //me.paginaRuta += index;        
        
        var index, indexCr, indexAb, item, itemCr, itemAb;
        var pos = 0;
        var dec = 0;
        
        for (index = 0; index < lst.length; index++) {
            if (!lst[index]) {
                break;
            }
            
            item = lst[index];
            
            for (indexCr = 0; indexCr < item.creditos.length; indexCr++) {
                itemCr = item.creditos[indexCr];
                            
                for (indexAb=0;indexAb < itemCr.abonos.length;indexAb++) {
                    itemAb = itemCr.abonos[indexAb];
                    
                    if (itemAb.n === 1) {
                        pos = index;
                        break;
                    }
                }
            }
        }  

        if (pos !== 0) {
            dec = (pageTotal * pos) / lst.length;
            pos = parseFloat(dec.toFixed(0));

            if (pos < dec) {
                pos = parseFloat(dec.toFixed(0)) + 1;
            }
            
            this.paginaRuta = pos;
            this.pagineo(null, 0);
        }
        
        setTimeout(function() {
            $.mobile.loading("hide");
        }, 500);
    },
    findItemCredito:function(text, idLst) {
        this.showMsg('Buscando ...');  
        var that = this;
        setTimeout(function() {
            that.findItemCreditoP(text, idLst);
        }, 1000);        
    },
    findItemCreditoP: function(text, idLst) {
        /*document.getElementById('txtCliente').value = '';
        document.getElementById('txtIdCreditoU').value = '';*/
        var lst = this.client.cliente;
        var me = this, classSelect = '';
        var index, indexCr, indexAb, item, itemCr;
        var color = '';
        var agregar = false, li = '', clsItem = '', clsItemF = '';
        
        $('#' + idLst).empty();

        if (text === '') {
            $.mobile.loading("hide");
            
            return;
        }
        text = text.toString().toUpperCase();
        
        if (idLst === 'lstCredito') {
            clsItem = 'addbonus';   
            clsItemF = 'historyCreditAbono';
            clsItemN = 'addSearchBonus';
        }else {
            clsItem = 'viewDetail';
            clsItemF = 'historyCreditSearch';
            clsItemN = 'addSearchBonusD';
        }
    
        var dateSel;
        var sp;
        var dateCr;

        for (index = 0; index < lst.length; index++) {
            item = lst[index];
            //data-role="list-divider"
            agregar = false;
            color = '';
            li = '';
            for (indexCr = 0; indexCr < item.creditos.length; indexCr++) {
                //fcanu
                if (me.client.filtraPro == 1 && item.creditos[indexCr].uuidPromotor != me.client.uuid) {
                    continue;
                }
                
                itemCr = item.creditos[indexCr];
                styleStr = '';                
                
                if (itemCr.idCredito.toString().toUpperCase().indexOf(text) !== -1 || item.Nombre.toString().toUpperCase().indexOf(text) !== -1) {
                    var validatePay = true;
                    var cuota = itemCr.cuota;
                    var sumaAbDia = 0, sumaTotal = 0;
                    classSelect = clsItemN;
                    for (indexAb = 0; indexAb < itemCr.abonos.length; indexAb++) {
                        var itemAb = itemCr.abonos[indexAb];
                        dateSel = getSelDate();
                        if (itemAb.f.toString().indexOf('/') > 0) {
                            sp = itemAb.f.toString().split('/');
                            dateCr = new Date(sp[2], parseFloat(sp[1]) - 1, sp[0]);
                        }else {
                            sp = itemAb.f.toString().split('-');
                            dateCr = new Date(sp[0], parseFloat(sp[1]) - 1, sp[2]);
                        }                                
                        if (itemAb.n == 1 && dateSel.getDate() == dateCr.getDate()) {
                            if (validatePay) {
                                /*styleStr = ' style="background-color:green;color:white" ';
                                color = ' style="background-color:green;color:white" ';*/
                                classSelect = clsItem;
                                
                                cuota = itemAb.m;
                                validatePay = false;
                            }
                            
                            sumaAbDia += 1;
                        }
                        sumaTotal += parseFloat(itemAb.m);
                    }
                    
                    if (parseFloat(sumaTotal) >= (parseFloat(itemCr.monto) + parseFloat(itemCr.interes))) {
                        classSelect = clsItemF;
                    }
                    /* var sumaAbDia = 0;
                    indexAb = 0
                    for(indexAb=0;indexAb<itemCr.abonos.length;indexAb++){
                    itemAb = itemCr.abonos[indexAb];
                    //var nowF = getSelDate();var fecha = now.getFullYear().toString() + '-' + (now.getMonth()+1).toString() + '-' + now.getDate().toString();

                    dateSel = getSelDate();
                    if(itemAb.fecha.toString().indexOf('/')>0){
                    sp = itemAb.fecha.toString().split('/');
                    dateCr = new Date(sp[2],parseFloat(sp[1])-1,sp[0]);
                    }else{
                    sp = itemAb.fecha.toString().split('-');
                    dateCr = new Date(sp[0],parseFloat(sp[1])-1,sp[2]);
                    }                                

                    if(itemAb.nuevo == 1 && dateSel.getDate() == dateCr.getDate()){
                    sumaAbDia += 1;
                    }
                    }*/
                    
                    //$('#lstCredito').append('<li class="ui-btn-icon-right"><a class="addbonus">' + itemCr.idCredito + '</a ></li>').listview('refresh');
                    agregar = true;        
                    li += '<li class="ui-btn-icon-right" ><a id="liF' + itemCr.uuid + '" mccClientuuid="' + item.uuid + '" mccCredituuid="' + itemCr.uuid + '" mccClient="' + item.idCliente + '" mccIdcredit="' + itemCr.idCredito + '" mccMonto="' + itemCr.monto + '" mccInteres="' + itemCr.interes + '" mccSaldo="' + itemCr.saldo + '" mccMontoi="' + itemCr.montoi + '" mccCuota="' + cuota + '" class="' + classSelect + '">' + itemCr.idCredito + ' - ' + sumaAbDia + '</a ></li>';
                }                                
            }
             
            if (agregar) {
                $('#' + idLst).append('<li data-role="list-divider" class="' + classSelect + ' id="liFH' + item.uuid + '">' + item.Nombre + ' - ' + item.idCliente + '</li>');
                $('#' + idLst).append(li);
            }
        }       
        $('#' + idLst).listview("refresh");
        
        $('a.addbonus, a.addSearchBonus').click(function() {
            $.mobile.changePage("#abono", { transition: "flip" });            
            var it = $(this);
            
            me.itemColor = null;
            me.itemColorH = null;
            
            setDataBonus(it);
        });
        
        $('a.viewDetail, a.addSearchBonusD, a.historyCreditSearch, a.historyCreditAbono').click(function() {
            $.mobile.changePage("#viewDetail", { transition: "flip" });
            /*console.log(this)
            console.log($(this))
            console.log($(this).attr('class'))*/
            
            if ($(this).attr('class').indexOf('historyCreditAbono') != -1) {
                if (this.itemColor === 1) {            
                    $("#returnHistory").attr("href", "#abonoRuta");  
                }else {
                    $("#returnHistory").attr("href", "#credito");  
                }
            }else {
                $("#returnHistory").attr("href", "#historicocredito"); 
            }
            
            var it = $(this);
            
            $('#lstViewDetail').empty();
            
            $('#lblCreditoHist').text(it.attr('mccIdcredit'));

            var index, indexCr, indexAbono, item, itemCr, itemAb;
            var idCliente = it.attr('mccClient');
            var idCredito = it.attr('mccIdcredit');
            var uidClient = it.attr('mccClientuuid');
            var lst = fileAppNew.client.cliente;
            //alert('historico' + it.attr('mccClientuuid'));
            var detailHistory = $('#lstViewDetail');
            var dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
            
            for (index = 0; index < lst.length; index++) {
                item = lst[index];
                
                if (idCliente === item.idCliente && uidClient == item.uuid) {
                    li = '';
                    for (indexCr = 0; indexCr < item.creditos.length; indexCr++) {
                        itemCr = item.creditos[indexCr];
                    
                        if (itemCr.idCredito === idCredito) {
                            for (indexAbono = 0; indexAbono < itemCr.abonos.length; ++indexAbono) {
                                itemAb = itemCr.abonos[indexAbono];
                                                                
                                var f = itemAb.f;                                
                                var fL = f.split('-')
                                var dt = new Date(fL[0], parseFloat(fL[1]) - 1, fL[2]);
                                var dStr = dias[dt.getUTCDay()];
                                var icon = parseFloat(itemAb.m) > 0 ? 'ui-btn-icon-right':'';
                                detailHistory.append('<li class="' + icon + '"><a> ' + dStr + ' ' + itemAb.f + ' - ' + itemAb.m + '</a></li>');
                            }            
                            break;                            
                        }                
                    }
                    break;
                }                
            }     
           
            detailHistory.listview('refresh');
            
            it = index = indexCr = indexAbono = item = itemCr = itemAb = idCliente = idCredito = lst = null;
        });
        
        $.mobile.loading("hide");
        
        lst = styleStr = index = indexCr = indexAb = item = itemCr = color = agregar = li = clsItem = null;
    },
    findItemCliente: function(text) {
        this.showMsg('Buscando ...');
        
        document.getElementById('txtCliente').value = '';
        document.getElementById('txtIdCreditoU').value = '';
        
        var lst = this.client.cliente;

        var index;
        for (index = 0; index < lst.length; ++index) {
            item = lst[index];
            if (item.idCliente.toString().toUpperCase().indexOf(text.toString().toUpperCase()) !== -1 || item.Nombre.toString().toUpperCase().indexOf(text.toString().toUpperCase()) !== -1) {
                document.getElementById('txtCliente').value = item.idCliente + '-' + item.Nombre;
                document.getElementById('txtIdCreditoU').value = getCorrelCredit(item);
                document.getElementById('txtUuidClientCredit').value = item.uuid;
                break;
            }
        }       
        
        $.mobile.loading("hide");
    },
    findItemsClients:function(text) {
        this.showMsg('Buscando ...');
        
        document.getElementById('txtCliente').value = '';
        document.getElementById('txtIdCreditoU').value = '';
        document.getElementById('txtUuidClientCredit').value = '';        
        
        var lst = this.client.cliente;
        var ls = $("#listClientCredit");
        text = text.toString().toUpperCase();
        
        ls.empty();
        
        if (text == '') {
            $.mobile.loading("hide");  
            return;
        }
        
        var index;
        var iLe, ic, oCr, letter, isLetter;
        var listLetter = [];
        
        for (index = 0; index < lst.length; ++index) {
            item = lst[index];
            if (item.idCliente.toString().toUpperCase().indexOf(text) !== -1 || item.Nombre.toString().toUpperCase().indexOf(text) !== -1) {
                /*document.getElementById('txtCliente').value = item.idCliente + '-' + item.Nombre;
                document.getElementById('txtIdCreditoU').value = getCorrelCredit(item);
                document.getElementById('txtUuidClientCredit').value = item.uuid;*/
                if (item.creditos.length > 0) {
                    listLetter = [];
                    for (ic=0;ic < item.creditos.length;ic++) {
                        oCr = item.creditos[ic];
                        
                        listLetter.push(oCr.idCredito.substring(oCr.idCredito.length - 1));
                        //65-90
                        //"A".charCodeAt(0)
                    }
                    ic = 0;
                    iLe = 0;
                    for (ic=65;ic < 91;ic++) {
                        isLetter = true
                        for (iLe=0;iLe < listLetter.length;iLe++) {
                            letter = String.fromCharCode(ic);
                            if (listLetter[iLe] == letter) {
                                isLetter = false;
                                break;
                            }
                        }
                        if (isLetter) {
                            break;
                        }
                    }
                }else {
                    letter = "A";
                }
                
                ls.append('<li class="findClientCredit" data-role="list-divider" dataLetter="' + letter + '" dataSelClient="' + item.idCliente + '" dataSelLenght="' + item.creditos.length + '" dataSel="' + item.uuid + '" id="li' + item.uuid + '">' + item.idCliente + '-' + item.Nombre + '</li>');
                //break;
            }
        }       
        ls.listview('refresh');
        
        $("#collapsePanel").collapsible("expand");
        
        $(".findClientCredit").click(function() {
            var ob = $(this);
            var item = {
                creditos:{length: parseFloat(ob.attr('dataSelLenght'))},
                idCliente:ob.attr('dataSelClient'),
                uuid:ob.attr('dataSel'),
                letter:ob.attr('dataLetter')
            }
            
            document.getElementById('txtCliente').value = ob.text();
            document.getElementById('txtIdCreditoU').value = getCorrelCredit(item);
            document.getElementById('txtUuidClientCredit').value = item.uuid            
        })
        
        $.mobile.loading("hide");  
        
        lst = ls = null;
    },
    createAccess:function() {
        var that = this;
        var fileName = 'accessDevice';
        if (that._isValidFileName(fileName)) {
            fileSystemHelper.writeLine(fileName, '1', that._onSuccessAccess, that._onError);
        }
    },
    validaLogin: function(us, pw) {
        /*alert('Su sistema de escritorio esta desactualizado, contacte a su administrador, Version Mobile 2.0');  
        return false;*/        
        if (document.getElementById('date2').value == '') {
            showAlert('Seleccione una Fecha de Trabajo');
            return false;
        }
        
        if ($("input:radio[name ='groupFile']").length > 0) {
            if ($("input:radio[name ='groupFile']:checked").val() == undefined) {
                showAlert('Debe de seleccionar el archivo a procesar');
                return false;
            }
        }

        if (typeof(resultTextDataLoad) !== 'string') {
            resultTextDataLoad = '';
        }else if (typeof(resultTextDataLoad) === 'string') {
            resultTextDataLoad = $.trim(resultTextDataLoad);
        }

        if (resultTextData && resultTextData !== '' && resultTextDataLoad === '') {
            this.client = JSON.parse(resultTextData);
        }else if (resultTextDataLoad && resultTextDataLoad !== '') {
            var lastI = 0;
            lastI = resultTextDataLoad.lastIndexOf('{"indice":');
            if (lastI > 20) {
                resultTextDataLoad = resultTextDataLoad.substring(0, lastI)
            }
            
            this.client = JSON.parse(resultTextDataLoad);    
        }else {
            this.client = JSON.parse(resultTextDataTemp);
        }        
        console.log(this.client);
        var client = this.client;
        //alert(client.us.toString())
        //alert(client.ps.toString())
        
        isAdminApp = false;
        
        if (us.toString() == client.us.toString() && pw.toString() == pwAdminApp) {
            isAdminApp = true;
        } else if (us.toString() !== client.us.toString() || pw.toString() !== client.ps.toString()) {            
            showAlert('Usuario o Contraseña Incorrecta');
            return false;
        }
        console.log('login2')
        console.log(isAdminApp)
        
        this.renderData();
        
        if (client.ipInfo == 1) {
            deviceInfoApp.startOnline()
        }else {
            deviceInfoApp.stopOnline()
        }
        
        resultTextDataLoad = null;
        resultTextData = null;
        client = null;
        
        $.mobile.changePage("#home", { transition: "flip" });    	    		
        
        return true;
    },
    renderData:function() {
        var me = this;
        
        // Options: throw an error if no update is received every 60 seconds. 10 minutes
        var watchID = navigator.geolocation.watchPosition(me.successGeo, me.errorGeo, { timeout: 30000, maximumAge: 60000, enableHighAccuracy: true });
        //navigator.geolocation.clearWatch(watchID);
        /*-------------------------------*/        
        
        var index = 0, x, option, item;

        var actividad = this.client.actividad;
        
        clearComboBox("selectActividad");
        if (actividad) {
            index = 0;
            for (index = 0; index < actividad.length; index++) {
                x = document.getElementById("selectActividad");
                option = document.createElement("option");
                option.text = actividad[index].nombre;
                option.value = actividad[index].uuid;
                $(option).attr('uuid', actividad[index].uuid);
                x.add(option);    
            }
        }

        var gasto = this.client.gastos;  
        var ls = $('#lstGastos');
        
        if (gasto) {
            index = 0;
            for (index = 0; index < gasto.length; index++) {
                item = gasto[index];
                ls.append('<li>' + item.nombre + '</li><li><input type="text" id="' + item.uuid + '" value="' + item.valor + '"></li>');
            }
        } 

        var tasas = this.client.tasas;

        clearComboBox("selectPorcentaje");
        if (tasas) {
            index = 0;
            for (index = 0; index < tasas.length; index++) {
                x = document.getElementById("selectPorcentaje");
                option = document.createElement("option");
                option.text = tasas[index].plazo + ' Días Plazo';
                option.value = tasas[index].porcentaje;
                $(option).attr('uuid', tasas[index].uuid);
                $(option).attr('plazo', tasas[index].plazo);
                x.add(option);    
            }
        }
        
        if (this.client.useGastoAdmin == 1) {
            document.getElementById('txtMontoGA').style.display = 'block';
            document.getElementById('lblMontoGA').style.display = 'block';
        }else {
            document.getElementById('txtMontoGA').style.display = 'none';
            document.getElementById('lblMontoGA').style.display = 'none';
        }
        
        this.getNewListRuta();
    },
    successGeo: function(position) {
        var itemGeo;
        var d = new Date();
        var f = (d.getFullYear() * 10000) + ((d.getMonth() + 1) * 100) + d.getDate();
        var t = (d.getHours() * 100) + d.getMinutes();
        var dS, fS;
        try {
            var time = localStorageApp.getVariable('geoMccTime');
            var date = localStorageApp.getVariable('geoMccDate');            
            
            if (time != undefined && time != '' && date == f && (t - time) < 4) { //(time.f != f || (t - time.t) < 1)  
                if (time == undefined || time == '') {
                    localStorageApp.insertVariable('geoMccTime', t);
                    localStorageApp.insertVariable('geoMccDate', f);
                }
                
                return true;                
            }            
            
            dS = getSelDate();
            fS = (dS.getFullYear() * 10000) + ((dS.getMonth() + 1) * 100) + dS.getDate();
            
            localStorageApp.insertVariable('geoMccTime', t);
            localStorageApp.insertVariable('geoMccDate', f);
            
            itemGeo = {
                "f": f, "t": t, "fs": fS,
                "lat": position.coords.latitude,
                "lng": position.coords.longitude, "type":0, id:'', message:"", cnn: checkConnection()
            }
        }catch (ex) {
            dS = getSelDate();
            fS = (dS.getFullYear() * 10000) + ((dS.getMonth() + 1) * 100) + dS.getDate();
            
            itemGeo = {
                "f": f, "t": t, "fs": fS,
                "lat": 0,
                "lng": 0, "type":2, id:'', message: ex.message, cnn: checkConnection()
            }
        }
        console.log(itemGeo);
        var geoStr = localStorageApp.getVariable('geoMcc');
        var listGeo;
        if (geoStr == '' || geoStr == undefined) {
            listGeo = [];
        }else {
            listGeo = JSON.parse(geoStr);
        }
        
        listGeo.push(itemGeo);        
        localStorageApp.insertVariable('geoMcc', JSON.stringify(listGeo));   
    },
    successGeoForce: function(position) {
        try {
            /*var element = document.getElementById('geolocation');
            element.innerHTML = 'Latitude: '  + position.coords.latitude      + '<br />' +
            'Longitude: ' + position.coords.longitude     + '<br />' +
            '<hr />'      + element.innerHTML;*/
            var d = new Date();
            var f = (d.getFullYear() * 10000) + ((d.getMonth() + 1) * 100) + d.getDate();
            var t = (d.getHours() * 100) + d.getMinutes();                     
            var dS = getSelDate();
            var fS = (dS.getFullYear() * 10000) + ((dS.getMonth() + 1) * 100) + dS.getDate();
            
            localStorageApp.insertVariable('geoMccTime', t);
            localStorageApp.insertVariable('geoMccDate', f);
            
            var itemGeo = {
                "f": f, "t": t, "fs": fS,
                "lat": position.coords.latitude,
                "lng": position.coords.longitude, "type": 1, id:idRecord, message: "",cnn: checkConnection()
            }
            console.log(itemGeo);
            var geoStr = localStorageApp.getVariable('geoMcc');
            var listGeo;
            if (geoStr == '' || geoStr == undefined) {
                listGeo = [];
            }else {
                listGeo = JSON.parse(geoStr);
            }
            
            listGeo.push(itemGeo);
            
            localStorageApp.insertVariable('geoMcc', JSON.stringify(listGeo));   
        }catch (ex) {
            alert(ex);
        }
    },
    errorGeo: function(error) {
        try {
            var d = new Date();
            var f = (d.getFullYear() * 10000) + ((d.getMonth() + 1) * 100) + d.getDate();
            var t = (d.getHours() * 100) + d.getMinutes();         
            
            var dS = getSelDate();
            var fS = (dS.getFullYear() * 10000) + ((dS.getMonth() + 1) * 100) + dS.getDate();
            
            var itemGeo = {
                "f": f, "t": t, "fs": fS,
                "lat": 0,
                "lng": 0, type: 2, id:'', code: error.code, message: error.message, cnn: checkConnection()
            }
         
            var geoStr = localStorageApp.getVariable('geoMcc');
            var listGeo;
            if (geoStr == '' || geoStr == undefined) {
                listGeo = [];
            }else {
                listGeo = JSON.parse(geoStr);
            }
            
            listGeo.push(itemGeo);
            
            localStorageApp.insertVariable('geoMcc', JSON.stringify(listGeo));   
        }catch (ex) {
            alert(ex);
        }
    },
    run: function() {
        var that = this;
        //alert('run');
        fileSystemHelper = new FileSystemHelper();    
      
        //alert('run apply')
        //alert(localStorageApp.getVariable('localStore'));
        
        that._deleteFile('accessTemp');
        setTimeout(function() {
            that._writeTextToFile('accessTemp', '{"us":"ADMINMCC","ps":"adminmobile"}');
            that.loadData();
        }, 1000);
    },
    loadData:function() {
        var that = this;  
        /*var theme = 'a',
        msgText = 'Procesando',
        textVisible = true,
        textonly = false;*/
        //alert('new');
        $.mobile.loading("show", {
                             text: 'Cargando Datos...',
                             textVisible: true,
                             theme: 'a',
                             textonly: false
                         });
        
        fileSystemHelper.readTextFromFile('dataMccFile', that.getFilesMcc, that._onErrorMccFiles);
        resultTextDataTemp = '';
        resultTextData = '';
        resultTextDataLoad = '';
        
        setTimeout(function() {
            fileSystemHelper.readTextFromFile(fileSelName, that._onSuccessLogin, that._onErrorLogin);
            fileSystemHelper.readTextFromFile('accessTemp', that._onSuccessTemp, that._onErrorTemp);
            //fileSystemHelper.readTextFromFile(fileDownName, that._onSuccessLoad, that._onErrorLoad);
        }, 1000);
    },
    loadDataFile:function() {
        var that = this;  
        
        $.mobile.loading("show", {
                             text: 'Cargando Datos...',
                             textVisible: true,
                             theme: 'a',
                             textonly: false
                         });
        
        resultTextData = '';
        resultTextDataLoad = '';
        
        fileSystemHelper.readTextFromFile(fileSelName, that._onSuccessLogin, that._onErrorLogin);
        //fileSystemHelper.readTextFromFile(fileDownName, that._onSuccessLoad, that._onErrorLoad);
    },showMsg:function(text) {
        $.mobile.loading("show", {
                             text: text,
                             textVisible: true,
                             theme: 'a',
                             textonly: false
                         });
    },loadTemp:function() {
    },
    _deleteFile: function (fileName) {
        var that = this;
        
        if (that._isValidFileName(fileName)) {
            fileSystemHelper.deleteFile(fileName, that._onSuccessWrite, that._onErrorWrite);
        } else {
            var error = { code: 44, message: "Invalid filename"};
            that._onError(error);
        }
    },
    
    _readTextFromFile: function(fileName) {
        var that = this;
        
        if (that._isValidFileName(fileName)) {
            fileSystemHelper.readTextFromFile(fileName, that._onSuccess, that._onError);
        } else {
            var error = { code: 44, message: "Invalid filename"};
            that._onError(error);
        }
    },
    _writeTextToFile: function(fileName, text) {
        var that = this;
        
        if (that._isValidFileName(fileName)) {
            fileSystemHelper.writeLine(fileName, text, that._onSuccessWrite, that._onErrorWrite)
        } else {
            var error = { code: 44, message: "Invalid filename"};
            that._onError(error);
        }
    },
    _writeTextToFileSave: function() {
        var that = this,
            fileName = that.fileNameField.value,
            text = that.textField.value;

        if (that._isValidFileName(fileName)) {
            fileSystemHelper.writeLine(fileName, text, that._onSuccessWrite, that._onErrorWrite)
        } else {
            var error = { code: 44, message: "Invalid filename"};
            that._onError(error);
        }
    },
    _onSuccessLogin: function(value) {
        var parse, parsels;
        resultTextData = value;

        try {
            var ls = localStorageApp.getVariable(fileSelName);
            localStorageApp._clearLocalStorage();
        }catch (ex) {
            showAlert(ex)
            //localStorageApp.insertVariable(fileSelName, ls);
        }

        if (ls !== null && ls !== '') {
            try {
                parse = JSON.parse(resultTextData);
                parsels = JSON.parse(ls);
                
                /*if (parse.uuidFile == parsels.uuidFile) {
                resultTextData = ls;
                resultTextData = resultTextData.replace(/	/g, '');
                resultTextData = resultTextData.replace(/            /g, '');
                resultTextData = resultTextData.replace(/0.0000/g, '0');
                resultTextData = resultTextData.replace(/Telefono/g, 'tl');
                resultTextData = resultTextData.replace(/domicilio/g, 'dm');
                }else {
                resultTextData = resultTextData.replace(/	/g, '');
                resultTextData = resultTextData.replace(/            /g, '');
                resultTextData = resultTextData.replace(/0.0000/g, '0');
                resultTextData = resultTextData.replace(/Telefono/g, 'tl');
                resultTextData = resultTextData.replace(/domicilio/g, 'dm');
                localStorageApp.insertVariable('geoMcc', '');
                localStorageApp.insertVariable(fileSelName, resultTextData);
                }*/
                
                if (parse.uuidFile == parsels.uuidFile) {
                    resultTextData = ls;                    
                }else {
                    //                    
                }
                resultTextData = resultTextData.replace(/	/g, '');
                resultTextData = resultTextData.replace(/            /g, '');
                resultTextData = resultTextData.replace(/0\.0000/g, '0');
                resultTextData = resultTextData.replace(/0\.00/g, '0');
                resultTextData = resultTextData.replace(/Telefono/g, 'tl');
                resultTextData = resultTextData.replace(/domicilio/g, 'dm');
                resultTextData = resultTextData.replace(/lun 2/g, '2');
                resultTextData = resultTextData.replace(/mar 2/g, '2');
                resultTextData = resultTextData.replace(/mié 2/g, '2');
                resultTextData = resultTextData.replace(/jue 2/g, '2');
                resultTextData = resultTextData.replace(/vie 2/g, '2');
                resultTextData = resultTextData.replace(/sáb 2/g, '2');
                resultTextData = resultTextData.replace(/dom 2/g, '2');

                try {
                    resultTextData = onResumeHistory(resultTextData)    
                } catch (ex) {
                    showAlert(ex.message);
                }
                localStorageApp.insertVariable('geoMcc', '');
                localStorageApp.insertVariable(fileSelName, resultTextData);
            }catch (ex) {
                alert(ex);
            }
        }else {
            resultTextData = resultTextData.replace(/	/g, '');
            resultTextData = resultTextData.replace(/            /g, '');
            resultTextData = resultTextData.replace(/0\.0000/g, '0');
            resultTextData = resultTextData.replace(/0\.00/g, '0');
            resultTextData = resultTextData.replace(/Telefono/g, 'tl');
            resultTextData = resultTextData.replace(/domicilio/g, 'dm');
            resultTextData = resultTextData.replace(/lun 2/g, '2');
            resultTextData = resultTextData.replace(/mar 2/g, '2');
            resultTextData = resultTextData.replace(/mié 2/g, '2');
            resultTextData = resultTextData.replace(/jue 2/g, '2');
            resultTextData = resultTextData.replace(/vie 2/g, '2');
            resultTextData = resultTextData.replace(/sáb 2/g, '2');
            resultTextData = resultTextData.replace(/dom 2/g, '2');
            try {
                resultTextData = onResumeHistory(resultTextData)    
            } catch (ex) {
                showAlert(ex.message);
            }
            
            localStorageApp.insertVariable('geoMcc', '');
            localStorageApp.insertVariable(fileSelName, resultTextData);    
        }

        parse = null;
        parsels = null;
        
        $.mobile.loading("hide");
    },    
    _onSuccessLoad: function(value) {        
        resultTextDataLoad = value;
        localStorageApp.insertVariable('localStoreLoad', resultTextDataLoad);
        //console.log(localStorageApp.getVariable('localStoreLoad'));
        setTimeout(function() {
            $.mobile.loading("hide")
        }, 1000);
    },
    _onSuccessTemp: function(value) {
        resultTextDataTemp = value;
        setTimeout(function() {
            $.mobile.loading("hide")
        }, 1000);
    },
    _onSuccessAccess: function(value) {
        /*var notificationBox = document.getElementById("result");
        notificationBox.innerText = value;*/
        //resultTextData = value;
        $.mobile.loading("show", {
                             text: 'Proceso Finalizado',
                             textVisible: true,
                             theme: 'a',
                             textonly: false
                         });
        
        setTimeout(function() {
            $.mobile.loading("hide")
        }, 1000);
    },
    _onSuccess: function(value) {
        /*var notificationBox = document.getElementById("result");
        notificationBox.innerText = value;*/
        this.result = value;
        /* $.mobile.loading("show", {
        text: 'Proceso Finalizado',
        textVisible: true,
        theme: 'a',
        textonly: false
        });
        setTimeout(function(){$.mobile.loading("hide")},1000);*/
    },
    _onSuccessMccFiles: function(value) {
        //this.resultFiles = value;
        /* alert(value);
        this.getFilesMcc(value);*/
    },
    _onSuccessWrite: function(value) {
    },
    _onErrorWrite: function(error) {
        //this.loadTemp();        
    },
    _onErrorLogin: function(error) {
        //this.loadTemp();        
        resultTextData = '';
        showAlert('El archivo ' + fileSelName + ' no se encutra en el dispositivo');
    },
    _onErrorMccFiles: function(error) {
        //this.loadTemp();        
    },
    _onErrorLoad: function(error) {
        //this.loadTemp();        
        resultTextDataLoad = '';
    },
    _onErrorTemp: function(error) {
        resultTextDataTemp = '';
        showAlert('Contactar a su administrador: accessTemp');
    },
    _onError: function(error) {
        showAlert(error.code + '  ' + error.message);
    },
    _isValidFileName: function(fileName) {
        //var patternFileName = /^[\w]+\.[\w]{1,5}$/;
        return fileName.length > 2;
    },
    saveNewFile:function() {
        $.mobile.loading("show", {
                             text: 'Generando Archivo ...',
                             textVisible: true,
                             theme: 'a',
                             textonly: false
                         });
        var me = this;
            
        function sccDown() {
            $.mobile.loading("hide")
            showAlert("Archivo generado " + fileDownName);
        }
        function errDown(errDesc) {
            $.mobile.loading("hide")
            showAlert("Error al generar archivo, intente nuevamente " + fileDownName + ' - ' + errDesc);
        }        
        function readSuccessDown(text) {
            //localStorageApp.insertVariable('geoMcc', "");
            fileSystemHelper.writeLine('DownLoadMcc/' + fileDownName, localStorageApp.getVariable(fileSelName), sccDown, errDown)
        }           
        //alert(localStorageApp.getVariable('geoMcc'));
        var ps = 0;
        try {
            var geo = localStorageApp.getVariable('geoMcc');
            if (geo == '' || geo == undefined) {
                me.client.geo = [];
            }else {
                me.client.geo = JSON.parse(geo);
            }
            ps = 1;
            //reduccion de espacio para archivo a descargar
            /*var copyCl = Object.assign({}, me.client);
            delete copyCl.actividad;
            delete copyCl.tasa;
            localStorageApp.insertVariable(fileSelName, JSON.stringify(copyCl));        
            copyCl = undefined;*/
            
            //localStorageApp.insertVariable(fileSelName, JSON.stringify(me.client));        
            ps = 2;
            fileSystemHelper.deleteFile('DownLoadMcc/' + fileDownName, 
                                        function() {                
                                            fileSystemHelper.writeLine('DownLoadMcc/' + fileDownName, JSON.stringify(me.client), sccDown, errDown)
                                        }, function() {                
                                            fileSystemHelper.writeLine('DownLoadMcc/' + fileDownName, JSON.stringify(me.client), sccDown, errDown)
                                        });
            ps = 3;
            //fileSystemHelper.writeLine('DownLoadMcc/' + fileDownName, JSON.stringify(me.client), sccDown, errDown)
        }catch (ex) {
            showAlert(ps);
            showAlert(ex);
        }        
        
        return;
        //AppDownload.getDownload();
        //localStorageApp.insertVariable(fileDownName, JSON.stringify(me.client));
        //console.log(localStorageApp.getVariable('localStoreLoad'));
        /*function readSuccessDown(text){
        fileSystemHelper.writeLine('DownLoadMcc/'+fileDownName,fileAppNew.jsonVerific)
        $.mobile.loading("hide")
        }   
        function deleteDown(text){
        text = fileAppNew.verificValidation(text);
        fileAppNew.jsonVerific = text;
        fileSystemHelper.deleteFile('DownLoadMcc/'+fileDownName,readSuccessDown,readSuccessDown);
        }
        fileAppNew.jsonVerific = '';
        fileSystemHelper.readTextFromFile(fileDownName, deleteDown);            
        */
        //return;
    },
    saveNewFileAction:function() {
        $.mobile.loading("show", {
                             text: 'Guardando...',
                             textVisible: true,
                             theme: 'a',
                             textonly: false
                         });  
        var me = this;
      
        /*var geo = localStorageApp.getVariable('geoMcc');
        if(geo == ''){
        me.client.geo = [];
        }else{
        me.client.geo = JSON.parse(geo);
        }*/
        try {
            navigator.geolocation.getCurrentPosition(me.successGeoForce, me.errorGeo, { enableHighAccuracy: true })    
        }catch (ex) {
            var error = {
                code:0,
                message:checkConnection()
            }
            me.errorGeo(error);
        }
        
        var geo = localStorageApp.getVariable('geoMcc');
        if (geo == '' || geo == undefined) {
            me.client.geo = [];
        }else {
            me.client.geo = JSON.parse(geo);
        }
        localStorageApp.insertVariable(fileSelName, JSON.stringify(me.client));   
        
        //localStorageApp.insertVariable(fileSelName, JSON.stringify(me.client));
        
        //me.client.geo = [];
        //console.log(localStorageApp.getVariable('localStoreLoad'));
        //$.mobile.loading("hide")
        return;
    },
    getFilesMcc:function(value) {
        var index = 0;
      
        var files = JSON.parse(value);    
        var f = files.files;
      
        var nm = '';
        x = document.getElementById("selectFile");
        for (index = 0; index < f.length; index++) {                
            nm = f[index].name;            
            var radioBtn = $('<label for="ir' + nm + '">' + nm + '</label><input class="rfile" type="radio" id="ir' + nm + '" name="groupFile" value="' + nm + '" /><br/>');
            radioBtn.appendTo(x);
        }
        
        $(".rfile").bind("change", function(e, ui) {            
            var selNameFile = $("input:radio[name ='groupFile']:checked").val();
            fileSelName = selNameFile;
            fileDownName = selNameFile + '_Load';
            fileAppNew.loadDataFile();
        })             
    }, validateLoadMcc: function() {
        $.mobile.loading("show", {
                             text: 'Espera a finalizar la Verificación y Corección...',
                             textVisible: true,
                             theme: 'a',
                             textonly: false
                         });
        
        setTimeout(function() {
            fileAppNew.correctionLoadMcc();
        }, 1000);
    }, correctionLoadMcc: function() {                
        resultTextDataLoad = '';
        
        if ($("input:radio[name ='groupFile']").length > 0) {
            if ($("input:radio[name ='groupFile']:checked").val() == undefined) {
                $.mobile.loading("hide");
                showAlert('Debe de seleccionar el archivo a procesar');
                return false;
            }
        }
        
        var that = this;          
        
        fileAppNew.correctLoadFile();
        fileAppNew.correctFile();
    },
    correctLoadFile: function() {
        function verificSuccess() {
            fileSystemHelper.writeLine(fileDownName, fileAppNew.jsonVerific)
            $.mobile.loading("hide")
            //fileAppNew.loadDataFile();
            showAlert('Reinicie la Aplicación')
        }                
        function readError() {
            $.mobile.loading("hide");
        }        
        function readSuccess(text) {
            text = fileAppNew.verificValidation(text);
            fileAppNew.jsonVerific = text;
            fileSystemHelper.writeLine(fileDownName + '_bk', text);
            fileSystemHelper.deleteFile(fileDownName, verificSuccess, verificSuccess);    
        }        
        fileAppNew.jsonVerific = '';
        fileSystemHelper.readTextFromFile(fileDownName, readSuccess, readError);    
    },
    correctFile: function() {
        function verificSuccess1() {
            fileSystemHelper.writeLine(fileSelName, fileAppNew.jsonVerific1)
            $.mobile.loading("hide");
            showAlert('Reinicie la Aplicación')
            //fileAppNew.loadDataFile();
        }    
        function readError1() {
            $.mobile.loading("hide");
        } 
        function readSuccess1(text) {
            text = fileAppNew.verificValidation(text);
            fileAppNew.jsonVerific1 = text;
            fileSystemHelper.writeLine(fileSelName + '_bk', text);
            fileSystemHelper.deleteFile(fileSelName, verificSuccess1, verificSuccess1);    
        }        
        fileAppNew.jsonVerific1 = '';
        fileSystemHelper.readTextFromFile(fileSelName, readSuccess1, readError1);    
    },
    verificValidation:function(text) {
        text = text.replace(/'/g, '');            
        var posi = text.indexOf('{"uuidFile"');
        if (posi === -1) {
            //$.mobile.loading("hide");
        }else {
            var posf = text.indexOf('{"uuidFile"', posi + 11);
            if (posf != -1) {
                text = text.substr(0, posf);
            }                
        }  
        
        return text;
    },
    verificaReturn: function(value) {
        var posi = value.indexOf('{"uuidFile"');
        var posf = value.lastIndexOf('{"uuidFile"');
        fileAppNew.jsonVerific = '';

        if (posi != posf) {
            fileAppNew.jsonVerific = value.substr(0, posf);
            fileAppNew._writeTextToFile(fileDownName + 'bck', value);
            //fileSystemHelper = new FileSystemHelper();    
            /*    that._deleteFile('accessTemp');
            setTimeout(function(){
            that._writeTextToFile('accessTemp','{"us":"ADMINMCC","ps":"adminmobile"}');
            that.loadData();
            },1000);*/
            /*fileSystemHelper.deleteFile(fileDownName, me.createNewLoadBack, me._onErrorWrite);
            setTimeout(function(){
            me._writeTextToFile(fileDownName,me.jsonVerific);
            $.mobile.loading("hide")
            },4000);*/
        }
    }, createNewLoadBack:function(obj1, obj2) {
        /*alert('delete');
        var me = this;
        alert(me.jsonVerific);
        me._writeTextToFile(fileDownName,me.jsonVerific);
        $.mobile.loading("hide");*/
    },
    changeInfo:function() {
    },
    loadInfo:function() {
        $("#lblCFileMod").text(fileSelName);
        
        function readChangeInfo() {
        }
        //'fileSystemHelper.readTextFromFile(fileSelName, readSuccess1, readError1);
        //fileSystemHelper.readTextFromFile(fileDownName, readSuccess1, readError1);
    }, restoreBackUp: function() {
        function backupWrite() {
            fileSystemHelper.writeLine(fileDownName, fileAppNew.jsonVerific)
            $.mobile.loading("hide");
            showAlert('Reinicie la Aplicación')
            //fileAppNew.loadDataFile();
        }    
        function backupError() {
            showAlert('No hay archivo para restaurar')
            $.mobile.loading("hide");
        } 
        function backupSucces(text) {
            text = fileAppNew.verificValidation(text);
            fileAppNew.jsonVerific = text;
            fileSystemHelper.deleteFile(fileDownName, backupWrite, backupWrite);    
        }        
        fileAppNew.jsonVerific = '';
        fileSystemHelper.readTextFromFile(fileSelName + 'BackUp', backupSucces, backupError);    
    },
    validationClient:function(field, text) {        
        var lst = this.client.cliente;                
        var index, item, exist = false;
        
        if (text === '')
            return false;
        
        for (index = 0; index < lst.length; ++index) {
            item = lst[index];
            
            if ($.trim(item[field]) === text) {
                exist = true;
                break;
            }            
        }
        
        if (exist) {
            showAlert('El cliente ya existe con los datos de referencia ' + item.idCliente + ' - ' + item.Nombre)
        }
        return exist;
    }
}

function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};

function getCorrelCredit(item) {
    var strId = '';
    if (item.letter) {
        strId = item.idCliente + item.letter;
    }else {
        var ini = 65;
        ini = item.creditos.length + ini;
        strId = item.idCliente + String.fromCharCode(ini);
    }
    return strId;
}

function getCorrelCliente() {
    /*var ini = 65;
    ini = item.creditos.length + ini;
    return item.idCliente + String.fromCharCode(ini);*/
    var correl = '0000' + fileAppNew.client.indice;
    
    correl = correl.toString().substr(correl.length - 4, 4);
    
    return "CL" + fileAppNew.client.uuidSucursal + '1111' + correl;
}

function showAlert(text) {
    navigator.notification.alert(text,
                                 function() {
                                     //that._alertDismissed.apply(that, arguments);
                                 },
                                 'Información', 
                                 'Ok'     
        );    
}

function clearComboBox(id) {
    $('#' + id).empty();
    //$('#' + id).trigger("chosen:updated");
    /*$('#' + id)
    .find('option')
    .remove()
    .end();*/
    /*var select = document.getElementById(id);
    var length = select.options.length;
    for (i = 0; i < length; i++) {
    select.options[i] = null;
    }*/
}

function calcSum() {
    var monto = document.getElementById('txtMontoP').value;

    if ($.isNumeric(monto) && monto < 0) {
        document.getElementById('txtMontoP').value = '';  
        
        showAlert('Monto Invalido');
        return;
    }

    if (!$.isNumeric(monto)) {
        document.getElementById('txtMontoP').value = '';  
        
        showAlert('Monto Invalido');
        return;
    }
    
    x = document.getElementById("selectPorcentaje");
    if (x.value === '') {         
        showAlert('Seleccione un porcentaje Valido');
        return;
    }
    var plazo = parseFloat($(x.options[x.selectedIndex]).attr('plazo'));
    
    //var plazo = 23;
    var now = getSelDate();    
    now.setDate(now.getDate() + 1);
    
    var nowF = getSelDate();    
    nowF.setDate(nowF.getDate() + plazo);
    
    nowF.setDate(getSumDate(now, nowF));
    
    var fechai = now.getDate().toString() + '/' + (now.getMonth() + 1).toString() + '/' + now.getFullYear().toString();
    var fechaf = nowF.getDate().toString() + '/' + (nowF.getMonth() + 1).toString() + '/' + nowF.getFullYear().toString();
    
    document.getElementById('txtFI').value = fechai;  
    document.getElementById('txtFF').value = fechaf;
}

function getSelDate() {    
    var f = document.getElementById('date2').value;
    //alert(f.toString());
    var sp = f.toString().split('-');
    return new Date(sp[0], parseFloat(sp[1]) - 1, sp[2]);    
}

function getHour() {
    var d = new Date();
    var n = (d.getHours() * 100) + d.getMinutes();
    return n;
}

function setDataBonus(it) {
    //console.log('setDataBonus');
    //console.log(it);
    try {
        document.getElementById('txtUuidClient').value = it.attr('mccClientuuid');
        document.getElementById('txtUuidCredit').value = it.attr('mccCredituuid');
        
        document.getElementById('txtIdCreditoA').value = it.attr('mccIdcredit');
        document.getElementById('txtTotal').value = it.attr('mccMontoi');
        document.getElementById('txtActual').value = it.attr('mccSaldo');
        document.getElementById('txtAbono').value = it.attr('mccCuota');  
        
        $("#txtActual").attr('dataSActual', it.attr('mccSaldo'))

        fileAppNew.changeSaldoActual(it.attr('mccCuota'));
        
        var index, indexCr, indexAbono, item, itemCr, itemAb;
        var idCliente = it.attr('mccClient');
        var idCredito = it.attr('mccIdcredit');
        var lst = fileAppNew.client.cliente;
        var dCero = 0;

        for (index = 0; index < lst.length; index++) {
            item = lst[index];

            if (idCliente === item.idCliente) {
                for (indexCr = 0; indexCr < item.creditos.length; indexCr++) {
                    itemCr = item.creditos[indexCr];
                    if (itemCr.idCredito === idCredito) {
                        for (indexAbono = 0; indexAbono < itemCr.abonos.length; indexAbono++) {
                            itemAb = itemCr.abonos[indexAbono];
                            if (itemAb.m == 0) {
                                dCero += 1;
                            }
                        }            
                        break;                            
                    }                
                }
                break;
            }                
        }     
        
        $('#lblDiasCero').text(dCero);
    } catch (err) {
        showAlert("Error setDataBonus");
    }
}

function getSumDate(fI, fF) {
    var dD = 0;
    var fechaI = new Date();
    var fechaF = new Date();
    
    fechaI.setDate(fI.getDate());
    fechaF.setDate(fF.getDate() + 1);
    
    while (fechaI < fechaF) {
        if (fechaI.getDay() == 0) {
            dD += 1;
        }
        
        fechaI.setDate(fechaI.getDate() + 1);
    }
    fechaF.setDate(fF.getDate());
    if (dD > 0) {
        fechaF.setDate(fechaF.getDate() + dD);
    }
    return fechaF.getDate();
}

function hiddeLoadData() {
    $.mobile.loading("hide");
}

function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.CELL] = 'Cell generic connection';
    states[Connection.NONE] = 'No network connection';

    return states[networkState];
}

function resetFileDataMCC() {
    localStorage.setItem(fileSelName, '');
    alert('Archivo reiniciado');
}

function onValidateResumen(newValue){
    
    //validacion para evitar formatear
    if (newValue.cliente) {
        
        for(vi = 0; vi < newValue.cliente.length; vi++){
             var cl =    newValue.cliente[vi];
             if (cl.creditos) {
                 
                 for(vj = 0; vj < cl.creditos.length; vj++){
                     var cr = cl.creditos[vj];
                     if (cr.abonos && cr.abonos.length) {
                        
                        if(cr.abonos[0].f){   
                            return true;
                            break;
                            //return newValue;
                        }else{
                            return false;
                            break;
                        }
                    }
                 }
                
            }   
        }
        /*newValue.cliente.some(function(cl, i) {
            if (cl.creditos) {
                cl.creditos.some(function(cr, j) {
                    if (cr.abonos && cr.abonos.length) {
                        
                        if(cr.abonos[0].f){                            
                            return true;
                            //return newValue;
                        }else{
                            return false;
                        }
                    }
                })
            }
        })*/
    }
    
    return false;
}
function onResumeHistory(value) {
    var newValue = JSON.parse(value);
        
    $.mobile.loading("show", {
                         text: 'Transformando datos...',
                         textVisible: true,
                         theme: 'a',
                         textonly: false
                     });
        
    //for (indexCr = 0; indexCr < item.creditos.length; indexCr++) {
    var rV = onValidateResumen(newValue)
    
    //showAlert(rV);    
    if(rV){
        return JSON.stringify(newValue);
    }
    
    
    if (newValue.cliente) {
        newValue.cliente.forEach(function(cl, i) {
            if (cl.creditos) {
                cl.creditos.forEach(function(cr, j) {
                    if (cr.abonos) {
                        var newAb = [];
                            
                        cr.abonos.forEach(function(ab, h) {
                            if (ab.nuevo != 1) {
                                var abExist = false;
                                var indexAb = -1;
                                newAb.forEach(function(nAb, k) {
                                    if (nAb.fecha == ab.fecha) {
                                        abExist = true;
                                        indexAb = k;    
                                    }
                                })
                                    
                                ab.monto = parseFloat(ab.monto);
                                if (abExist && newAb[indexAb].nuevo != 1) {
                                    newAb[indexAb].monto = parseFloat(newAb[indexAb].monto) + parseFloat(ab.monto);
                                }else {                                    
                                    newAb.push(ab);    
                                }
                            }else {
                                newAb.push(ab);
                            }
                        })
                        
                        var newItAb = [];
                        newAb.forEach(function(abOld,l){
                            var abNew = {
                                "n":abOld.nuevo,
                                "m":abOld.monto,
                                "f":abOld.fecha
                            };
                            newItAb.push(abNew)
                        });
                            
                        cr.abonos = newItAb;
                    }
                })
            }
        })    
    }
        
    return JSON.stringify(newValue);
}