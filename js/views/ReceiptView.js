var ReceiptView = Backbone.View.extend({
	//el: '#content',
	template:_.template($('#tpl-receipt-details').html()),
	initialize: function(){ //this.model.on('change',this.test,this);
		//alert("ReceiptView initialize");
		//$(this.el).unbind("click");
		this.listenTo(this.model, "change", this.render);
	},
	events:{
		"click .finish":"finish",
		"click .edit":"edit",
		"vmouseover li":"showToolTip",
    		"vmouseout li":"hideToolTip"
	},
   	showToolTip: function(event){
		$(event.currentTarget).children(".tip").css("visibility", "visible")
	},
	hideToolTip: function(event){
		$(event.currentTarget).children(".tip").css("visibility", "hidden")
	},
        edit: function(event){
		event.preventDefault();
		var that = this;
		/* find id of question user wants to edit and set qcount to previous */
		//console.log(event.currentTarget);
		var clickedID = event.currentTarget.id;
		//console.log(clickedID);
		var fixedID = Number(clickedID.replace('q',''));
		//console.log(fixedID);
		that.cleanup();
		// null out answer view otherwise the object stays in memory
		answerListView = null;
		// why are we navigating
		appRouter.navigate('fcs/edit/' + fixedID, {trigger: true});
		//footerView = new FooterView;
		//footerView.render();
		//console.log("this model after cleanup: ");
		//console.log(this.model);
		answerListView = new AnswerListView({model: this.model});
		answerListView.endquestion =  event.currentTarget.name; 
		answerListView.model.set({ qcount: fixedID, status: "edit"});
		answerListView.nextQuestion(this.model);
	},
	finish: function(event){
		event.preventDefault();
		////console.log("finish");
		var that = this;
		////console.log(this.model.toJSON());
		//appRouter.checksum();
		custom_alert("Survey Finished", "", done);
		function done () {
			that.cleanup();
			appRouter.navigate('/', {trigger: false});
			location.assign(HOME);
		}
	},
	cleanup: function() {
	     //console.log("receipt cleanup");
	     this.undelegateEvents();
	     this.$el.removeData().unbind();
	     Backbone.View.prototype.remove.call(this);
 	},
	render: function(){
			//console.log("ReceiptView render");
			//console.log(this.model.toJSON());
		        $(headerView.el).hide();
			//$(this.el).html("");	
			$(footerView.el).hide();	
			//footerView.cleanup();
			var receiptData = _.omit(this.model.attributes, 'id');
			$(this.el).append(this.template({ 'elements': receiptData }));	
			return this;
	}
});
