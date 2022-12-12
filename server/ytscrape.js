// const puppeteer = require('puppeteer');

// async function scrapeYoutubeSearch(query) {
//     // Launch a new instance of the Chrome browser
//     const browser = await puppeteer.launch();

//     // Open a new page in the browser
//     const page = await browser.newPage();

//     // Navigate to the YouTube search page
//     await page.goto(`https://www.youtube.com/results?search_query=${query}`);

//     // Wait for the page to load and the videos to appear
//     await page.waitForSelector('.yt-lockup-video');

//     // Evaluate the page and extract the data for each video
//     const data = await page.evaluate(() => {
//         // Create an array to store the data for each video
//         const data = [];

//         // Loop through all the videos on the page
//         document.querySelectorAll('.yt-lockup-video').forEach(video => {
//             // Extract the title, views, and channel name for the video
//             const title = video.querySelector('.yt-lockup-title > a').title;
//             const views = video.querySelector('.yt-lockup-meta-info').innerText;
//             const channel = video.querySelector('.yt-lockup-byline > a').innerText;

//             // Add the data for the video to the array
//             data.push({ title, views, channel });
//         });

//         // Return the array of data
//         return data;
//     });

//     // Close the browser
//     await browser.close();

//     // Return the extracted data
//     return data;
// }

// // Scrape the search results for the query "cat videos"
// scrapeYoutubeSearch('cat videos').then(data => {
//     // Print the data for each video to the console
//     data.forEach(video => {
//         console.log(`Title: ${video.title}`);
//         console.log(`Views: ${video.views}`);
//         console.log(`Channel: ${video.channel}`);
//         console.log('\n');
//     });
// });


const { Builder, By, until } = require('selenium-webdriver');

async function scrapeYoutubeSearch(query) {
    // Launch a new instance of the Chrome browser
    const driver = new Builder()
        .forBrowser('chrome')
        .build();

    try {
        // Navigate to the YouTube search page
        await driver.get(`https://www.youtube.com/results?search_query=${query}`);

        // Wait for the page to load and the videos to appear
        await driver.wait(until.elementLocated(By.css('.yt-lockup-video')));

        // Create an array to store the data for each video
        const data = [];

        // Keep scrolling down the page until all the videos have been loaded
        while (true) {
            // Extract the data for each video on the page
            const videos = await driver.findElements(By.css('.yt-lockup-video'));
            for (let i = 0; i < videos.length; i++) {
                // Extract the title, views, and channel name for the video
                const title = await videos[i].findElement(By.css('.yt-lockup-title > a')).getAttribute('title');
                const views = await videos[i].findElement(By.css('.yt-lockup-meta-info')).getText();
                const channel = await videos[i].findElement(By.css('.yt-lockup-byline > a')).getText();

                // Add the data for the video to the array
                data.push({ title, views, channel });
            }

            // Scroll down to the bottom of the page to load more videos
            await driver.executeScript('window.scrollTo(0, document.body.scrollHeight)');

            // Check if there are any more videos to load
            const moreVideos = await driver.findElements(By.css('#watch-more-related'));
            if (moreVideos.length === 0) {
                break;
            }

            // Click the "Show more" button to load more videos
            await moreVideos[0].click();

            // Wait for the new videos to load
            await driver.wait(until.elementLocated(By.css('.yt-lockup-video')));
        }

        // Return the array of data
        return data;
    } finally {
        // Close the browser
        await driver.quit();
    }
}

// Scrape the search results for the query "cat videos"
scrapeYoutubeSearch('saurav jhosi').then(data => {
    // Print the data for each video to the console
    data.forEach(video => {
        console.log(`Title: ${video.title}`);
        console.log(`Views: ${video.views}`);
        console.log(`Channel: ${video.channel}`);
        console.log('\n');
    });
});
