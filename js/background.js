const cateList = ['movie', 'code'];
const cateItems = {
    movie: ['猫眼搜索', '豆瓣搜索'],
    code: ['github搜索', 'stackoverflow搜索']
}
let searchWord = ''

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
    console.log('input change is ', text);
    let cate = getSearchInfo(text);
    cate && showSuggestionList(cate, suggest)
})

function getSearchInfo (text) {
    if (!text) {
        return;
    }
    text = text.toLowerCase().trim();
    let cate = cateList.find(cate => text.startsWith(cate));
    searchWord = cate ? text.slice(cate.length).trim() : '';
    return cate;
}

function showSuggestionList(cate, suggest) {
    for (key in cateItems) {
        if (cateItems.hasOwnProperty(key)) {
            if (key === cate) {
                suggest(cateItems[key].map(item => {
                    let displayContent = item + searchWord;
                    return {content: displayContent, description: displayContent}
                }))
            }
        }
    }
}

chrome.omnibox.onInputEntered.addListener((text) => {
    console.log('input entered is ', text);
    var href = '';
    if (text.startsWith('豆瓣')) {
        href = 'https://movie.douban.com/subject_search?search_text=' + searchWord + '&cat=1002';
    } else if (text.startsWith('猫眼')) {
        href = "http://maoyan.com/query?kw=" + searchWord;
    } else if (text.startsWith('github')) {
        href = "https://github.com/search?utf8=%E2%9C%93&q=" + searchWord;
    } else if (text.startsWith('stackoverflow')) {
        href = 'https://stackoverflow.com/search?q=' + searchWord;
    }
    openUrlCurrentTab(href)
})

function getCurrentTabId(callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (callback) callback(tabs.length ? tabs[0].id : null)
    })
}

function openUrlCurrentTab(url) {
    getCurrentTabId((tabId) => {
        chrome.tabs.update(tabId, {url:url})
    })
}