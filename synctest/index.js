(function(o,p,r,c,l){"use strict";async function f(){const i={themes:[],plugins:[]};for(const t of Object.values(c.plugins)){var s;const a=(s=vstorage.pluginSettings)===null||s===void 0?void 0:s[t.id];if(a?.syncPlugin===!1)continue;const e=a?.syncStorage===!1?{}:await r.createMMKVBackend(t.id).get();i.plugins.push({id:t.id,enabled:t.enabled,options:e})}for(const t of Object.values(l.themes))i.themes.push({id:t.id,enabled:t.selected});return i}async function g(i){var s;if(!i)return;const t=[...i.sync.plugins.filter(function(n){return!c.plugins[n.id]&&canImport(n.id)&&options.unproxiedPlugins}),...i.sync.plugins.filter(function(n){return!c.plugins[n.id]&&canImport(n.id)&&options.plugins})],a=i.sync.themes.filter(function(n){return!l.themes[n.id]&&options.themes});if(!t[0]&&!a[0])return;const e={plugins:0,themes:0,failed:0};await Promise.all([...t.map(async function(n){try{await p.setItem(n.id,JSON.stringify(n.options)),e.plugins++}catch{e.failed++}}),...a.map(async function(n){try{e.themes++}catch{e.failed++}})]);const u=l.themes[(s=a.find(function(n){return n.enabled}))===null||s===void 0?void 0:s.id];u&&await r.createFileBackend("vendetta_theme.json").set(Object.assign(u,{selected:!0})),console.log(`Finished! Imported ${e.plugins} plugins and ${e.themes} themes. ${e.failed?`Failed to import ${e.failed} plugins/themes`:"All imports were successful"}`)}return o.grabEverything=f,o.importData=g,o})({},d,vendetta.storage,vendetta.plugins,vendetta.themes);
