// browsers for local testing with WTR
const DefaultBrowsers = ['chrome', 'firefox', 'safari'];

// BrowserStack browsers
const BrowserStack = {
  defaultBrowsers: DefaultBrowsers,
  supportedBrowsers: [
    'chrome', 'firefox', 'safari', 'edge',
    // 'chrome_minus1', 'edge_minus1', 'firefox_minus1' // exclude temporary to prevent unicode problem on version 109
    // 'chrome_minus2', 'edge_minus2', 'firefox_minus2' // exclude temporary to prevent unicode problem on version 109
    'safari_minus1',
    'safari_minus2',
    'ios',
    'android',
    'samsung',
    'ios_minus1',
    'android_minus1',
    'samsung_minus1',
    'ios_minus2',
    'android_minus2',
    'samsung_minus2'
  ],
  availableBrowsers: [
    'default', // default browsers alias
    'supported' // supported browsers alias
  ]
};
// combine default, supported & aliases into complete available browsers
// CLI param would be validated with this list of browsers
BrowserStack.availableBrowsers = [
  ...BrowserStack.supportedBrowsers,
  ...BrowserStack.availableBrowsers,
];

// base platform config
const deviceConfig = { real_mobile: 'true'};
const windowsConfig = { os: 'Windows', os_version: '11' };
const macOSConfig = { os: 'OS X' };

// BrowserStack Browsers Config
BrowserStack.config = {
  // Latest versions
  chrome: { ...windowsConfig, browser: 'chrome', browser_version: 'latest' },
  firefox: { ...windowsConfig, browser: 'firefox', browser_version: 'latest' },
  edge:   { ...windowsConfig, browser: 'edge',   browser_version: 'latest' },
  safari: { ...macOSConfig, browser: 'safari', os_version: 'Ventura' },

  // minus1 versions
  chrome_minus1: { ...windowsConfig, browser: 'chrome', browser_version: 'latest-1' },
  firefox_minus1: { ...windowsConfig, browser: 'firefox', browser_version: 'latest-1' },
  edge_minus1:   { ...windowsConfig, browser: 'edge',   browser_version: 'latest-1' },
  safari_minus1: { ...macOSConfig, browser: 'safari', os_version: 'Monterey' },

  // minus2 versions
  chrome_minus2: { ...windowsConfig, browser: 'chrome', browser_version: 'latest-2' },
  firefox_minus2: { ...windowsConfig, browser: 'firefox', browser_version: 'latest-2' },
  edge_minus2:   { ...windowsConfig, browser: 'edge',   browser_version: 'latest-2' },
  safari_minus2: { ...macOSConfig, browser: 'safari', os_version: 'Big Sur' },

  // Mobile Devices
  ios:     { ...deviceConfig, browser: 'iphone',  device : 'iPhone 14',          os: 'ios',     os_version : '16' },
  android: { ...deviceConfig, browser: 'android', device : 'Google Pixel 6',     os: 'android', os_version : '12.0' },
  samsung: { ...deviceConfig, browser: 'samsung', device : 'Samsung Galaxy S22', os: 'android', os_version : '12.0' },

  // Mobile Devices minus1 versions
  ios_minus1:     { ...deviceConfig, browser: 'iphone',  device : 'iPhone 13',          os: 'ios',     os_version : '15' },
  android_minus1: { ...deviceConfig, browser: 'android', device : 'Google Pixel 5',     os: 'android', os_version : '11.0' },
  samsung_minus1: { ...deviceConfig, browser: 'samsung', device : 'Samsung Galaxy S21', os: 'android', os_version : '11.0' },

  // Mobile Devices minus2 versions
  ios_minus2:     { ...deviceConfig, browser: 'iphone',  device : 'iPhone 12',          os: 'ios',     os_version : '14' },
  android_minus2: { ...deviceConfig, browser: 'android', device : 'Google Pixel 4',     os: 'android', os_version : '10.0' },
  samsung_minus2: { ...deviceConfig, browser: 'samsung', device : 'Samsung Galaxy S20', os: 'android', os_version : '10.0' }
};

export {
  DefaultBrowsers,
  BrowserStack
}