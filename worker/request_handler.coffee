https = require 'https'
s3 = require './s3.coffee'
util = require 'util'

config = process.env

get_queue = ->
  options =
    host: 'api.github.com'
    path: "/users/#{config.GITHUB_USER}/gists?access_token=#{config.GITHUB_TOKEN}"
    method: 'GET'

  request = https.request options, (response) ->
    queue_string = ""
    response.on 'data', (chunk) ->
      queue_string += chunk
    response.on 'end', ->
      handle_queue(JSON.parse(queue_string))

  request.end()

  request.on 'error', (ee) ->
    console.log ee

handle_queue = (queue) ->
  #console.log(require('util').inspect(queue))
  queue.forEach (gist_obj, ii, _) ->
    get_gist gist_obj

get_gist = (gist_obj) ->
  options =
    host: 'api.github.com'
    path: "#{gist_obj.url}?access_token=#{config.GITHUB_TOKEN}"
    method: 'GET'

  console.log "Getting gist at: '#{options.path}'"

  gist_request = https.request options, (response) ->
    content = ""

    response.on 'data', (chunk) ->
      content += chunk

    response.on 'end', ->
      gist = JSON.parse content
      console.log "Gist is '#{util.inspect(gist)}'"
      console.log "New request: #{gist['files']['request.json'].content}"

  gist_request.end()

module.exports =
  get_queue: get_queue

