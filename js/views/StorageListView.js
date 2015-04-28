var StorageListView = Backbone.View.extend({
	el: '#content',
	template:_.template($('#tpl-storage-list-details').html()),
	initialize: function(){
		alert("initialize StorageListView");
	 	var dirReader = fileSystem.root.createReader();
		dirReader.readEntries(this.gotFiles,app.onError);        
	},
   	gotFiles: function(entries) { 
		alert("gotFiles");
		var s = "";
		for(var i=0,len=entries.length; i<len; i++) {
			alert("entries.fullPath: "+entries[i].fullPath);
			s+= entries[i].fullPath;
			if (entries[i].isFile) {
	     			  s += " [F]";
		  	} else {
		  		  s += " [D]";
		  	}
	 		s += "<br/>";
	     	}
	        s+="<p/>";
		//alert("showContent render here: "+s);
	        //app.showContent(s);
	},
	render: function(){
		$("#landing").hide();
		$(headerView.el).show();
		$('#question').html("Camera");
		$(this.el).html("");
		//$(this.el).html(this.template({FAquestions: this.FAQcol.toJSON() }));	
	}
});
