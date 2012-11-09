# node-couchs

Follow.js based, bare-naked couchdb change stream to stdout.

## Installation
``` bash
  $ git clone https://github.com/snbartell/node-couchs.git
  $ cd node-couchs; npm install
```

## Usage
```
  $ couchs -h
  usage:     couchs [options] [db]

  db:        path to database (optional when using env vars.)

  options:
     -v      show options
     -h      youre staring at it
     -id     filter this id (uses built-in filter)

  environment variables: 
     db,       path to database
     since,    "since" query param. since="now" is last checkpoint
     filter,   dynamic client-side filter.
     delim ,   document delimiter
```  

### Environment Variables

use the env

``` bash
    export db="http://localhost:5984/mydb"
    export delim='\r\n\n'
```
then
``` bash
  $ couchs
```

### Use with node-jsdiff

The only reason I made couchs is to have something to pump a couch change stream into a json-differ.

Something like this:

``` json
    {
        transports: [
            [
                {
                    type: 'mongo',
                    active: true,
                    id: 'mongolog',
                    filter: { infoOnly: 'function(message){}' },
                    collection: 'log',
                    port: 27017,
                    database: 'log',
                    host: 'localhost'
                }
            ]
        ],
        active: [ true ],
        channel: [ 'log' ],
        _id: [ 'loggerjs.config' ],
        port: [ 6379 ],
        _rev: [ '90-0d0125d81e7aa982e7fffbad2efe6c31' ],
        host: [ 'localhost' ]
    }
    {
        _rev: [ '90-0d0125d81e7aa982e7fffbad2efe6c31', '91-7e6f3df88c7085b8433c281d91313c65' ]
    }
    {
        _rev: [ '91-7e6f3df88c7085b8433c281d91313c65', '92-a8dfbb16601126f7b0a1d84bd79b3b52' ]
    }
    {
        transports: {
            0: {
                active: [ true, false ]
            },
            _t: 'a'
        },
        _rev: [ '92-a8dfbb16601126f7b0a1d84bd79b3b52', '93-8c43ee44b87ae007d725802ed0015fc7' ]
    }
```

There are four changes here.  

1. The first change is shown as a full document. Reason is becuase it is diffed against and empty json doc `{}`

2. The second change shows the `_rev` changed from `90-0...` to `91-7...`.

3. The third change is telling me the revision bumped again.

4. The fourth change is saying that the rev bumped and the first item in the transports list had property `active` go from true to false.  Dont mind the `_t`, its a hidden property.

So heres how to do it:

install jsdiff:

``` bash
    git clone https://github.com/snbartell/node-jsondiff.git
    cd node-jsdiff
    npm link
```

couchs and jsdiff work together when they both know the same document delimiter. jsdiff expects the delim to be `\r\n\n\n`. So set the couchs env var for delim:

``` bash
    export delim='\r\n\n\n'
```

You can give the database path as an arg to couchs, or set the db env var. I like to set env vars.

``` bash
    export db="http://user:pass@localhost:5984/database" 
```

... or something like that

Finally, pipe couchs into jsdiff:

``` bash
    couchs | jsdiff
```