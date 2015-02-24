var createDefaults =  function() {
		var df = {};
			for(i=1; i<= MAXQUESTION; i++) {
						df["q" + i] = null;
							};
				df["user_id"] = null;
					return df;
}
var Receipt = Backbone.Model.extend({
	initialize: function(){
    		var that = this;
                this.on("invalid",function(model,error){
			that.set(that.rollback, {validate: false});
	        	custom_alert(error);
        	});
	},
    	defaults: createDefaults(),
        	rollback: {},
        validate: function (attrs){
		for(i=1; i<= MAXQUESTION; i++) {
			var q = "q" + i;
			var outcome = validators[q].map(function(f) {
				return f(attrs[q], attrs);
		});
		var outcome = outcome.filter(function(x){return x != undefined;});
		if(outcome.length > 0){
			var oneerror = outcome[0];
			return oneerror;
		}
		};
		this.rollback = attrs;
	},
	urlRoot: 'http://data.sccwrp.org/fcs/index.php/surveys',
    	/* critical - backbone by default will not replace client side attributes with server response
		https://github.com/jashkenas/backbone/issues/1069
	   instead we will return the response.event object to our model which will replace those client attributes
	*/
    	parse: function(response){
		return response;
	}
});
