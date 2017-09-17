

console.log("===POWERDECK===");
console.log(form);


var num_tweets  = startNumTweets = parseInt(form[0].value);
var ms_interval = startMSI = parseInt(form[1].value*60) * 1000;
var iterations  = startIt = parseInt(form[2].value);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.msg == "hello") {
            	sendResponse({remaining: iterations,
            					nt: startNumTweets,
            				    ti: (startMSI/1000/60),
            					it: startIt
            				});
        }

        if (request.msg == "stop"){
            sendResponse({msg: "ok"});
        	num_tweets = 0;
        }

 });


autodeck();
iterations-=1;

if (iterations == 0)
	alert("Execution Complete");
else if (iterations > 0) {
	var interval = setInterval( function (){

		if (iterations <= 0) {
			clearInterval(interval);
			alert("Execution Complete.");
		}

		autodeck();
		iterations-=1;

	}, ms_interval);
}

console.log("===COMPLETE===")


//============================================================================================


function autodeck() {
	// deck number of tweets specified
	console.log("autodecking...");
	for (var i = 0; i < num_tweets; i++) {

		try {
			autoretweet( function (){
				unlike();	
			});

		} catch (err) {
			// something went wrong, shut it down
			alert(err);
			console.log(err);
			iterations = 0;
			clearInterval(interval);
			break;
		}
	}	
}


function autoretweet(callback){
	// Open retweet options

	var favorites_column = $(".column-type-favorite");

	if (favorites_column.length == 0) {
		throw "Favorites column could not be found.";
		return;
	}

	var tweet_options = favorites_column.find(".is-favorite").last().find("footer").find("ul");
	console.log(tweet_options);

	if (tweet_options.length == 0) {
		throw "No favorited tweet(s) could be found.";
		return;
	}


	var retweet_btn = tweet_options.find("a").eq(1);
	//console.log(retweet_btn);
	if ($(retweet_btn).find("i").length == 0) {
		throw "Retweet button could not be found.";
		return;
	}
	else {
		$(retweet_btn).find("i").click();
	} 

	// make sure all the accounts are set on
	var accounts = $(".accs.cf.js-account-selector").find("li").not(".acc-selected");
	$(accounts).each( function (index) {
		try {
			$(this).click();
		} catch(e) {
			throw e + "\nCould not select all accounts.";
			return;
		}
	});

	// find retweet button
	var retweet = $(document).find("button.js-retweet-button");
	//console.log(retweet);

	if (retweet.length != 0) {
		$(retweet).click();
	}
	else {
		throw "\nRetweet submission button could not be found.";
		return;
	}

	callback();
}

function unlike() {
	var like_btn = $(".column-type-favorite").find(".is-favorite").last().find("footer").find("ul").find(".margin-l--1").find("a"); //.childNodes(5).find("a"); //.last().find("footer").find("ul")

	console.log("like_btn: ");
	console.log(like_btn);


	try {
		$(like_btn)[0].click();
	} catch(e) {
		throw e+ "\nFavorite button could not be found.";
		return;
	}

}