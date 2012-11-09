#!/usr/bin/env node
var follow = require('follow')
  , nopt = require('nopt')
  , util = require('util')
  , pkg = require('../package.json')


//
// handle args
//
var known = { 'verbose': Boolean
            , 'help': Boolean
            , 'id': String
            }
  , shorts= { 'v': ['--verbose']
            , 'h': ['--help']
            }
  , parsed = nopt(known, shorts, process.argv)
  , help =  [ 'couchs v.'+pkg.version
            , ''+pkg.description
            , ''
            , 'usage:     couchs [options] [db]'
            , ''
            , 'db:        path to database (optional when using env vars.)'
            , ''
            , 'options:'
            , '   -v      show options'
            , '   -h      youre staring at it'
            , '   -id     filter this id (uses built-in filter)'
            , ''
            , 'environment variables: '
            , '   db,       path to database'
            , '   since,    "since" query param. since="now" is last checkpoint'
            , '   filter,   dynamic client-side filter.'
            , '   delim ,   document delimiter'
            ].join('\n')


//
// setup opts
//
var opts =  { db: parsed.argv.remain.shift() || process.env.db 
            , since: process.env.since || 'now'
            , filter: process.env.filter
            , include_docs: true
            // built-in _id filter.
            , filter: function (doc, req) {
                        if (parsed.id) {
                          if (doc._id === parsed.id) return true
                          else return false

                        } else {
                        return true
                        }
                      }
            }

var delim = '\r\n\n\n'
if (process.env.delim && process.env.delim.length > 0)
  delim = process.env.delim

if (process.env.filter && process.env.filter.length > 0) 
  opts.filter = process.env.filter

if (parsed.help) {
  console.log(help)
  process.exit(0)
}
if (!opts.db) {
  console.error('error: set db through args or env var "db"\n')
  console.log(help)
  process.exit(1)
}
if (parsed.verbose)   
  console.log(util.inspect(opts, false, null, true))


//
// main
//
follow(opts, function (er, change) {
  if (!er)
    process.stdout.write(JSON.stringify(change.doc)+delim)
})