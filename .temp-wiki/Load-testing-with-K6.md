Load testing with [K6](https://k6.io/) is easy, and it involves these basic steps.
1. Install K6
2. Download script from nitro5 branch here (TBD) 
3. Run script
4. Analyze results.

## How to install K6
Follow the instructions are to be found here: https://k6.io/docs/get-started/installation/
Otherwise, open up a terminal window and run `winget install k6` 

## How to run K6
First get the default script from the nitro5 tree. This script is a template, and will have to be modified to your site's specific needs, but more on that in the analyze part. 

For now download the script into a folder `C:/temp/loadtests`

Edit the script.
First make sure that the VU:s is one, and that the duration is 30s or lower.
This determines how many virtual users and for how long the script will hammer the site. We want it to be low for now just to see that everything works out.

```javascript
export const options = {
  vus: 1, 
  duration: '30s',
};
```

Then, make sure that the hostname is correct
```javascript
const host = 'preprod.example.com';
```

Then below follows a number of project specific variables that will be of importance to your specific site, such as which products, categories, search words, campaigns and brands you want to do the test for. Make adjustments accordingly.

Open a terminal / command prompt and navigate to said folder here and enter the following command.

```console
k6 run load-test.js
```

It will now run the application

```console
          /\      |‾‾| /‾‾/   /‾‾/
     /\  /  \     |  |/  /   /  /
    /  \/    \    |     (   /   ‾‾\
   /          \   |  |\  \ |  (‾)  |
  / __________ \  |__| \__\ \_____/ .io

  execution: local
     script: k6_loadtest_ok.js
     output: -

  scenarios: (100.00%) 1 scenario, 1 max VUs, 1m0s max duration (incl. graceful stop):
           * default: 1 looping VUs for 30s (gracefulStop: 30s)


     ✓ Dynamic data - status 200
     ✓ ConversionEvent - status 200
     ✓ Quick search - status 200
     ✓ GetTrackingProducts - status 200
     ✓ Checkout update - status 200
     ✓ Product page - status 200
     ✓ Campaign page - status 200
     ✓ Search - status 200
     ✓ NotifyAddToCart - status 200
     ✓ AppShellData - status 200
     ✓ Previous searches - status 200
     ✓ Category page - status 200
     ✓ Brand page - status 200
     ✓ Checkout page - status 200
     ✓ CampaignOverview - status 200
     ✓ Start page - status 200

     checks.........................: 100.00% ✓ 80       ✗ 0
     data_received..................: 44 MB   1.4 MB/s
     data_sent......................: 113 kB  3.5 kB/s
     http_req_blocked...............: avg=2.04ms   min=0s      med=0s       max=184.24ms p(90)=0s       p(95)=0s
     http_req_connecting............: avg=285.75µs min=0s      med=0s       max=25.71ms  p(90)=0s       p(95)=0s
     http_req_duration..............: avg=352.97ms min=74.96ms med=341.43ms max=1.12s    p(90)=628.09ms p(95)=741.97ms
       { expected_response:true }...: avg=352.97ms min=74.96ms med=341.43ms max=1.12s    p(90)=628.09ms p(95)=741.97ms
     http_req_failed................: 0.00%   ✓ 0        ✗ 90
     http_req_receiving.............: avg=110.64ms min=0s      med=98.09ms  max=478.08ms p(90)=218.14ms p(95)=228.08ms
     http_req_sending...............: avg=199.93µs min=0s      med=0s       max=10.72ms  p(90)=509.63µs p(95)=519.07µs
     http_req_tls_handshaking.......: avg=597.66µs min=0s      med=0s       max=53.78ms  p(90)=0s       p(95)=0s
     http_req_waiting...............: avg=242.13ms min=74.67ms med=245.48ms max=876.5ms  p(90)=424.98ms p(95)=512.4ms
     http_reqs......................: 90      2.81253/s
     iteration_duration.............: avg=6.39s    min=5.7s    med=5.99s    max=7.94s    p(90)=7.4s     p(95)=7.67s
     iterations.....................: 5       0.156252/s
     vus............................: 1       min=1      max=1
     vus_max........................: 1       min=1      max=1
```

Done.

### What is load-testing?
The idea here is to make a stress test on the system to find breaking points and see how the application performs under load.

What load-testing is not:
* It is not a ux test - we cannot, easily reproduce button clicks and application flow. Use another tool for that such as cypress.
* It is not a ux test - we are not measuring Time To First Byte, Largest Contentful Paint etc. Use another tool for that such as lighthouse.
* It is not a coverage test - we are not doing an exhaustive test of all links on the site. 

Instead we are manually creating a heuristic test-suite that will mimic load on the site using anonymous users, with the intent of visiting endpoints in the same manner as a normal user would.

## How to make the pre-analysis 
The goal of the pre-analysis is to ensure that a model can be found that can be reproduced.
It will look something like this. 
* 25% of all calls goes to PLP
* 20% of all calls goes to PDP
* 10% of all calls goes to StartPage

And so on and so on. Do note that the list is a made up example and your site are probably showing something completely different.
There are a number of ways to find these type of things, but the suggested way is to go by application insights if that is available.

We have two metrics to go by in Application Insights, Page Views and Requests.
PageViews are good, because that tells us roughly what type of pages the visitor actually sees, but it doesn't equate to load. We can't just use the Page Views to create a load, for that we need to look at requests.
That said, we can use Page Views to decide which specific day to pick for sampling.

### Page Views

```kusto
pageViews
| where timestamp between (todatetime('2024-02-01T00:00:00Z')..todatetime('2024-02-28T00:00:00Z'))
| summarize sum(itemCount) by bin(timestamp, 1d)

```
Example out put would be.
![image](https://github.com/avensia/nitro5/assets/47972806/6f2712d3-ab55-40c9-ba38-33b86785c367)

From this image it looks like the fifth or nineteenth of February looks to be good candidates for analysis.


```kusto
pageViews
| where timestamp between (
todatetime('2024-02-05T00:00:00Z') 
..
todatetime('2024-02-06T00:00:00Z') 
)
| summarize sum(itemCount) by bin(timestamp, 1h)

And if we break this down into an hour graph we can see that it turns out to be roughly the same graph between the fifth and 19:th respectively.
```
![image-1](https://github.com/avensia/nitro5/assets/47972806/22f3eae3-074d-4a73-9ec2-70f73319cb5d)
![image-2](https://github.com/avensia/nitro5/assets/47972806/c69558d4-ee33-499d-8f5d-9ab81dcea0c1)


There can of course be bot traffic, and other outliers that causes this, but for simplicitys sake take the peak hour on the 19th as our working example.

```kusto
pageViews
| where timestamp between (
todatetime('2024-02-19T08:00:00Z') 
..
todatetime('2024-02-19T09:00:00Z') 
)
| summarize sum(itemCount) by bin(timestamp, 10m)

```
![image-3](https://github.com/avensia/nitro5/assets/47972806/751bab4f-a45c-4f17-bd87-2ad69c955267)

Now let's get a rough breakdown on what types of pages we are looking at. This might wary wildly between your site and the site we're comparing to, but since most applications use the same type of product in the bottom they will probably be similar to what you'll have.
We're entering a bit more esoteric rituals on the site, but here's the custo:

```kusto
pageViews
| where timestamp between (
todatetime('2024-02-19T08:00:00Z') 
..
todatetime('2024-02-19T09:00:00Z') 
)
| summarize total=sum(itemCount) 
by bin(timestamp, 1h), 
tostring(customDimensions.pageType)
|order by total desc 

```


![image-4](https://github.com/avensia/nitro5/assets/47972806/4aa38852-4e71-4ccd-b9c6-294896fdfada)

Now is a good time to look at the results you got, do they make sense?
We can see here that the PDP and the PLPS take up the lion-share of the pages visited.

### Requests
Now, to translate this into something we can use, we should instead focus on the requests, as these are much easier for us to translate into a load.

This is almost the same query as before, but we summarize it by name instead of the customDimension.pageType.

```kusto
requests
| where timestamp between (todatetime('2024-02-19T08:00:00Z') .. todatetime('2024-02-19T09:00:00Z') )
|summarize total=sum(itemCount) by bin(timestamp, 1h), name
|order by total desc 
```
![image-5](https://github.com/avensia/nitro5/assets/47972806/d6f1034d-cd5f-4d42-926d-9d0829b3d8cb)


We can see here that the number of requests are significantly higher than the number of pageviews, we naturally see that there are several system-calls that we don't usually track as a page view, such as calls to assets, and resolved dynamic data. You will also find images and calls from the episerver cms and updates to background queues. We'll have to apply some discretion to this to get what we want. 

In this case I will leave some of the calls out to make sense of it all, and this is why the load test won't make a full scale test, but the next best thing.

Here's the export button, and you can export the list to Excel for easier manipulation and filtering.
![image-6](https://github.com/avensia/nitro5/assets/47972806/1ac4ee09-75e7-4c9d-a01f-cc81ade0c95a)

After som Excel-Fu and or similar skills we can end up with a percentage / weight for each calls, and we can reproduce these requests, we should be able to with some confidence say that we have a model that works.

![image-7](https://github.com/avensia/nitro5/assets/47972806/39274e16-02c3-4a25-82ba-73093f294de6)

So the goal on from here on will be to make a script that looks like this

* For 100 calls, 
    * hit the dynamic data 26 times, 
    * product page 15 times,
    * a category page 14 times
    * ...
    
In addition, we should sustain this load for an hour at `265 000 / 3600 ~= 73.6` Requests Per Second, or at least a spike that matches this, given equivalent machinery.

## How to edit the script

If you used the method mentioned above, the idea is to make the script into something that looks like this

```javascript
export default function () {
   getAnyProduct(25%)
   getProductList(15%)
   getCategoryList(14%)
   postLoginPage(0.2%)
   // ... ad nauseum
   Sleep(1000ms)
}
```

Now there are several caveats to the list above. Appshelldata should be even more fine-grained for instance. We probably shouldn't hammer the same PDP and PLP over and over. The checkout page might have further restrictions on items added to the cart and so on. Not all of these are solved in the pre-existing script but some of them are.

### Common Variables

At the top of the file are a number of important variables.

```javascript
export const options = {
  vus: 1, // Number of virtual users.
  duration: '30s', // Test duration.
};

// The hostname
const host = 'preprod.example.com';

// The pinCode if active 
const pinCode = "1234";
```


### Cookies
If you need to set a cookie, such as the pincode, here's how that's done.
```javascript
function setPinCodeCookie(pinCode) {
  const jar = http.cookieJar();
  jar.set(`https://${host}`, 'auth', pinCode, {
    domain: host,
    path: '/',
    secure: true,
    max_age: 600,
  });
}
```