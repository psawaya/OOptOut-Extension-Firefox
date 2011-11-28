const dataDir = require("self").data;
const pagemod = require("page-mod");


pagemod.PageMod({
  include: ["https://www.facebook.com/dialog/permissions.request*"],
  contentScriptFile: [dataDir.url("extension.js")]
});

console.log("The add-on is running.");
