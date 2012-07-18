# node-cdbtail

A super simple couchdb CLI change stream.

## Installation
``` bash
  $ git clone https://github.com/snbartell/node-cdbtail.git
  $ cd node-cdbtail; npm install
```

## Usage
```
  $ cdbtail -h
  cdbtail [options] [db]
  db:        path to database (optional when using env vars.)  

  options:  
     -v      show options  
     -h      youre staring at it  

  environment variables:   
     db,     path to database  
     since,  "since" query param. since="now" is last checkpoint  
     filter, dynamic client-side filter.
```  

### Environment Variables
setting environment vars is easy:  
``` bash
  $ db="http://localhost:5984/mydb"
  $ export db
```
then
``` bash
  $ cdbtail
```