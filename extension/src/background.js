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

/* 
	function suggest
	- suggests top 3 suggestions by querying ChallengePost
*/
function suggest(inputString, suggestions) {
	// suggestions is an array of SuggestResults 
	// Query URL: "http://challengepost.com/software/search.json?query=", thanks Robin Boutros!

	if(inputString=="") {
		return;
	}

	var inputURI = encodeURIComponent(inputString);	
	var queryURL = "http://challengepost.com/software/search.json?query=" + inputURI;

	$.ajax({
		url: queryURL,
		dataType: "json",
		statusCode: {
        	502: function () {
        		error502 = [];
        		error502.push({
        			"content" : "No suggestions from ChallengePost", 
					"description" : "No suggestions from ChallengePost"
        		});
            	suggestions(error502);
        	}
        },
		success: function (queryResult) {
			// get array of all software projects
			var software = queryResult.software;
			// if no suggestions found
			if(software.length == 0) {return;}
			// initialize software names
			var softwareNames = [];

			var num = Math.min(3, software.length); // a maximum of 3 suggestions
			for (i = 0; i < num; i++) {
				var name = software[i].name;
				var desc = software[i].tagline;

				// If no tagline, remove the null
				if  (desc == null) { desc="" ;}
				// Else, add a dash to separate the description from the name
				else {desc = " - " + desc}

				softwareNames.push({
					"content" : name, 
					"description" : "Are you looking for: " + '<match>' + name + '</match>' + '<dim>' + desc + '</dim>'
				});
			}
			suggestions(softwareNames);

		}
	});
}

// Reacting to users entering "@" in the omnibox
chrome.omnibox.onInputChanged.addListener(suggest);
chrome.omnibox.onInputEntered.addListener(navigate);
chrome.omnibox.setDefaultSuggestion({"description" : "Search ChallengePost for '%s'"});
