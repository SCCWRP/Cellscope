var DialogView = Backbone.View.extend({
	el: '#content',
	template:_.template($('#tpl-dialog-details').html()),
	initialize: function(){
		//this.render();
		//this.listenTo(this.model, "change", this.render);
	},
	render: function(){
		alert("dialog");
		console.log("dialog");
		//console.log(this.model.attributes);
		$(this.el).html("");
		$(this.el).append("<ul data-role='listview'>");
		$.each(this.model.attributes, function(key, value){
			 var unixTimestamp = value.timestamp;
			 var returnTime = new Date(+unixTimestamp);
			 var qtext = "Session "+ returnTime.toLocaleString() + " was saved would you like to edit or forget?"; 
			 //console.log(value.id+"-"+returnTime);
			$(this.el).append("<li>"+qtext+"</li>");
			console.log(qtext);
			//$(this.el).append(this.template(value));	
			/*
			var query = confirm("Save session "+ returnTime +"?");
			if(query){
				alert("Saving");
			} else {
				alert("Don't Save");
			}
			*/
		});
		$("#content").append("</ul>");
  	}
});
