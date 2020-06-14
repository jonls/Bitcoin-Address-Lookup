
/* Parse bitcoin URL query keys. */
function parseBitcoinURL(url) {
	var r = /^bitcoin:([a-zA-Z0-9]{27,34})(?:\?(.*))?$/;
	var match = r.exec(url);
	if (!match) return null;

	var parsed = { url: url }

	if (match[2]) {
		var queries = match[2].split('&');
		for (var i = 0; i < queries.length; i++) {
			var query = queries[i].split('=');
			if (query.length == 2) {
				parsed[query[0]] = decodeURIComponent(query[1].replace(/\+/g, '%20'));
			}
		}
	}

	parsed.address = match[1];
	return parsed;
}

/* Open address info page in new tab. */
function openAddressInfo(address) {
    chrome.tabs.create({ url: 'https://www.blockchain.com/btc/address/'+encodeURIComponent(address) });
}

var lookupItemId = chrome.contextMenus.create({title: 'Lookup Bitcoin address',
					       contexts: ['link', 'selection'],
					       id: 'lookup-address',
					       targetUrlPatterns: ['bitcoin:*']});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId == lookupItemId) {
	if (info.selectionText) {
	    openAddressInfo(info.selectionText);
	} else if (info.linkUrl) {
	    var parsed = parseBitcoinURL(info.linkUrl);
	    if (parsed) openAddressInfo(parsed.address);
	    else window.alert('Invalid Bitcoin address!');
	}
    }
});
