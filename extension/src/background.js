/* 
	function suggest
	- fetch top 3 suggestion results using json from ChallengePost
 */

function suggest(string, suggestion) {

	if(string=="") {
		return;
	}
	
	var input = encodeURIComponent(string);
	var suggestURL =  "http://challengepost.com/software/search.json?query=" + input;

	$.ajax(suggestURL, {
		"dataType" : "json",
		"success" : function (jsonData) {
		
			var resultsFromJson = jsonData.results;
			if(resultsFromJson.length == 0) {return;} // if no suggestions
			var suggestFromJson = []; 
			var len = Math.min(3, resultsFromJson.length); // max 3 suggestions
			for (i = 0; i < len; i++) {

				var descripString = resultsFromJson[i].input;

				suggestFromJson.push({
					"content" : resultsFromJson[i].input, 
					"description" : descripString
				});
			}
			
			suggestion(suggestFromJson);
		}
	});
}

/* 
	function navigate
	- navigates current tab to ChallengePost with search terms
 */


function navigate(inputString) {
	if(inputString=="") {
		// If empty, then go to ChallengePost.com
		chrome.tabs.create({"url" : "http://challengepost.com/software/", "active" : true});
	} else {
		var inputURI = encodeURIComponent(inputString);	
		chrome.tabs.getSelected( undefined, function(tab) {
			chrome.tabs.update(tab.id, {url: "http://challengepost.com/software/search?query="+inputURI}, undefined);
		}); 
	}
}


// Reacting to users entering "@" in the omnibox
chrome.omnibox.onInputChanged.addListener(suggest); // support suggestions queried from ChallengePost
chrome.omnibox.onInputEntered.addListener(navigate);
chrome.omnibox.setDefaultSuggestion({"description" : "Search ChallengePost for "%s""});
