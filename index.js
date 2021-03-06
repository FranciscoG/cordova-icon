'use strict';
var fs     = require('fs-extra');
var path   = require('path');
var xml2js = require('xml2js');
var ig     = require('imagemagick');
var colors = require('colors');
var _      = require('underscore');
var argv   = require('minimist')(process.argv.slice(2));

/**
 * @var {Object} settings - names of the config file and of the icon image
 */
var settings = {};
settings.ICON_FILE = argv.icon || 'icon.png';
settings.PLATFORM = argv.platform || 'all';
settings.TARGET = argv.target || './icons'

/**
 * Check which platforms are added to the project and return their icon names and sizes
 *
 * @return {Promise} resolves with an array of platforms
 */
var setPlatforms = function () {
  var platforms = [];
  var targetPath = settings.TARGET;

  platforms.push({
    name : 'ios',
    iconsPath : targetPath + '/ios',
    icons : [
      { name: 'icon-20.png',             size : 20   },
      { name: 'icon-20@2x.png',          size : 40   },
      { name: 'icon-20@3x.png',          size : 60   },
      { name: 'icon-40.png',             size : 40   },
      { name: 'icon-40@2x.png',          size : 80   },
      { name: 'icon-50.png',             size : 50   },
      { name: 'icon-50@2x.png',          size : 100  },
      { name: 'icon-60@2x.png',          size : 120  },
      { name: 'icon-60@3x.png',          size : 180  },
      { name: 'icon-72.png',             size : 72   },
      { name: 'icon-72@2x.png',          size : 144  },
      { name: 'icon-76.png',             size : 76   },
      { name: 'icon-76@2x.png',          size : 152  },
      { name: 'icon-83.5@2x.png',        size : 167  },
      { name: 'icon-1024.png',           size : 1024 },
      { name: 'icon-small.png',          size : 29   },
      { name: 'icon-small@2x.png',       size : 58   },
      { name: 'icon-small@3x.png',       size : 87   },
      { name: 'icon.png',                size : 57   },
      { name: 'icon@2x.png',             size : 114  },
      { name: 'AppIcon24x24@2x.png',     size : 48   },
      { name: 'AppIcon27.5x27.5@2x.png', size : 55   },
      { name: 'AppIcon29x29@2x.png',     size : 58   },
      { name: 'AppIcon29x29@3x.png',     size : 87   },
      { name: 'AppIcon40x40@2x.png',     size : 80   },
      { name: 'AppIcon44x44@2x.png',     size : 88   },
      { name: 'AppIcon86x86@2x.png',     size : 172  },
      { name: 'AppIcon98x98@2x.png',     size : 196  }
    ]
  });
  platforms.push({
    name : 'android',
    iconsPath : targetPath + '/android',
    icons : [
      { name : 'drawable/icon.png',       size : 96 },
      { name : 'drawable-hdpi/icon.png',  size : 72 },
      { name : 'drawable-ldpi/icon.png',  size : 36 },
      { name : 'drawable-mdpi/icon.png',  size : 48 },
      { name : 'drawable-xhdpi/icon.png', size : 96 },
      { name : 'drawable-xxhdpi/icon.png', size : 144 },
      { name : 'drawable-xxxhdpi/icon.png', size : 192 },
      { name : 'mipmap-hdpi/icon.png',  size : 72 },
      { name : 'mipmap-ldpi/icon.png',  size : 36 },
      { name : 'mipmap-mdpi/icon.png',  size : 48 },
      { name : 'mipmap-xhdpi/icon.png', size : 96 },
      { name : 'mipmap-xxhdpi/icon.png', size : 144 },
      { name : 'mipmap-xxxhdpi/icon.png', size : 192 }
    ]
  });
  platforms.push({
    name : 'osx',
    iconsPath : targetPath + '/osx',
    icons : [
      { name : 'icon-16x16.png',    size : 16  },
      { name : 'icon-32x32.png',    size : 32  },
      { name : 'icon-64x64.png',    size : 64  },
      { name : 'icon-128x128.png',  size : 128 },
      { name : 'icon-256x256.png',  size : 256 },
      { name : 'icon-512x512.png',  size : 512 }
    ]
  });
  platforms.push({
    name : 'windows',
    iconsPath : targetPath + '/windows',
    icons : [
      { name : 'StoreLogo.scale-100.png', size : 50  },
      { name : 'StoreLogo.scale-125.png', size : 63  },
      { name : 'StoreLogo.scale-140.png', size : 70  },
      { name : 'StoreLogo.scale-150.png', size : 75  },
      { name : 'StoreLogo.scale-180.png', size : 90  },
      { name : 'StoreLogo.scale-200.png', size : 100 },
      { name : 'StoreLogo.scale-240.png', size : 120 },
      { name : 'StoreLogo.scale-400.png', size : 200 },

      { name : 'Square44x44Logo.scale-100.png', size : 44  },
      { name : 'Square44x44Logo.scale-125.png', size : 55  },
      { name : 'Square44x44Logo.scale-140.png', size : 62  },
      { name : 'Square44x44Logo.scale-150.png', size : 66  },
      { name : 'Square44x44Logo.scale-200.png', size : 88  },
      { name : 'Square44x44Logo.scale-240.png', size : 106  },
      { name : 'Square44x44Logo.scale-400.png', size : 176 },

      { name : 'Square71x71Logo.scale-100.png', size : 71  },
      { name : 'Square71x71Logo.scale-125.png', size : 89  },
      { name : 'Square71x71Logo.scale-140.png', size : 99 },
      { name : 'Square71x71Logo.scale-150.png', size : 107 },
      { name : 'Square71x71Logo.scale-200.png', size : 142 },
      { name : 'Square71x71Logo.scale-240.png', size : 170 },
      { name : 'Square71x71Logo.scale-400.png', size : 284 },

      { name : 'Square150x150Logo.scale-100.png', size : 150 },
      { name : 'Square150x150Logo.scale-125.png', size : 188 },
      { name : 'Square150x150Logo.scale-140.png', size : 210 },
      { name : 'Square150x150Logo.scale-150.png', size : 225 },
      { name : 'Square150x150Logo.scale-200.png', size : 300 },
      { name : 'Square150x150Logo.scale-240.png', size : 360 },
      { name : 'Square150x150Logo.scale-400.png', size : 600 },

      { name : 'Square310x310Logo.scale-100.png', size : 310  },
      { name : 'Square310x310Logo.scale-125.png', size : 388  },
      { name : 'Square310x310Logo.scale-140.png', size : 434  },
      { name : 'Square310x310Logo.scale-150.png', size : 465  },
      { name : 'Square310x310Logo.scale-180.png', size : 558  },
      { name : 'Square310x310Logo.scale-200.png', size : 620  },
      { name : 'Square310x310Logo.scale-400.png', size : 1240 },

      { name : 'Wide310x150Logo.scale-80.png', size : 248, height : 120  },
      { name : 'Wide310x150Logo.scale-100.png', size : 310, height : 150  },
      { name : 'Wide310x150Logo.scale-125.png', size : 388, height : 188  },
      { name : 'Wide310x150Logo.scale-140.png', size : 434, height : 210  },
      { name : 'Wide310x150Logo.scale-150.png', size : 465, height : 225  },
      { name : 'Wide310x150Logo.scale-180.png', size : 558, height : 270  },
      { name : 'Wide310x150Logo.scale-200.png', size : 620, height : 300  },
      { name : 'Wide310x150Logo.scale-240.png', size : 744, height : 360  },
      { name : 'Wide310x150Logo.scale-400.png', size : 1240, height : 600 }
    ]
  });

  if (settings.PLATFORM === 'all') {
    return Promise.resolve(platforms);
  } else {
    // filter platforms
    // TODO: filter before we get to this point
    let activePlatforms = _(platforms).where({ name : settings.PLATFORM });
    return Promise.resolve(activePlatforms);
  }
};

