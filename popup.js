
var exec_btn;
var isExecuting;

$(document).ready(function() {

   $('body').on('click', 'a', function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
   });

	exec_btn = document.getElementById('mybtn');
	var remaining = 0;

	// Handle execution button click
	$(exec_btn).on("click", function (){
		if (isExecuting) {
			handleStopClicked();
			isExecuting = false;
		} else {
			if (formValidation()) {
				handleStartClicked();
				isExecuting = true;
			}

		}
	});

	// See if the autodeck script is already running on the page
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	    chrome.tabs.sendMessage(tabs[0].id, {msg: "hello"}, function(response) {

	    	// If theres a response, then it is already running.
	        if (response) {

	        	$('input[name="num_tweets"]').val(response.nt);
	        	$('input[name="sec_interval"]').val(response.ti);
	        	$('input[name="iterations"]').val(response.it);



	        	if (response.remaining <= 0) {
	        		isExecuting = false;

	    		    checkUrl(tabs[0].url);
	        		showStartDisplay();
	        	}
	        	else {
	        		isExecuting = true;

	       			 checkUrl(tabs[0].url);
	        		showStopDisplay();
	        		$("#remaining").html("" + response.remaining + " iterations remaining");
	        	}
	       
	        }
	        // no response, it isn't running.
	        else {
	            console.log("Not there, inject contentscript");

	            isExecuting = false;

	       		checkUrl(tabs[0].url);
	            showStartDisplay();
	        }

	    });
	});

});

function checkUrl(url) {
	    if (url != 'https://tweetdeck.twitter.com/' &&
	    	!isExecuting) {
	    	$('#main').hide();
	    	$('#wrong-url').show();
	    }
	    else {
	    	$('#main').show();
	    	$('#wrong-url').hide();
	    }
}


function handleStartClicked() {
	var f = $('form').serializeArray();
	var codestring = "form = " + JSON.stringify(f);

	executeAutodeck(f);
	showStopDisplay();
	$("#remaining").html("" + (f[2].value-1) + "iterations remaining");

}

function executeAutodeck(f) {
	chrome.tabs.executeScript(null, { 
		file: "jquery-3.2.1.min.js" 
	}, function() {
	    chrome.tabs.executeScript(null, { 
	    	code: 'form = ' + JSON.stringify(f) 
	    }, function () {
	    		chrome.tabs.executeScript(null, {file: "powerdeck.js" });
	    	});
	});
}

function handleStopClicked() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	    chrome.tabs.sendMessage(tabs[0].id, {msg: "stop"}, function(response) {
	        if (response) {
	        	isExecuting = false;
	        	showStartDisplay();
	        }
	    })
	});
}

function formValidation() {

	var f = $('form').serializeArray();

	if ( f[0].value > 4 || f[0].value < 1) {
		return false;
	}
	else if ( f[1].value > 180 || f[1].value < 30) {
		return false;
	}
	else if ( f[2].value > 72 || f[2].value < 1) {
		return false;
	}
	return true;
}


function showStartDisplay () {
	$("#remaining").hide();

	$('#num_tweets').focus();
	$(exec_btn
	).css("background-color", "#842B2B");
	$(exec_btn
	).css("color", "#EEF0F2");
	$(exec_btn
	).addClass("start-button-hover");
	$(exec_btn
	).html("Start");
}


function showStopDisplay() {
	$("#remaining").show();

	$(exec_btn
	).removeClass("start-button-hover")
	$(exec_btn
	).css("background-color", "#b44B4B");
	$(exec_btn
	).css("color", "#340B0B");
	$(exec_btn
	).html("Stop");
}


