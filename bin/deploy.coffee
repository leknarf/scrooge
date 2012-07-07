#!/usr/bin/env coffee

aws = require 'aws2js'
crypto = require 'crypto'
fs = require 'fs'
mime = require 'mime'
util = require 'util'
walkdir = require 'walkdir'

ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
BUCKET_NAME = process.env.BUCKET_NAME
RESULTS_DIR = process.env.RESULTS_DIR

SITE_DIR = process.env.SITE_DIR
DEPLOY_DIR = process.cwd() + '/' + process.env.DEPLOY_DIR

fetch_bucket_contents = (bucket, callback) ->
  bucket.get '?prefix=', 'xml', (error, data) ->
    if error?
      console.log util.inspect(error)
    else
      callback(entry for entry in data.Contents)

remote_path = (local_filepath) ->
  local_filepath.split(DEPLOY_DIR + '/')[1]

upload_files = (bucket_list) ->
  calculate_local_hash = (string) ->
    crypto.createHash('md5').update(string).digest('hex')

  file_updated = (local_path) ->
    remote_key = (key for key in bucket_list \
                   when key.Key == remote_path(local_path))[0]
    remote_hash = remote_key.ETag.replace(/"/g, "") if remote_hash?
    local_hash = calculate_local_hash(fs.readFileSync(local_path))
    remote_hash != local_hash

  walkdir.walk(DEPLOY_DIR).on 'file', (local_path, stat) ->
    _remote_path = remote_path(local_path)
    if file_updated(local_path)
      console.log "Uploading:\t#{_remote_path}"
      fs.readFile local_path, (error, file_data) ->
        buffer = new Buffer(file_data, 'utf8')
        mime_type = mime.lookup(local_path)
        s3.putBuffer _remote_path, buffer, 'public-read', {'content-type': mime_type}, (error, result) ->
          if error
            console.log "There was an error uploading: '#{local_path}' to '#{_remote_path}'"
            console.log util.inspect(error)
    else
      console.log "No changes detected:\t#{_remote_path}"

delete_files = (bucket_list) ->
  ignore_dir = (dir_name, keys) ->
    regex = /^[^#{dir_name}]/
    key for key in keys when key.Key.search(regex) >= 0

  delete_file = (s3_key) ->
    filename = DEPLOY_DIR + '/' + s3_key.Key
    fs.stat filename, (error, stats) ->
      if error?.code == 'ENOENT'
        console.log "Deleting #{s3_key.Key}"
        s3.del s3_key.Key, (error, result) ->
          console.log error if error

  remote_files = ignore_dir(RESULTS_DIR, bucket_list)
  delete_file(filename) for filename in remote_files

deploy = () ->
  console.log "Deploying site in: #{DEPLOY_DIR}"
  fetch_bucket_contents s3, (bucket_list) ->
    delete_files(bucket_list)
    upload_files(bucket_list)

s3 = aws.load('s3', ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
s3.setBucket('scrooge.leknarf.net')
deploy(s3)
