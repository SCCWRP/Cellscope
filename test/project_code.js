var MathOperations = {
	addNumbers : function (n1, n2){
		$("#log").text(n1 + n2);
		console.log($("#log").text());
	},
	subNumbers : function (n1, n2){
		return n2 - n1;
	}
}
