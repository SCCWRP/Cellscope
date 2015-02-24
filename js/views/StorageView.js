var StorageView = Backbone.View.extend({
	el: '#content',
	template:_.template($('#tpl-storage-details').html()),
	initialize: function(){
		alert("initialize StorageView");
		// used timestamp for files initially but switched to static log file - everytime app is loaded it created a new timestamp file
		//directoryLocation.getFile(timestampFile, {create:true}, this.fileAppend, app.onError);
		directoryLocation.getFile("survey.txt", {create:true}, this.fileAppend, app.onError);
	},
  	fileAppend: function(fs){
		//alert("fileAppend");
  		//alert(fs.fullPath);
		var localSave;
    		fs.createWriter(function(fileWriter) {
			//alert("fs.createWriter");
			fileWriter.onwrite = function(evt) {
		            app.showContent("fileAppend wrote to file");
		        };
			//go to the end of the file...
			fileWriter.seek(fileWriter.length);
			// retrieve local data
			localSave = app.getLocalData("local","save"); 
			//alert("readObj: "+ localSave);
			var blob = new Blob([localSave], {type: "text/plain"});
			fileWriter.write(blob);
    		}, app.onError);
        },
	render: function(){
		$("#landing").hide();
		$(headerView.el).show();
		$('#question').html("Camera");
		$(this.el).html("");
		//$(this.el).html(this.template({FAquestions: this.FAQcol.toJSON() }));	
	}
});
