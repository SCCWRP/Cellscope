var RestartView = Backbone.View.extend({
	template:_.template($('#tpl-restart-details').html()),
	initialize: function(){
    		//this.on('popup', this.afterRender);
	},
    	events: {
		"click #restartCancel": "cancel",
		"click #restartRestart": "reload"
	},
    	cancel: function (e) { 
	  	$("#popupRestart").popup("close");
		this.cleanup();
		return;
	},
    	reload: function (e) { 
	  	$("#popupRestart").popup("close");
		this.cleanup();
		location.reload();
	},
	cleanup: function() {
		console.log("RestartView cleanup");
	        this.undelegateEvents();
	        this.$el.removeData().unbind();
	        Backbone.View.prototype.remove.call(this);
	},
	render: function(){
		$(this.el).html(this.template());	
		return this;
		//this.trigger("render:after", "View rendererd");
	}
});
