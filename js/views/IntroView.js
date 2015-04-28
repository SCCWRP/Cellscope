var IntroView = Backbone.View.extend({
	//el: '#landing',
	template:_.template($('#tpl-intro-details').html()),
	initialize: function(){
	},
	events:{
		"click #startSurvey":"startSurvey",
		"click #submitData":"submitData",
		"click #getUtilities":"getUtilities"
	},
    	getUtilities: function(){
		$("#content").html( new UtilitiesView().render().el );
     	},
    	startSurvey: function(){
  		var prevStorage = window.localStorage.getItem("http://data.sccwrp.org/sensor/index.php/surveys");
		if(prevStorage){
			/* get last key */
			// turn string into array
			var prevArray = prevStorage.split(',');
			var locateLastKey = prevArray[prevArray.length-1];
			/* turn last key into object */
     			var lastKey = JSON.parse(window.localStorage.getItem("http://data.sccwrp.org/sensor/index.php/surveys" + locateLastKey));
			/* is current key null */
			//alert("lastKey.sensor_id: "+lastKey.sensor_id);
			if(lastKey.sensor_id){
				if(isDevice){
					/* get the id number from end of sensor_id and auto increment */
					var prevKeyArray = lastKey.sensor_id.split('-');
					var prevKeyCount = (Number(prevKeyArray[1]) + 1);
					var sensorID = prevKeyArray[0] + "-" + prevKeyCount;
				} else {
					var sensorID = SESSIONID + "-1";
				}
			} else {
				//alert("no sensor_id key");
			}
		} else {
			/* first time data is stored locally */
			if(isDevice){
				//var sensorID = device.uuid + "-1";
				var sensorID = fieldDevice + "-1";
			} else {
				var sensorID = SESSIONID + "-1";
			}
		}
		//alert(sensorID);
		this.cleanup();
		headerView = new HeaderView;
		$("#home").show();
		footerView = new FooterView;
		/* set version */
		var deviceType = navigator.userAgent + "-v.0.0.1";
		/* get last id */
	     	var questionList = new QuestionList();
		answerList = new AnswerList();
		var answerCreate = answerList.create({qcount: 1, timestamp: SESSIONID, picture_url: null, device_type: deviceType, sensor_id: sensorID, coordinates: latlon}, {
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
	submitData: function(){
		$(this.el).html("");
		$("#header").show();
		$("#header").html('<a href="./index.html" id="home" data-role="button" class="ui-btn ui-icon-home">Home</a>');
		$("#home").show();
		/* synchronize local browser storage records */
		appRouter.dirty();
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs){
			fs.root.getDirectory('org.sccwrp.sensor', {}, function(dirEntry){
				var dirReader = dirEntry.createReader();
				dirReader.readEntries(function(entries){
				  for(var i = 0; i < entries.length; i++){
					var entry = entries[i];
					if(entry.isFile){
						uploadFile(entry);
					}
				  }
				alert("Finished uploading to SCCWRP");
				}, app.onError);
			}, app.onError);
		}, app.onError);
		function uploadFile(f){
			var dirURL = "cdvfile://localhost/persistent/org.sccwrp.sensor/";
			var fileURL = f.fullPath;
		    	function win(r){
				app.showContent("file uploaded - "+f.name,true);
		    	}
		    	function fail(error){
				app.showContent("An error has occurred: Code = " + error.code,true);
			        app.showContent("upload error source " + error.source,true);
				app.showContent("upload error target " + error.target,true);
		     	}
		    	var uri = encodeURI("http://data.sccwrp.org/sensor/upload.php");
		    	var options = new FileUploadOptions();
		    	options.fileKey = "file";
		    	options.fileName = fileURL.substr(fileURL.lastIndexOf('/')+1);
		    	options.mimeType = "image/jpeg";
			
			var headers={'headerParam':'headerValue'};
		    	options.headers = headers;

			var ft = new FileTransfer();
			ft.onprogress = function(progressEvent){
				if (progressEvent.lengthComputable) {
					var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
					app.showContent("uploading file: "+ perc + "% loaded...",true);
				} else {
				}
			}
			finalURL = dirURL + options.fileName;
			ft.upload(finalURL, uri, win, fail, options);
		}
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
