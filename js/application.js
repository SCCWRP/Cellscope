var appRouter = new (Backbone.Router.extend({
  routes: {
    "sensor/receipt/:appid": "receipt",
    "sensor/": "start",
    "": "start"
  },
  css: function(){
	     //console.log("css");
	     $('#one').trigger('pagecreate');
	     $('html,body').animate({ scrollTop: '0px'}, 0);
	     appRouter.resizePage();
	     var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
	    if(deviceType == "iPhone"){
			$('.ui-title').css('font-size','2em');
			$('#multi-view .ui-btn-text').css('font-size','18px');
			$('#multi-view').css('margin-left','15%');
			$('#multi-select').css('margin-left','5%');
			$('#multi-select h3').css('font-size','18px');
			$('#multi-select select').css('font-size','18px');
			$('#multi-select-time').css('margin-left','-3%');
	    }
	    //$(window).scroll(appRouter.positionFooter).resize(appRouter.positionFooter); - issues with iphone
  },
  dirty: function(){
        var dirtyKeys = window.localStorage.getItem("http://data.sccwrp.org/sensor/index.php/surveys_dirty");
        if (dirtyKeys != null){
		answerList = new AnswerList();
		var servicesSync = answerList.fetch({ 
        	  success: function (response) {
			app.showContent(response);
	        	answerList.syncDirtyAndDestroyed();    
	          },
	    	  error: function(model,response){
			app.showContent(response.responseText);
			app.showContent(response.status);
			app.showContent(response.statusText);
		  }

        	});
	}
  },
  resizePage: function(){
	/* in the beta version this functin was used with unique form element names
	   in full study all (maybe) form elements derive from .ui-field-contain */
/* this isnt perfect but seems to work - going to need more work to get exact */ 
	// total size of form element and amount of space from top
	var formSize = Math.round($('#content').offset().top+$('#content').height());
	//var formSize = Math.round($('.ui-field-contain').offset().top+$('.ui-field-contain').height());
	//console.log("formSize: "+ formSize);
	// size of page minus footer - changed from one to content for full study
	var stageSize = Math.round($('#one').height()-$('#footer').height());
	//console.log("stageSize: "+ stageSize);
	// total size of form element with some padding
	var minHeight = "" + (formSize + 400) + "px";
	//console.log("minHeight: "+ minHeight);
	// get consent if set
	//var consentSize = Math.round($('#consent').height());
	//console.log("consentSize: "+consentSize);
	// current size of entire page
	var oneHeight = (formSize > stageSize) ? minHeight:("" + Math.round($('#one').height()) + "px");
	//console.log("multi-select: "+ $('#multi-select').height());
	if($('#consent').height() == 0){
		//console.log("consent");
		//console.log("consent: "+$('#consent').height());
		$('#one').css('height',6100);
		//console.log("one: "+$('#one').height());
	} else {
		if(($('#consent').height() > 0) && (screen.width <= 1024)){
			$('#one').css('height',6500);
		} else {
			$('#one').css('height',oneHeight);
		}
	}
	if($('#multi-select').height()){
		var multiHeight = ($('#multi-select').height()+500+"px");
		$('#one').css('height',multiHeight);
	}
	if($('#multi-view').height()){
		var multiHeight = ($('#multi-view').height()+500+"px");
		$('#one').css('height',multiHeight);
	}
	//console.log("oneHeight: "+oneHeight);
  },
  positionFooter: function(){
	//console.log("positionFooter");
	$footer = $("#footer");
	footerHeight = $footer.height();
	var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
	if (deviceType != "iPhone") { 
		$('#footer').css('visibility','visible');
		$('#footer').css('font-size','10px');
	}
	var drop = (deviceType == "iPhone") ? /*-59*/3:3;
	//console.log("window scrolltop: "+ $(window).scrollTop());
	//console.log("window height: "+ $(window).height());
	//footerTop = ($(window).scrollTop()+$(window).height()-footerHeight)-drop+"px";       
	$footer.css({
		position: "fixed",
		bottom: 0,
		left:0,
		right:0
	});
  },
  question: function(){
	questionList = new QuestionList();
        questionList.fetch({ success: function(response){ /*console.log("questionList fetch - success");*/ questionList.getQuestion(); } });
  },
  start: function(){
	$("#content").html( new IntroView().render().el );
	appRouter.question();
	$("#landList").css("height", window.innerHeight);
  }
}));
var app = {
  dialog: function(message,title,button){
	function dialogCallback(){
		//custom_alert("dialogCallback closed");
	}
	if(isDevice == true){
		navigator.notification.alert(message, dialogCallback, title, button)	
	} else {
		alert(message);
	}
  },
  // file writing f=file,s=string
  fileAppend: function(f) {
    	//alert("fileAppend");
        //alert("f.fullPath: "+f.fullPath);
	f.createWriter(function(writerOb) {
		writerOb.onwrite=function() {
	        	app.showContent("Done writing to file.<p/>");
		}
		//go to the end of the file...
		writerOb.seek(writerOb.length);
		//writerOb.write("Test at "+new Date().toString() + "\n");
		var localSave = app.getLocalData("local","save");
	        	writerOb.write(localSave);
			//alert("successfully wrote");
    		})
  },
  getLocalData: function(a,t){
     		//alert("a: "+a);
     		//alert("t: "+t);
     		var localSave;
     		//var prevStorage = window.localStorage.getItem("sensor-keys");
     		var prevStorage = window.localStorage.getItem("http://data.sccwrp.org/sensor/index.php/surveys");
      		//alert("prevStorage: "+prevStorage); 
     		if (prevStorage != null){
	     		//alert("The following session keys are saved " + prevStorage);
	     		var keysArray = prevStorage.split(',');
	     		//var connectionStatus = navigator.onLine ? 'online' : 'offline';
	     		//if(connectionStatus != "offline") {
	     		var currentKey; // currentKey = sessionid
	     		var loopNum=keysArray.length;
	     		//alert("Should loop " + loopNum + " times");
	     		for(var i=0; i<loopNum; i++){
		     		//alert("Loop number " +  i + "");
		     		currentKey = keysArray.pop();
		     		//alert("currentKey: "+currentKey);
		     		//currentTime = currentKey.split('-');
		     		//alert("currentTimestamp: "+currentTime[2]);
		     		//var read =  window.localStorage.getItem(currentKey);
		     		//var read =  JSON.parse(window.localStorage.getItem("http://data.sccwrp.org/sensor/index.php/surveys" + currentKey));
		     		var read =  window.localStorage.getItem("http://data.sccwrp.org/sensor/index.php/surveys" + currentKey);
				//var readString = '{"record" : [' + read + ']}';
				//alert("read: "+ read.timestamp);
				//alert("read: "+ readString);
		     		if(a=="local"){
					//localSave += readString;	
					localSave += read;	
		     		}
		     		//alert("Read Session: "+ read);
		     		if(a=="remote"){
					//alert("read: "+read);
		     			app.submitRemote(read,currentTime[2]);
		     		}
			     	//to_submit = read.split(',');
			     	//n = oldKey.split('_')[1];
	     		} // close for
	     		if(a=="local"){
   				//alert("a Save: ");
				return localSave;
	     		}
		}
  },
  saveLocalData: function(m){
  	function fileAppend(fs){
    		fs.createWriter(function(fileWriter) {
			fileWriter.onwrite = function(evt) {
			    alert("End Survey");
			    appRouter.navigate('/', {trigger: false});
			    location.assign(HOME);
		        };
			//go to the end of the file...
			fileWriter.seek(fileWriter.length);
			var blob = new Blob([m], {type: "text/plain"});
			fileWriter.write(blob);
    		}, app.onError);
        }
	//directoryLocation.getFile("survey.txt", {create:true}, fileAppend, app.onError);
	directoryLocation.getFile(timestampFile, {create:true}, fileAppend, app.onError);
  },
  dataSyncCheck: function(da,dc,dt){
	// send autoid and captureid to see if record is in remote database
	//alert("dataSyncCheck autoid: "+ da);
	//alert("dataSyncCheck captureid: "+ dc);
	//alert("dataSyncCheck timestamp: "+ dt);
	// if the record is in database remove local record
	//alert("dataSyncCheck");
        var url = 'http://data.sccwrp.org/sensor/check.php';
        message = $.ajax({
                type: 'GET',
                url: url,
                contentType: "application/json",
                dataType: 'jsonp',
                data: {aa: da,cc: dc,tt: dt},
                crossDomain: true,
                timeout: 4000,
                error: function(x,t,m){
                         if(t==="timeout"){ alert("dataSyncCheck not Submitted"); }
                },
                success: function(data) {
			// first delete value
			var currentRecord = "sensor-keys-"+ dt +"-"+ dc;
			//alert("Value to Delete: "+ currentRecord);
        		window.localStorage.removeItem(currentRecord);
			// second delete key from ring	
        		var prevStorage = window.localStorage.getItem("sensor-keys");
			// not a good idea - remove current key ring
       			//window.localStorage.removeItem("sensor-keys");
        		if (prevStorage != null){
	     			//alert("Get Key Ring: " + prevStorage);
				// split key ring string into array
	     			var keysArray = prevStorage.split(',');
				//alert("keysArray.length: "+ keysArray.length);
				// find key we want to delete
				var keyFind = keysArray.indexOf(currentRecord);
				if(keyFind != -1){
					//alert("Key to Delete: "+ keyFind);
					// remove key from ring
					keysArray.splice(keyFind, 1);
					if(keysArray.length == 0){
						//alert("keysArray is empty: "+ keysArray.length);
     						window.localStorage.removeItem("sensor-keys");
					} else {
						var newRing = keysArray.join();
						window.localStorage.setItem("sensor-keys", newRing);
					}
				} 
			}
                },
                complete: function(data) {
                        //alert("complete:"+data.key);
                }
        });
  },
  getCamera: function(callback,t){
	var imgUrl;
	function movePicture(picture){
		var currentDate = new Date();
		var currentTime = currentDate.getTime();
		var fileName = currentTime + ".jpg";
		var baseUrl = "http://data.sccwrp.org/sensor/files/";
		var completeUrl = baseUrl + fileName;
		t.set({ picture_url: completeUrl });
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
			fileSystem = fs;
			fileSystem.root.getDirectory('org.sccwrp.sensor', {create: true},
			function(dirEntry) {
				picture.moveTo(dirEntry, fileName, onSuccessMove, app.onError);
			}, app.onError);
		}, app.onError);
		callback(fileName);
	}
	function findPictureLocation(file){
		window.resolveLocalFileSystemURI(file, movePicture, app.onError);
	}
    	function onSuccessMove(f){
		alert("Successfully saved picture.");
		savedPicture = true;
		app.showContent(f);
     	}
    	function onSuccess(imageURI){
		var returnFile = findPictureLocation(imageURI);
     	}
       	function onFail(message){
       		callback("failed: "+ message);
        }
	// ios bug
     	//navigator.camera.getPicture(onSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI });
     	navigator.camera.getPicture(onSuccess, onFail, { quality: 10, destinationType: Camera.DestinationType.DATA_URI });
  },
  getGPSOnSuccess: function(position){
	latlon = position.coords.latitude + "," + position.coords.longitude
  },
  getGPSOnFailure: function(error){
	latlon = "failed";
  },
  getId: function(id) {
    return document.querySelector(id);
  },
  showContent: function(s,t) {
    if(t){	
       	$("#log").append(s);
    } else {
    	$("#log").html(s);
    }	
  },
  onFSSuccess: function(fs){
	fileSystem = fs;
	fileSystem.root.getDirectory('org.sccwrp.sensor', {create: true},
		function(dirEntry) {
			directoryLocation = dirEntry;
			timestampFile = ""+SESSIONID+".txt";
			dirEntry.getFile(timestampFile, {create:true}, 
				function(f) {
		         		app.showContent("directory and timestamp file created");
				}, app.onError);
		}, app.onError);
  },
  getById: function(id){
	return document.querySelector(id);
  },
  onError: function(e){
	var msg = '';
    	switch (e.code) {
          case FileError.QUOTA_EXCEEDED_ERR:
		msg = 'QUOTA_EXCEEDED_ERR';
          break;
          case FileError.NOT_FOUND_ERR:
		msg = 'NOT_FOUND_ERR';
	  break;
	  case FileError.SECURITY_ERR:
	      msg = 'SECURITY_ERR';
	  break;
	  case FileError.INVALID_MODIFICATION_ERR:
	      msg = 'INVALID_MODIFICATION_ERR';
	  break;
	  case FileError.INVALID_STATE_ERR:
	      msg = 'INVALID_STATE_ERR';
	  break;
	  default:
	      msg = 'Unknown Error';
	  break;
	};
      	alert('Error: ' + msg);
  },
  submitRemote: function(s,t){
	var url = 'http://data.sccwrp.org/sensor/load.php';
	message = $.ajax({
		type: 'GET',
		url: url,
		contentType: "application/json",
		dataType: 'jsonp',
		data: {ss: s,tt: t},
		crossDomain: true,
		timeout: 4000,
		error: function(x,t,m){ 
			 if(t==="timeout"){ alert("Data not Submitted"); }
		}, 
		success: function(data) {
			//alert("status:"+data.submit);
			//alert("autoid:"+data.autoid);
			//alert("captureid:"+data.captureid);
			//alert("apptime:"+data.capturetime);
			app.dataSyncCheck(data.autoid,data.captureid,data.apptime);
		},
		complete: function(data) {
			//alert("complete:"+data.key);
	        }
    	});
  },
  uploadFile: function(e) {
	//alert("uploadFile to SCCWRP");
	//var fileURL = "file://storage/sdcard0/test.txt"; old
	//var fileURL = "cdvfile://localhost/persistent/test.txt"; new 
	var dirURL = "cdvfile://localhost/persistent/org.sccwrp.sensor/";
	//var fileURL = "cdvfile://localhost/persistent/test.txt";
	var fileURL = e.fullPath;
	//alert("fileURL: "+fileURL);
    	function win(r){
        	//app.showContent("Code = " + r.responseCode);
            	//app.showContent("Response = " + r.response);
	        //app.showContent("Sent = " + r.bytesSent);
	}
        function fail(error){
		app.showContent("An error has occurred: Code = " + error.code);
	    	app.showContent("upload error source " + error.source);
	   	app.showContent("upload error target " + error.target);
	}
	var uri = encodeURI("http://data.sccwrp.org/sensor/upload.php");

    	var options = new FileUploadOptions();
        options.fileKey = "file";
	options.fileName = fileURL.substr(fileURL.lastIndexOf('/')+1);
        options.mimeType = "image/jpeg";
	options.chunkedMode = false;
	//var headers={'headerParam':'headerValue'};
	//options.headers = headers;
	options.headers = {
		Connection: "close"
	};

	var ft = new FileTransfer();
	ft.onprogress = function(progressEvent){
		if(progressEvent.lengthComputable){
			  //loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
			  var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
			  app.showContent("Uploading file: "+ perc + "% loaded...");
	  	} else {
			  //loadingStatus.increment();
	 	}
	}
	finalURL = dirURL + options.fileName;
	ft.upload(finalURL, uri, win, fail, options);
  },
  onDeviceReady: function(){
	if(isDevice){
		latlon = navigator.geolocation.getCurrentPosition(app.getGPSOnSuccess, app.getGPSOnFailure);
	}
	//window.requestFileSystem(window.TEMPORARY, 5*1024*1024 /*5MB*/, app.onFSSuccess, app.onError); // using chrome if mobile see below
 	// jquery cors support for phonega
	/*
	$.support.cors = true;
	$.mobile.allowCrossDomainPages = true;
	*/
	// disable jquery mobile routing
	$.support.cors = true;
	$.mobile.ajaxEnabled = false;
	$.mobile.linkBindingEnabled = false;
	$.mobile.hashListeningEnabled = false;
	$.mobile.pushStateEnabled = false;
	//app.bindEvents();
	Backbone.history.start({pushState: true, hashChange: false});
	// check network status
 	networkStatus = navigator.onLine ? 'online' : 'offline';
	FastClick.attach(document.body);
	appRouter.start();
  },
  initialize: function(){
	if(document.URL.indexOf("http://") === -1 && document.URL.indexOf("https://") === -1){
		isDevice = true;
	}
	if( isDevice ){
    		document.addEventListener("deviceready", function(){
			//alert("isDevice deviceready");
			app.onDeviceReady();
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, app.onFSSuccess, app.onError); // mobile only
			//latlon = navigator.geolocation.getCurrentPosition(app.getGPSOnSuccess, app.getGPSOnFailure);
			//var fieldDevices = ['abae1013824c8333','ebd56c30eef8e2eb','9ec53f2ff0b4a575','b57e96cae7cba8c2','718dfae3b57d403d','a34121f5cc60376d','4960b272250be85f','f85e8f96c2ae66f5','ee4c43311b41d6bf','33c9a697c1271b28'];
			//if(fieldDevices.indexOf(device.uuid) != -1){
				//alert("Field unit: "+ fieldDevices.indexOf(device.uuid));
			//	fieldDevice = (fieldDevices.indexOf(device.uuid)+1);
			//}
		},true);
	} else {
		app.onDeviceReady();
	}
  }
};
app.initialize();
