document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
		AppDownload = new downloadApp(),
		fileName = fileDownName,
		uri = null,
		folderName = "DownLoadMcc";
    //uri = encodeURI("http://www.telerik.com/sfimages/default-source/logos/app_builder.png"),
	//navigator.splashscreen.hide();
	AppDownload.run(uri, fileName, folderName);
}

function downloadApp() {
}

downloadApp.prototype = {
	run: function(uri, fileName, folderName) {
		/*var that = this,
	    filePath = "";*/
        
        //alert('run1');
        
		/*$("#newDownload").click(function() {
            
			that.getFilesystem(
				function(fileSystem) {
					console.log("gotFS");
                        alert(device.platform);    
					if (device.platform === "Android") {
						that.getFolder(fileSystem, folderName, function(folder) {
							filePath = folder.toURL() + "\/" + fileName;
                            //alert(uri);
                            uri = folder.toURL().toString().replace('test/','') + 'dataMccLoad';
                            //alert(uri);
							that.transferFile(uri, filePath)
						}, function() {
							console.log("failed to get folder");
						});
					} else {
						var filePath;
						var urlPath = fileSystem.root.toURL();
						if (device.platform == "Win32NT") {
							urlPath = fileSystem.root.fullPath;
						}
						if (parseFloat(device.cordova) <= 3.2) {
							filePath = urlPath.substring(urlPath.indexOf("/var")) + "\/" + fileName;
						} else {
							filePath = urlPath + "\/" + fileName;
						}
						that.transferFile(uri, filePath)
					}
				},
				function() {
					console.log("failed to get filesystem");
				}
				);
		});*/
		
		//document.getElementById("upload").addEventListener("click", that.uploadFile);
	},
    downLoadNew:function(data,fileNameNew,uri){
      
        var that = this,
	    filePath = "";
        //var fileNameNew = uri.substr(uri.lastIndexOf('shorturl')+9)
        //alert('down');                                   
        
                    function newData(){                        
                        data = data.replace(/'/g, '"');
                        //alert('write new data');
                        //alert(data.substr(0,100));
                        fileSystemHelper.writeLine(fileNameNew, data);
                    }
        
                    function scsNew(){
                        //alert('new text');
                        //alert('new file ' + fileNameNew);
                        
                        var it= {"files":[
                                {"name":fileSelName},                                    
                                {"name":fileNameNew}                                    
                                ]}
                        
                        fileSystemHelper.writeLine('dataMccFile', JSON.stringify(it), newData);    
                    }
                    function scsRead(text){
                        //alert(text)
                        
                        function scsDelete(){
                            var it= '';
                            it = JSON.parse(text)
                            
                            it.files.push({"name":fileNameNew});
                            
                            fileSystemHelper.writeLine('dataMccFile', JSON.stringify(it),newData);    
                        }
                        
                        fileSystemHelper.deleteFile('dataMccFile',scsDelete);
                    }
                    
                    fileSystemHelper.readTextFromFile('dataMccFile', scsRead, scsNew);    
            		
                    $.mobile.loading("show", {
                            html: "Se agrego el nuevo archivo: " + fileNameNew + ' Reinicie la Aplicación <br/><button data-iconpos="notext" role="button" data-role="button" onclick="hiddeLoadData()" class="ui-link ui-btn ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-inline ui-shadow ui-corner-all" data-inline="true" data-icon="delete">Hide</button>',
                            text: 'Datos',
                            textVisible: true,
                            theme: 'b',
                            textonly: false
                        });
                    
        
        /*that.getFilesystem(
				function(fileSystem) {
					console.log("gotFS");
                        //alert(device.platform);    
					if (device.platform === "Android") {
						that.getFolder(fileSystem, folderName, function(folder) {
							filePath = folder.toURL() + "\/";
                            //alert(uri);
                            filePath = folder.toURL().toString().replace('DownLoadMcc/','') + fileNameNew;
                            //alert(uri);
							that.transferFile("http://www.filedropper.com/" + fileNameNew, filePath)
						}, function() {
							console.log("failed to get folder");
						});
					} else {
						var filePath;
						var urlPath = fileSystem.root.toURL();
						if (device.platform == "Win32NT") {
							urlPath = fileSystem.root.fullPath;
						}
						if (parseFloat(device.cordova) <= 3.2) {
							filePath = urlPath.substring(urlPath.indexOf("/var")) + "\/" + fileNameNew;
						} else {
							filePath = urlPath + "\/" + fileNameNew;
						}
						that.transferFile("http://www.filedropper.com/" + fileNameNew, filePath)
					}
                    
                    function scsNew(){
                        //alert('new text');
                        //alert('new file ' + fileNameNew);
                        
                        var it= {"files":[
                                {"name":fileSelName},                                    
                                {"name":fileNameNew}                                    
                                ]}
                        
                        fileSystemHelper.writeLine('dataMccFile', JSON.stringify(it));    
                    }
                    function scsRead(text){
                        //alert(text)
                        
                        function scsDelete(){
                            var it= '';
                            it = JSON.parse(text)
                            
                            it.files.push({"name":fileNameNew});
                            
                            fileSystemHelper.writeLine('dataMccFile', JSON.stringify(it));    
                        }
                        
                        fileSystemHelper.deleteFile('dataMccFile',scsDelete);
                    }
                    
                    fileSystemHelper.readTextFromFile('dataMccFile', scsRead, scsNew);    
            		
                    $.mobile.loading("show", {
                            html: "Se agrego el nuevo archivo: " + fileNameNew + ' Reinicie la Aplicación <br/><button data-iconpos="notext" role="button" data-role="button" onclick="hiddeLoadData()" class="ui-link ui-btn ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-inline ui-shadow ui-corner-all" data-inline="true" data-icon="delete">Hide</button>',
                            text: 'Datos',
                            textVisible: true,
                            theme: 'b',
                            textonly: false
                        });
                    
				},
				function() {
					console.log("failed to get filesystem");
				}
        );*/
        
        
    },
    getDownload:function(){
        var that = this,
	    filePath = "";
        //alert('down');
        that.getFilesystem(
				function(fileSystem) {
					console.log("gotFS");
                        //alert(device.platform);    
					if (device.platform === "Android") {
						that.getFolder(fileSystem, folderName, function(folder) {
							filePath = folder.toURL() + "\/" + fileName;
                            //alert('1' + filePath);
                            uri = folder.toURL().toString().replace('DownLoadMcc/','') + fileDownName;
                            alert(uri);
							that.transferFile(uri, filePath)
						}, function() {
							console.log("failed to get folder");
						});
					} else {
						var filePath;
						var urlPath = fileSystem.root.toURL();
						if (device.platform == "Win32NT") {
							urlPath = fileSystem.root.fullPath;
						}
						if (parseFloat(device.cordova) <= 3.2) {
							filePath = urlPath.substring(urlPath.indexOf("/var")) + "\/" + fileDownName;
						} else {
							filePath = urlPath + "\/" + fileDownName;
						}
                        //alert('2' + filePath);
						that.transferFile(uri, filePath)
					}
				},
				function() {
					console.log("failed to get filesystem");
				}
        );
        
    },
	getFilesystem:function (success, fail) {
		window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, success, fail);
	},

	getFolder: function (fileSystem, folderName, success, fail) {
		fileSystem.root.getDirectory(folderName, {create: true, exclusive: false}, success, fail)
	},

	transferFile: function (uri, filePath) {
		var transfer = new FileTransfer();
		transfer.download(
			uri,
			filePath,
			function(entry) {
				var targetPath = entry.toURL();
				if (device.platform == "Win32NT") {
					targetPath = entry.fullPath;
				}
				/*var image = document.getElementById("downloadedImage");
				image.src = targetPath;
				image.style.display = "block";
				image.display = targetPath;
				document.getElementById("result").innerHTML = "File saved to: " + targetPath;*/
			},
			function(error) {
				document.getElementById("result").innerHTML = "An error has occurred: Code = " + error.code;
				console.log("download error source " + error.source);
				console.log("download error target " + error.target);
				console.log("upload error code" + error.code);
			}
			);
	},
	
	uploadFile: function() {
		/*navigator.camera.getPicture(
			uploadPhoto,
			function(message) {
				alert('Failed to get a picture');
			}, {
				quality         : 50,
				destinationType : navigator.camera.DestinationType.FILE_URI,
				sourceType      : navigator.camera.PictureSourceType.PHOTOLIBRARY
			});*/
		
		//function uploadPhoto(fileURI) {
        //alert('uploadFile');
        var that = this;
        var fileURI = "";
        //alert('down');
        that.getFilesystem(
				function(fileSystem) {
					if (device.platform === "Android") {
						that.getFolder(fileSystem, folderName, function(folder) {
							//filePath = folder.toURL() + "\/" + fileName;
                            //alert(uri);
                            uri = folder.toURL().toString().replace('DownLoadMcc/','');
                            //alert(uri);
							//that.transferFile(uri, filePath)
                            fileURI = uri;
						}, function() {
							console.log("failed to get folder");
						});
					} else {
						var filePath;
						var urlPath = fileSystem.root.toURL();
						if (device.platform == "Win32NT") {
							urlPath = fileSystem.root.fullPath;
						}
						if (parseFloat(device.cordova) <= 3.2) {
							filePath = urlPath.substring(urlPath.indexOf("/var")) + "\/";
						} else {
							filePath = urlPath + "\/"
						}
                        
                        fileURI = filePath;
						//that.transferFile(uri, filePath)
					}
				},
				function() {
					console.log("failed to get filesystem");
				}
        );
        
        fileURI = fileURI + fileSelName;        
        alert('file upload ' + fileURI);
			var options = new FileUploadOptions();
			options.fileKey = "file";
			options.fileName = fileSelName; //fileURI.substr(fileURI.lastIndexOf('/') + 1);
			
			/*if (cordova.platformId == "android") {
				options.fileName += ".jpg" 
			}*/
			
			//options.mimeType = "image/jpeg";
			options.params = {}; // if we need to send parameters to the server request 
			options.headers = {
				Connection: "Close"
			};
			options.chunkedMode = false;
            
			var ft = new FileTransfer();
			ft.upload(
				fileURI,
				encodeURI("http://www.filedropper.com"),
				onFileUploadSuccess,
				onFileTransferFail,
				options);
		
			function onFileUploadSuccess (result) {
                alert("Link to uploaded file: http://www.filedropper.com" + result.response)
                
                //fileURI = result.response;
                
                var parametro = { tipo: 'addResponse', key: $("#keyDevice").text(), data: '', url: result.response};
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: "http://appmcc.websolutions.com.gt/device.ashx",
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
                alert(result.response);
				/*console.log("FileTransfer.upload");
				console.log("Code = " + result.responseCode);
				console.log("Response = " + result.response);
				console.log("Sent = " + result.bytesSent);
				console.log("Link to uploaded file: http://www.filedropper.com" + result.response);
				var response = result.response;
				var destination = "http://www.filedropper.com/" + response.substr(response.lastIndexOf('=') + 1);
				document.getElementById("result").innerHTML = "File uploaded to: " + 
															  destination + 
															  "</br><button onclick=\"window.open('" + destination + "', '_blank', 'location=yes')\">Open Location</button>";
				document.getElementById("downloadedImage").style.display="none";*/
			}
        
			function onFileTransferFail (error) {
                alert('error');
				/*console.log("FileTransfer Error:");
				console.log("Code: " + error.code);
				console.log("Source: " + error.source);
				console.log("Target: " + error.target);*/
			}
        
        return fileUri;
		//}
	}
}
