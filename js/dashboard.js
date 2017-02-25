$(document).ready(function(){
	var activecont=0;
	var holdcont=0;
    $("#temp").click(function(){
        flg="active";
        if(flg=="active")
        {
        	
        	activecont=activecont+1;
        	$('#Active_H').html(activecont);
        	$('#activediv').append($('<div class="dyndiv"> new divs </div>'));
        	
        }
        else
        {
        	holdcont=holdcont+1;
			$('#hold_H').html(activecont);
        	$('#holddiv').append($('<div class="dyndiv"> new div </div>'));
        	
        }
    });
});