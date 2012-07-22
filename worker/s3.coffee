aws = require 'aws2js'
sha = require 'sha1'

AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME

module.exports =
  post: post_response

post_response = (request, response) ->
  s3 = aws.load 's3', AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
  s3.setBucket(AWS_BUCKET_NAME)

  request_hash = sha request
  s3.putBuffer "results/#{request_hash}.json",
    new Buffer(response, 'utf8'),
    'public-read',
    'content-type': 'text/javascript',
    (error, result) ->
      console.log(error) if error
