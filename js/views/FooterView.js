var FooterView = Backbone.View.extend({
	el: '#footer',
	template:_.template($('#tpl-footer-details').html()),
	initialize: function(){
		this.render();
	},
    	events: {
		"click #back": "back",
		"click #forward": "forward",
		"click #restart": "restart",
		"click #restartCancel": "cancel",
		"click #restartRestart": "reload"
	},
    	back: function (e) { 
	  	e.preventDefault();
		this.trigger("back");
	},
    	forward: function (e) { 
	  	e.preventDefault();
		this.toggle("off");
		this.trigger("forward");
	},
    	restart: function (e) { 
	  e.preventDefault();
	  $("#popupRestart").html( new RestartView().render().el );
	  $("#popupRestart").trigger("create");
	  $("#popupRestart").popup("open");
	  $("#popupRestart").popup('reposition', 'positionTo: window');
	  appRouter.css();
	},
	toggle: function (s) {
		if(s === "off"){
			//console.log("next off");
			$("#forward").prop("disabled", true);
		} else {
			//console.log("next on");
			$("#forward").prop("disabled", false);
		}
	},
	render: function(){
		//console.log("footer");
		$(this.el).html("");
		$(this.el).html(this.template());	
		$('#footer').trigger('create');
		$('#footer').fixedtoolbar({ hideDuringFocus: "input, select" });
		return this;
	}
});
