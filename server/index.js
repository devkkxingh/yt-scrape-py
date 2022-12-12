const { Builder, Browser, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs')




const screen = {
    width: 640,
    height: 480
};
(async function example() {
    let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(new chrome.Options().headless().windowSize(screen)).build();
    driver
    try {
        var youtube_data = []
        await driver.get('https://www.youtube.com/results?search_query=saurv+jhosi');

        while (true) {

            var end_result = await driver.findElement(By.id('message')).isDisplayed()
            console.log(end_result)
            await driver.executeScript("var scrollingElement = (document.scrollingElement || document.body);scrollingElement.scrollTop = scrollingElement.scrollHeight;")
            if (end_result == true)
                break
        }
        var results = await driver.findElements(By.css('.text-wrapper.style-scope.ytd-video-renderer'));

        console.log(results)
        console.log('Extracting results. It might take a while...')

        if (results.length > 0) {
            for (var i = 0; i < results.length; i++) {
                var data = {
                    title: await results[i].findElement(By.css('.title-and-badge.style-scope.ytd-video-renderer')).getText(),
                    link: await results[i].findElement(By.css('.title-and-badge.style-scope.ytd-video-renderer a')).getAttribute('href'),
                    channel_name: await results[i].findElement(By.css('.long-byline')).getText(),
                    channel_link: await results[i].findElement(By.css('#text > a')).getAttribute('href'),
                    views: await results[i].findElement(By.css('.style-scope ytd-video-meta-block')).getText(),
                }
                data.views = data.views.split(' ')[0];
                var postFix = data.views.charAt(data.views.length - 1)
                if (postFix) {
                    switch (postFix.toUpperCase()) {
                        case 'K':
                            data.views = Number(data.views.split('K')[0]) * 1000
                            break;
                        case 'M':
                            data.views = Number(data.views.split('M')[0]) * 1000000
                            break;
                        case 'B':
                            data.views = Number(data.views.split('B')[0]) * 1000000000
                            break;
                        default:
                            data.views = Number(data.views)
                            break;

                    }
                }
                console.log(data)
                youtube_data.push(data)

            }
            // results.forEach( (e) => {

            //     // {
            //     //     title: await e.findElement(By.css('.title-and-badge.style-scope.ytd-video-renderer')).getText(),
            //     //     link: await e.findElement(By.css('.title-and-badge.style-scope.ytd-video-renderer a')).getAttribute('href'),
            //     //     channel_name: await e.findElement(By.css('.long-byline')).getText(),
            //     //     channel_link: await e.findElement(By.css('#text > a')).getAttribute('href'),
            //     //     views: await e.findElement(By.css('.style-scope ytd-video-meta-block')).getText().split('\n')[0],
            //     // }

            // })
        }
        console.log(youtube_data)
        fs.writeFile('./data.json', JSON.stringify(youtube_data), err => {
            if (err) {
                console.log('Error writing file', err)
            } else {
                console.log('Successfully wrote file')
            }
        })


    } finally {
        await driver.quit();
    }
})();