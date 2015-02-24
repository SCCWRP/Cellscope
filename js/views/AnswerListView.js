var AnswerListView = Backbone.View.extend({
	//el: '#content',
	template:_.template($('#tpl-answer-details').html()),
	initialize: function(){
		console.log("AnswerListView");
		//Start idle counter
		var that = this;
		$(document).ready(function () {
			var interval = setInterval(function(){that.idleCounter(that);}, 60000);
			$(document).mouseover(function(e) {
				that.idleTime = 0;
			});
			$(document).keypress(function(e) {
				that.idleTime = 0;
			});
		});
		// must unbind event before each question or will end up with wrong model
		// null out qhistory otherwise the object lingers
		this.qHistory = [];
		$(this.el).unbind("click");
		this.listenTo(this.model, 'sync', this.nextQuestion);
		this.listenTo(footerView, 'forward', this.saveAnswer); 
		this.listenTo(footerView, 'back', this.goBack); 
		this.listenTo(this.model, 'change:status', this.nextQuestion);
		this.listenTo(this.model, 'change:type', function() {
			if(["radio", "select"].indexOf(this.model.get('type')) >=  0) {
				$('#forward').hide();
			} else {
				$('#forward').show();
			};
			// Points of no-return
			if(this.model.get('qcount') == 1) {
				$("#back").css("visibility", "hidden");
			} else {
				$("#back").css("visibility", "visible");
			};
		});
		},
	events:{
		"click .save":"saveAnswer",
		"change select[name=aid]":"saveAnswer",
    		"click .decline":"declineAnswer",
    		"click #decline":"declineAnswer",
    		"change input[type=radio]":"saveAnswer",
		"keyup input[type=text]" : "processKeyup"
	},
	idleTime: 0,
	idleCounter: function(x) {
		x.idleTime = x.idleTime + 1;
		if(x.idleTime > 19 && x.model.get("qcount") > 13) {
			x.cleanup();
			location.reload();
		};
	},
	processKeyup: function(event) {
		if(event.keyCode == 13){
			alert("processKeyup keycode13: "+event);
			this.saveAnswer(event);
		}
	},

	change:function(event){
		var that = this;
		that.nextQuestion();
	},
    	declineAnswer:function(event){
		formtype = this.model.get("type");
		this.saveAnswer(event, true);
	},
	qHistory: [],
	goBack: function(event){
		index = this.qHistory.pop();
		if(index) {
			this.model.set("qcount", index); 
			this.nextQuestion(this.model);
		} else {
			appRouter.navigate("");
		};
	},
	nextQuestion:function(t, response, options){	
		//console.log("nextQuestion");
		//console.log(this.model);
		//console.log(this.model.attributes);
		var val = this.model.validate(this.model.attributes);
		if(val){
			footerView.toggle("on");
			return;
		}
		// No saving until question 8
		if(this.model.get('qcount') <= 7) {
			$("#restart").css("visibility", "hidden");
		} else {
			$("#restart").css("visibility", "visible");
		};
		var that = this;
		// get current question number
		var nextQcount = t.get("qcount");
	//	if(nextQcount > this.endquestion) return;
		// changed - to above for receipt
		//var nextQcount = response.qcount;
		////console.log(response.qcount);
     		var questionList = new QuestionList();
		questionList.fetch({success: getQuestion,error: errorQuestion});
		function getQuestion(){
			gotQuestion = questionList.get(nextQcount);
			if(language == "Spanish"){
				var fixMenu = gotQuestion.attributes.smenu.split(",")
			} else {
				var fixMenu = gotQuestion.attributes.menu.split(",")
			}
			t.set({	'title': gotQuestion.attributes.title,
				'menu': fixMenu,
				'type': gotQuestion.attributes.type,
				'placeholder': gotQuestion.attributes.placeholder,
				'decline': gotQuestion.attributes.decline});
			questionListView = new QuestionListView({model: gotQuestion});
			questionListView.render();
			//updateProgressBar();
			//that.render();
			$("#content").append(that.render().el);
			updateProgressBar(t);
			appRouter.css();
			//$(window).scroll(appRouter.positionFooter).resize(appRouter.positionFooter)
		}
		function updateProgressBar(t){
			var modOne = 13;
			var modTwo =17;
			var modThree = 12;
			var modFour = 14;
			var modFive = 6;
			var modSix = 8;
			var nextQcount = t.get("qcount");
			if (nextQcount < 13) {
				$('#Modprogress-bar').val((nextQcount/modOne)*100);
     				$('#Modprogress-bar').slider('refresh');
			}
			if (nextQcount > 13 && nextQcount <26){				
				$('#Modprogress-bar').val(((nextQcount-13)/modTwo)*100);
     				$('#Modprogress-bar').slider('refresh');
			}
			if (nextQcount > 26 && nextQcount < 35){
				$('#Modprogress-bar').val(((nextQcount-26)/modThree)*100);
     				$('#Modprogress-bar').slider('refresh');
			}
			if (nextQcount > 35 && nextQcount < 72){
				$('#Modprogress-bar').val(((nextQcount-35)/modFour)*100);
     				$('#Modprogress-bar').slider('refresh');
			}	
			if (nextQcount > 72 && nextQcount < MAXQUESTION){
				$('#Modprogress-bar').val(((nextQcount-72/modFive)*100));
     				$('#Modprogress-bar').slider('refresh');
			}	
			$('#Fullprogress-bar').val((nextQcount/MAXQUESTION)*100); 			
     			$('#Fullprogress-bar').slider('refresh');
		}
		function errorQuestion(model,response){
			//console.log(response);
		}
    	},
	selectorString: {
				"radio":"#aid input[type = 'radio']:checked",
				"text":"#aid",
				"select":"#aid",
				"multi":"#aid input[type = 'checkbox']:checked",
				"sevenday":"#aid input[type = 'checkbox']:checked",
				"numberSelect":"#aid",
				"dateSelect":"[id=aid]",
				"dateTimeInterval":"[id=aid]"
	},
	extractAnswer: function () {
		var currentAnswer = $(this.selectorString[formtype]); 
		if(formtype == "multi" || formtype == "sevenday") {
			var temparray = [];
			currentAnswer.map(function () { temparray.push(this.value); });
			currentAnswer = temparray.join();
		} else if(formtype == "numberSelect") {
			currentAnswer = $("select").val() + " : " + currentAnswer.val();
		} else if(formtype == "dateSelect") {
			var locations = currentAnswer.map(function(x) {return $(this).val() });
			var dates = $("[id=date]").map(function(x) {return $(this).attr("name")});
			var dateSelectAnswer = {};
			for(i=0; i < dates.length; i++) {
				dateSelectAnswer[dates[i]] = locations[i];
			};			
			currentAnswer = JSON.stringify(dateSelectAnswer);
		} else if(formtype == "dateTimeInterval") {
			currentAnswer = currentAnswer.map(function(x) {return $(this).val() });
			var start = currentAnswer.filter(function(x,i) {return x % 2 == 0});
			var end  = currentAnswer.filter(function(x,i) {return x % 2 != 0});
			var intervals = _.zip(start, end).map(function(x) {return x.join("-");});
			var dates = $("[id=date]").map(function(x) {return $(this).attr("name")});
			var dateSelectAnswer = {};
			for(i=0; i < dates.length; i++) {
				dateSelectAnswer[dates[i]] = intervals[i];
			};			
			currentAnswer = JSON.stringify(dateSelectAnswer);
		} else {
			currentAnswer = currentAnswer.val();	
		};
		if(!currentAnswer || currentAnswer == []) {
			currentAnswer = "";
		};
		//console.log("currentAnswer: "+ currentAnswer);
	 	return currentAnswer;	
        },
	saveAnswer:function(event, decline, other){
		$("body").css("background-color", "gray");
		$("body").css("opacity", "0.5");
		var timer = 0;
		var appID;
		var that = this;
		formtype = this.model.get("type");
		// disable radio button double click
                if(formtype == "radio"){
		        $(".ui-radio").css("pointer-events", "none");
		}
		if(other) {
			var currentAnswer = other;
		} else if(!decline) {
			var currentAnswer = this.extractAnswer();
		} else {
			var currentAnswer = "Did not Enter";	
		};
		if(currentAnswer == "Other") {
			footerView.toggle("on");
			return;
		};
	        //var currentAnswer = this.extractAnswer();
		// current question
		var currentQuestion = Number(this.model.get("qcount")); 
		appID = Number(this.model.get("id")); 
		// next question  
		var nextQuestion = (currentQuestion + 1);
		var participant_type = this.model.get("q1");
		if(currentQuestion == 2 && currentAnswer == "No"){
			if(participant_type == "Boat Angler"){
				nextQuestion += 1;	
			}
			if((participant_type == "Pier Angler") || (participant_type == "Shoreline Angler")){
				nextQuestion += 2;	
			}
		}
		if((currentQuestion == 3 && currentAnswer == "This month") || (currentQuestion == 3 && currentAnswer == "Within the last 3 months")){
			alert("End Survey");
			location.reload();
		}
		if((currentQuestion == 3 && currentAnswer == "Within the last 6 months") || (currentQuestion == 3 && currentAnswer == "More than 6 months ago")){
				if((participant_type == "Pier Angler") || (participant_type == "Shoreline Angler")){
					nextQuestion += 1;	
				}
		}
		if(currentQuestion == 4 && currentAnswer == "No"){
			alert("End Survey");
			location.reload();
		}
		//if(currentQuestion == 2 && currentAnswer == "Yes"){
		if(currentQuestion == 5 && currentAnswer == "Yes"){
			var testUrl = "disabled";
			if(isDevice){
				app.getCamera(function(imgUrl){ }, this.model);
			} else {
				this.model.set({ picture_url: testUrl });
			}
		}
		if(currentQuestion >=  this.endquestion){
			//console.log("endquestion: "+this.endquestion);
			/* user is finished with survey enrollment/weekly - record is complete */
			// code below should only happen once - edit mode will cause code to re-execute
			var current_status = this.model.get('status');
			this.model.set({ status: "complete" });
			/* set timer so after save the app goes to receipt */
			timer = 4;
		};
		// create answerDetails object
		answerDetails = {};
		answerDetails["q"+currentQuestion] = currentAnswer;
		this.model.set("q"+currentQuestion, currentAnswer);
		answerDetails.qcount = nextQuestion;
		// either set or save here
		//this.model.set(answerDetails, {validate:true});
		//if(timer != 0){ use this code if you want break up modules and then save
		// dump saved answers to json string 
		var parsedJSON = JSON.stringify(this.model.toJSON());
		this.model.save(answerDetails, {
				wait: false,
				success: function(model,response){
					//console.log("success");
					//console.log(model);
					if(that.qHistory.indexOf(currentQuestion) == -1)that.qHistory.push(currentQuestion);
					// last module - go to receipt
					if(timer == 4){
						// save data to sd drive
						if(isDevice){
							//alert(parsedJSON);
							app.saveLocalData(parsedJSON);
						}
						// clear stage and events
						that.cleanup();
						// return receipt from database
						// check for ie9 or less - no receipt
						var ie = (function(){ 
							var undef, v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');				 
							while ( div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->', all[0]);
						       	return v > 4 ? v : undef;
					       	}());
						alert("End Survey");
						appRouter.navigate('/', {trigger: false});
						location.assign(HOME);
					}
				},
				error: function(model,response){
				  console.log(response.status);
       				}
			});
		$("body").css("background-color", "white");
		$("body").css("opacity", "1");
		}, /* end saveAnswer */
	cleanup: function() {
		//console.log("AnswerListView cleanup");
	        this.undelegateEvents();
		this.unbind();
		this.remove();
	},
	render: function(){
		$(this.el).html("");
		$(headerView.el).show();
		$(footerView.el).show();
		$(this.el).html(this.template(this.model.toJSON()));
		$('input:checkbox[value="Other"]').on('change', function(s) {
			$('<div>').simpledialog2({
				mode: 'button',
		   		headerText: '',
		   		headerClose: true,
				buttonPrompt: 'Type your response',
				buttonInput: true,
				buttons : {
			  		'OK': {
				    		click: function () { 
							var name = $.mobile.sdLastInput;
							var i = "'" + name + "'";
						   	$("#aid").controlgroup("container").append('<input type="checkbox" value="' + name + '" id="id' + i + '"> <label for="id' + i + '">' + name + '</label>');
						   	$("#aid").trigger("create");
						   	$("input:checkbox[value="+i+"]").prop('checked', true).checkboxradio('refresh');
					   	}
			  		},
		   		}
	  		})
		});
		$('select').on('change', function(s) {
			var selectTarget = $(s.currentTarget);
			$("body").css("background-color", "white");
			$("body").css("opacity", "1");
			if(selectTarget.val() == "Other") {
				$('<div>').simpledialog2({
				    mode: 'button',
			   	    headerText: '',
			   	    headerClose: true,
			    	    buttonPrompt: 'Type your response',
			    	    buttonInput: true,
			    	    buttons : {
			          	'OK': {
				          click: function () { 
						var newoption = $.mobile.sdLastInput;
						$("select").append($("<option></option>").attr("value", newoption).text(newoption));
					       	selectTarget.val(newoption);
						selectTarget.trigger('change');
					  }
					},
				    }
			  	})	
			};
		});
		footerView.toggle("on");
		/* !!!!!!!! important this must be in code otherwise events will be lost between rendering !!!!!! */
		this.delegateEvents();
		return this;
	}
});
