const katex = require("katex"); const items = require(process.argv[2]); let bad = 0;
for (const [where, t] of items) { try { katex.renderToString(t, { throwOnError: true }); } catch (e) { bad++; console.log(where, "|", t, "|", e.message.slice(0, 90)); } }
console.log(items.length, "expressions,", bad, "bad");
