/* 
	function navigate
	- navigates current tab to ChallengePost with search terms
	- used by omnibox
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
chrome.omnibox.onInputEntered.addListener(navigate);
chrome.omnibox.setDefaultSuggestion({"description" : "Search ChallengePost for %s"});
