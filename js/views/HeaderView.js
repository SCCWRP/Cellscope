var HeaderView = Backbone.View.extend({
	el: '#header',
    	template:_.template($('#tpl-header-details').html()),
    	initialize: function(){
		this.render();
	},
	events:{
		"change select[name=language]":"getLanguage"
	},
    	getLanguage: function(event){
			language = event.target.value;
			alert(language);
        },
    	render: function(){
		//console.log("header");
		$(this.el).html("");
		$(this.el).html(this.template());	
		$('#header').trigger('create');
	}
});
