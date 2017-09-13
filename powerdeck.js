

console.log("===POWERDECK===");
console.log(form);

var num_tweets = parseInt(form[0].value);
var ms_interval = parseInt(form[1].value*60) * 1000;
var iterations = parseInt(form[2].value)-1;

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.msg == "hello") {
            	sendResponse({remaining: iterations});
        }

        if (request.msg == "stop"){
            sendResponse({msg: "ok"});
        	num_tweets = 0;
        }

 });


autodeck();

if (iterations > 0) {
	var interval = setInterval( function (){

		if (iterations <= 0) {
			clearInterval(interval);
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
			autoretweet();
			unlike();
		} catch (err) {
			// something went wrong, shut it down
			console.log(err);
			iterations = 0;
			clearInterval(interval);
		}
	}	
}


function autoretweet(){
	// Open retweet options

	var tweet_options = $(".is-favorite").first().find("footer").find("ul");
	//console.log(tweet_options);


	var retweet_btn = tweet_options.find("a").eq(1);
	//console.log(retweet_btn);
	$(retweet_btn).find("i").click();


	// make sure all the accounts are set on
	var accounts = $(".accs.cf.js-account-selector").find("li").not(".acc-selected");
	$(accounts).each( function (index) {
		$(this).click();
	});

	// find retweet button
	var retweet = $(document).find("button.js-retweet-button");
	//console.log(retweet);

	try {
		$(retweet).click();
	} catch (e) {
		throw e;
	}
}

function unlike() {
	var like_btn = $(".is-favorite").first().find("footer").find("ul").find("li").eq(2).find("a"); //.eq(2);
	console.log(like_btn);

	try {
		$(like_btn)[0].click();
	} catch(e) {
		throw e;
	}

}

/*
function autolike() {
	
	//  Open up options menu
	var options_btn_clickable = $(options_btn).children().first()
	console.log(options_btn_clickable);
	$(options_btn_clickable).click();



	// Select like from accounts
	var options_menu = $(tweet_options).parent().find("div").eq(2);
	console.log(options_menu);

	var menu_list = $(options_menu).find("ul");
	console.log(menu_list);

	var like_from_accounts_btn = $(menu_list).find("li").eq(7).find("a");
	console.log(like_from_accounts_btn);

	// click
	setTimeout(function() {
		console.log("open!");
		$(like_from_accounts_btn)[0].click();
	}, 2000 );


	like_from_accounts = options_menu.childNodes[3].childNodes[0];
	setTimeout(function() {	
				console.log(like_from_accounts);
				like_from_accounts.click();}, 
				2000);

}
*/

/*
function openclosecomment() {
	// Find the tweet options button
	tweet = document.getElementsByClassName("is-favorite")[0];
	tweet_footer = tweet.childNodes[5]
	tweet_actions = tweet_footer.childNodes[1]


	comment_button = tweet_actions.childNodes[1].childNodes[1];
	comment_button.click();

	closebtn = $(".js-inline-compose-close.btn.btn-square.btn-neutral");
	console.log(closebtn);
	setTimeout(function() {$(closebtn).click();}, 2000);
}
*/

