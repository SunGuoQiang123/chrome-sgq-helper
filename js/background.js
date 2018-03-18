const cateList = ['movie', 'code'];
const cateItems = {
    movie: ['猫眼搜索', '豆瓣搜索'],
    code: ['github搜索', 'stackoverflow搜索']
}

chrome.omnibox.onInputChanged.addListener((text, suggest) => {
    console.log('input change is ', text);
    let searchInfo = getSearchInfo(text);
    searchInfo && showSuggestionList(searchInfo, suggest)
    // if (text.startsWith('movie')){
    //     suggest([
    //         // {content:'毒蛇', description: '打开毒蛇或用毒蛇搜索'},
    //         {content:'豆瓣搜索'+text.slice(6), description: '豆瓣搜索'+text.slice(6)},
    //         {content:'猫眼搜索'+text.slice(6), description: '猫眼搜索'+text.slice(6)}
    //     ])
    // } else if(text.startsWith('code')) {
    //     suggest([
    //         {content:'github搜索' + text.slice(5), description: 'github搜索' + text.slice(5)}
    //     ])
    // }
})

function getServerCate(text) {
    if (!text) {
        return;
    }
    text = text.toLowerCase();
    let cate = cateList.find(cate => text.startsWith(cate));
    let keyword = text.slice(cate.length);
    return cate ? {cate, keyword} : void 0;
}

function showSuggestionList(searchInfo, suggest) {
    for (key in cateItems) {
        if (cateItems.hasOwnProperty(key)) {
            if (key === searchInfo.cate) {
                suggest(cateItems[key].map(item => {
                    let displayContent = item + searchInfo.keyword;
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
        text = text.slice(4);
        href = 'https://movie.douban.com/subject_search?search_text=' + text + '&cat=1002';
    } else if (text.startsWith('猫眼')) {
        text = text.slice(4);
        href = "http://maoyan.com/query?kw=" + text;
    } else if (text.startsWith('github')) {
        text = text.slice(8);
        href = "https://github.com/search?utf8=%E2%9C%93&q=" + text;
    } else if (text.startsWith('stackoverflow')) {
        text = text.slice(15);
        href = 'https://stackoverflow.com/search?q=' + text;
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