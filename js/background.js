const cateList = ['movie', 'code'];
const cateItems = {
    movie: ['猫眼搜索', '豆瓣搜索'],
    code: ['github搜索', 'stackoverflow搜索']
}
let searchWord = ''

const default_url = _.template('https://www.baidu.com/s?ie=UTF-8&wd=${value}');
let site_urls = {
    '豆瓣': _.template('https://movie.douban.com/subject_search?search_text=${value}&cat=1002'),
    '猫眼': _.template('http://maoyan.com/query?kw=${value}'),
    'github': _.template('https://github.com/search?utf8=%E2%9C%93&q=${value}'),
    'stackoverflow': _.template('https://stackoverflow.com/search?q=${value}')
}

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
    for (key in site_urls) {
        if (site_urls.hasOwnProperty(key) && text.startsWith(key)) {
             href = site_urls[key]({'value': searchWord})
        }
    }
    // openUrlNewTab(href ? href : default_url({'value': searchWord}));
    openUrlCurrentTab(href ? href : default_url({'value': searchWord}))
})

function openUrlNewTab(url) {
    chrome.tabs.create({url: url})
}

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