/**
 * @var {Object} console utils
 */
var display = {};
display.success = function (str) {
  str = '✓  '.green + str;
  console.log('  ' + str);
};
display.error = function (str) {
  str = '✗  '.red + str;
  console.log('  ' + str);
};
display.header = function (str) {
  console.log('');
  console.log(' ' + str.cyan.underline);
  console.log('');
};


/**
 * Resizes, crops (if needed) and creates a new icon in the platform's folder.
 *
 * @param  {Object} platform
 * @param  {Object} icon
 * @return {Promise}
 */
var generateIcon = function (platform, icon) {
  var srcPath = settings.ICON_FILE;
  var platformPath = srcPath.replace(/\.png$/, '-' + platform.name + '.png');
  if (fs.existsSync(platformPath)) {
    srcPath = platformPath;
  }
  var dstPath = platform.iconsPath + icon.name;
  var dst = path.dirname(dstPath);
  if (!fs.existsSync(dst)) {
    fs.mkdirsSync(dst);
  }
  return new Promise(function(resolve,reject){
    ig.resize({
      srcPath: srcPath,
      dstPath: dstPath,
      quality: 1,
      format: 'png',
      width: icon.size,
      height: icon.size
    } , function(err, stdout, stderr){
      if (err) {
        reject(err);
      } else {
        resolve();
        display.success(icon.name + ' created');
      }
    });
    if (icon.height) {
      ig.crop({
        srcPath: srcPath,
        dstPath: dstPath,
        quality: 1,
        format: 'png',
        width: icon.size,
        height: icon.height
      } , function(err, stdout, stderr){
        if (err) {
          reject(err);
        } else {
          resolve();
          display.success(icon.name + ' cropped');
        }
      });
    }
  });
};

/**
 * Generates icons based on the platform object
 *
 * @param  {Object} platform
 * @return {Promise}
 */
var generateIconsForPlatform = function (platform) {
  display.header('Generating Icons for ' + platform.name);
  var all = [];
  var icons = platform.icons;
  icons.forEach(function (icon) {
    all.push(generateIcon(platform, icon));
  });
  return Promise.all(all);
};

/**
 * Goes over all the platforms and triggers icon generation
 *
 * @param  {Array} platforms
 * @return {Promise}
 */
var generateIcons = function (platforms) {
  var all = [];
  platforms.forEach(function (platform) {
    all.push(generateIconsForPlatform(platform));
  });
  return Promise.all(all);
};

/**
 * Checks if a valid icon file exists
 *
 * @return {Promise} resolves if exists, rejects otherwise
 */
var validIconExists = function () {
  return new Promise(function(resolve, reject){
    fs.exists(settings.ICON_FILE, function (exists) {
      if (exists) {
        display.success(settings.ICON_FILE + ' exists');
        resolve();
      } else {
        display.error(settings.ICON_FILE + ' does not exist');
        reject();
      }
    });
  });
};


display.header('Checking Project & Icon');

validIconExists()
  .then(setPlatforms)
  .then(generateIcons)
  .catch(function (err) {
    if (err) {
      console.log(err);
    }
  }).then(function () {
    console.log('');
  });
