var CameraView = Backbone.View.extend({
	el: '#content',
	template:_.template($('#tpl-camera-details').html()),
	initialize: function(){
		var self = this;
		this.getCamera();
		this.render();
	},
  	getCamera: function(){
        	alert("Camera");
	     	function onSuccess(imageURI){
	        	var image = document.getElementById('myImage');
	         	image.src = imageURI;
	     	}
         	function onFail(message){
	       		alert("Failed because: "+ message);
	        }
	     	navigator.camera.getPicture(onSuccess, onFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI });
        },
	render: function(){
		$("#landing").hide();
		$(headerView.el).show();
		$('#question').html("Camera");
		$(this.el).html("");
		//$(this.el).html(this.template({FAquestions: this.FAQcol.toJSON() }));	
	}
});
