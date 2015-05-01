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
		var deviceType = navigator.userAgent + "-sensor-v1.0.0";
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
				app.showContent("Error: "+response.responseText);
				//console.log(response.responseText);
				//console.log(response.status);
				//console.log(response.statusText);
			}
		});
     	},
	submitData: function(){
		$(this.el).html("");
		$("#header").show();
		$("#header").html('<a href="./index.html" id="home" data-role="button" class="ui-btn ui-icon-back">Back to Home</a><div id="header_log"></div>');
		$("#home").show();
		/* synchronize local browser storage records */
		appRouter.dirty();
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(filesystem){
			filesystem.root.getDirectory('org.sccwrp.sensor', {}, function(dirEntry){
				var dirReader = dirEntry.createReader();
				dirReader.readEntries(function(entries){
					alert(entries.length);
				  for(var i = 0; i < entries.length; i++){
					var entry = entries[i];
					if(entry.isFile){
						app.uploadFile(filesystem,entry);
					}
					if(i == (entries.length - 1)){
						$("#header_log").html("Uploading Complete!");
					}
				  }
				//alert("Finished uploading to SCCWRP");
				}, app.onError);
			}, app.onError);
		}, app.onError);
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
