module('Math Test Cases', {
	setup: function(){
		$("body").append('<div id="log"></div>');
	},
	teardown: function(){
		$("#log").remove();
	}
});
test('add test', function(){
	//strictEqual(MathOperations.addNumbers(3, 5), 8, "test add");
	MathOperations.addNumbers(5, 3);
	equal($('#log').text(), 8, "test add in dom");
});
test('sub test', function(){
	strictEqual(MathOperations.subNumbers(3, 5), 2, "test subtraction");
});
test('assertions', function(){
	equal( 1, 1, 'one equals one');
});
test('test', function() {
	deepEqual({}, {}, 'passed');
	deepEqual([], [], 'passed');
	deepEqual([1],[1], 'passed');
});
asyncTest('ajax test', function(){
	expect(1);
	var xhr = $.ajax({
		type: 'GET',
	    	url: '../main.html'
	})
	.always(function(data,status){
		var $data = $(data);
		var pageTitle = $data.filter('title').text();
		equal(pageTitle, 'Surfer Health Study', 'title is Surfer Health Study');
		start();
	});
});

