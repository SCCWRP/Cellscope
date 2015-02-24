var AnswerList = Backbone.Collection.extend({
	initialize: function(){
        },
	model: Answer,
	url: 'http://data.sccwrp.org/sensor/index.php/surveys'
});
