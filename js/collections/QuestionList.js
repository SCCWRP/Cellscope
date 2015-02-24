var emailpattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
var zippattern = new RegExp(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
var phonepattern = new RegExp(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/);
    
var QuestionList = Backbone.Collection.extend({
	initialize: function(){
		//this.on('sync',this.getQuestion,this);
	},
    	getQuestion: function(){
		console.log("getQuestion");
		var that = this;
		var valLU = {};
		var validationFuncs = {
			"noVal": function () {},
			"zipval":  function (q) {if(q && !zippattern.test(q)){ return "Invalid ZIP code";}},
    			"calzip": function (q) {if(q && (parseInt(q) > 96162 || parseInt(q) < 90001 && parseInt(q) != 99999)) return "Only California Zip codes may be entered";},
  			"phoneval": function (q) {if(q && !phonepattern.test(q)){ return "Invalid phone number";}},
    			"emailval": function (q) {if(q && !emailpattern.test(q)) return "Invalid email";}, 
			"0": function(q) {if(q == "") return "A response is required before continuing";},
			"select": function(q) {if(q && q == "Select One") return "A response is required before continuing";},
			"1": function(q) {if(q && q.length < 2) return "Invalid phone number";}, 
			"checkq7": function(q, at) {if(q && at.q6 != q) return "Phone number must match";},
			"checkq9": function(q, at) {if(q && at.q8 != q) return "Email must match";},
			"gte1": function(q) {if(q && q.split(" : ")[1] < 1) return "Value must be greater than zero";},
			"isNumber": function(q) {if(q && isNaN(q)) return "Value must be a number";},
			"numberWeek": function(q) {if(q && (isNaN(q.split(" : ")[1]) || q.split(" : ")[1] == "")) return "Value must be a number";},
    			"oceanEnter": function(q, at) {if(q && at.q26 && _.all(q.split(",").map(function(x) {return at.q26.split(",").indexOf(x) > -1;})))return "Please only select days in which you did not enter the ocean";},
			"selectOne": function(q){if(q && _.values(JSON.parse(q)).filter(function(x) {return x == "Select One";}).length > 0) return "You must select an answer for all days";},
    			"numberLimit": function(q) {if(q) {
				var split = q.split(" : ");
				var period = split[0].indexOf("week") >= 0;
				var value = split[1];
				if((period && value > 7) || value > 31) {
			       		return "Submitted value is too large";
			};};},
			"selectInterval": function(q) {if(q && q.match("Select"))return "You must select an answer for all days";}
		};
		var createValidation = function (questions){
		  for(i=0; i< MAXQUESTION; i++) {
			var thismod =  that.models[i].attributes; 
			if(!thismod.hasOwnProperty("check")) {
				thismod["check"] = "0";
			};
			var codes = thismod.check.split(",");
			valLU["q" + (i+1)] = codes.map(function(c) {
				return validationFuncs[c];
			});	
			if(thismod.errmessage != "") {
				var v = (function() {
					var message = thismod.errmessage;
					return function(q) {if(q && q == "No") {return message;}}
				})(); 	
				valLU["q" + (i+1)].push(v);
			};
	  	  };
		  return valLU;
		};
		validators = createValidation(this);
		console.log(validators);
        },
	model: Question,
	url: 'questions.json'
});
