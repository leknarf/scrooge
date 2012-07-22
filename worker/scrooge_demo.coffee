express = require 'express'
request_handler = require './request_handler.coffee'

app = module.exports = express.createServer()

app.listen 3000, ->
  console.log "Scrooge worker listening on port #{app.address().port}"
  request_handler.get_queue()
