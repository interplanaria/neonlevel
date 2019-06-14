const { planaria } = require("neonplanaria")
const level = require('level')
const L = require('interlevel')
const path = require('path');
var kv;
planaria.start({
  filter: {
    "from": 586700,
    "q": {
      "find": { "out.s1": "1LtyME6b5AnMopQrBPLk4FGN8UBuhxKqrn" },
      "project": { "out": 1 }
    }
  },
  onstart: function(e) {
    kv = level('kv', { valueEncoding: 'json' });
    L.server({ db: kv, port: 28334 })
  },
  onmempool: function(e) {
    kv.put(e.tx.tx.h, e.tx, async function(err) {
      if (err) console.log(err)
    })
  },
  onblock: async function(e) {
    console.log("onblock", e.height)
    e.tx.forEach(function(t) {
      kv.put(t.tx.h, t, function(err) {
        if (err) console.log(err)
      })
    })
  }
})
