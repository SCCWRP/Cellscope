var ReceiptList = Backbone.Collection.extend({
	model: Receipt,
	url: 'http://data.sccwrp.org/fcs/index.php/surveys'
});
