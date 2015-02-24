var UtilitiesView = Backbone.View.extend({
	//el: '#landing',
	template:_.template($('#tpl-utility-details').html()),
	initialize: function(){
	},
	events:{
		"click #startSurvey":"startSurvey",
		"click #deleteLocal":"deleteLocal",
		"click #saveLocal":"saveLocal",
		"click #saveLocalSD":"saveLocalSD",
		"click #showLocalSD":"showLocalSD",
		"click #submitLocal":"submitLocal",
		"click #submitLocalSD":"submitLocalSD",
		"click #showGPS":"getGPS",
		"click #showCamera":"app.getCamera",
	},
    	startSurvey: function(){
		this.cleanup();
		headerView = new HeaderView;
		$("#home").show();
		footerView = new FooterView;
	     	var questionList = new QuestionList();
		answerList = new AnswerList();
		var answerCreate = answerList.create({qcount: 1, timestamp: SESSIONID}, {
			success: function(response){
				var answer = answerList.get(response.id);
				answerListView = new AnswerListView({model: answer });
				answerListView.endquestion = MAXQUESTION;
			},
		    	error: function(model, response){
				console.log(response.responseText);
				console.log(response.status);
				console.log(response.statusText);
			}
		});
     	},
	showContact: function(){
		headerView = new HeaderView;
		contactView = new ContactView;
	},
  	getGPS: function(){
		alert("getGPS");
    		navigator.geolocation.getCurrentPosition(app.getGPSOnSuccess, app.getGPSOnFailure);
  	},
  	getGPSOnSuccess: function(position){
    		window.localStorage.setItem("current-latitude", position.coords.latitude);	
    		window.localStorage.setItem("current-longitude", position.coords.longitude);	
  	},
  	getGPSOnFailure: function(error){
		alert("code: "+ error.code);
		alert("message: "+ error.message);
  	},
	deleteLocal: function(){
	    	alert("deleteLocal");
	    	window.localStorage.clear();
	    	alert("Check: " + window.localStorage.getItem("sensor-keys"));
     	},
	saveLocal: function(){
    		alert("saveLocal");
    		var prevStorage = window.localStorage.getItem("fcs-keys");
    		var latitude = window.localStorage.getItem("current-latitude");
    		var longitude = window.localStorage.getItem("current-longitude");
    		if (prevStorage != null){
    			window.localStorage.setItem("fcs-keys", ""+ prevStorage +",fcs-keys-"+ SESSIONID +"-1,fcs-keys-"+ SESSIONID +"-2");
    		} else {
    			window.localStorage.setItem("fcs-keys","fcs-keys-"+ SESSIONID +"-1,fcs-keys-"+ SESSIONID +"-2");
    		} 
    		window.localStorage.setItem('fcs-keys-'+ SESSIONID +'-1', '{"id":"1","time":"14:34:56","ph":"4.5","orp":"234","do":"4.7","ec":"211μs","temp":"89","color":"4.5","lat":"'+latitude+'","lon":"'+longitude+'"}');
    		window.localStorage.setItem('fcs-keys-'+ SESSIONID +'-2', '{"id":"2","time":"09:03:23","ph":"3.0","orp":"450","do":"5.9","ec":"123μs","temp":"85","color":"2.1","lat":"'+latitude+'","lon":"'+longitude+'"}');
    		var currentStorage = window.localStorage.getItem("fcs-keys");
    		alert("Test pull on fcs-keys: "+ currentStorage);
  	},
	saveLocalSD: function(){
    		alert("saveLocalSD");
		headerView = new HeaderView;
		storageView = new StorageView;
  	},
	showLocalSD: function(){
    		alert("showLocalSD");
		headerView = new HeaderView;
		storageListView = new StorageListView;
  	},
	submitData: function(){
		alert("submitData");
    		var fileURL = "file:///storage/sdcard0/org.sccwrp.fcs/survey.txt";
    		function win(r){
	    		alert(r);
            		alert("Code = " + r.responseCode);
            		alert("Response = " + r.response);
            		alert("Sent = " + r.bytesSent);
    		}
    		function fail(error){
    			alert("An error has occurred: Code = " + error.code);
    			alert("upload error source " + error.source);
    			alert("upload error target " + error.target);
    		}

    		var uri = encodeURI("http://data.sccwrp.org/fcs/upload.php");

    		var options = new FileUploadOptions();
    		options.fileKey = "file";
    		options.fileName = fileURL.substr(fileURL.lastIndexOf('/')+1);
    		options.mimeType = "text/plain";
		
    		var headers={'headerParam':'headerValue'};
    		options.headers = headers;

    		var ft = new FileTransfer();
    		ft.onprogress = function(progressEvent){
		  if (progressEvent.lengthComputable) {
			var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
			var tmp_content =  perc + "% Loaded";
			app.showContent(tmp_content);
		  } else {
			if($("#log").innerHTML == "") {
				app.showContent("Loading");
			} else {
				app.showContent(".");
			}
		  }
    		}
    		ft.upload(fileURL, uri, win, fail, options);
    	},
	cleanup: function() {
		//console.log("IntroView cleanup");
	        this.undelegateEvents();
	        this.$el.removeData().unbind();
	        Backbone.View.prototype.remove.call(this);
	},
	render: function(){
		//console.log("introview render");
		/* clear the interface */
		$("#header").hide();
		//$("#landing").show();
		$(this.el).html(this.template());	
		$("#footer").hide();
		////console.log(jQuery("html").html());
		// code below is for devices taking too long to render
		// its ugly but it works
		if(isDevice){
		setTimeout(function() {
			$('#landList').listview();
			$('#landList').listview('refresh');
		}, 0);
		} else {
			$('#landList').listview();
			$('#landList').listview('refresh');
		}
		return this;
	}
});
