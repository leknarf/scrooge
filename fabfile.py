import os

import boto
from fabric.api import local, env

env.BUCKET_NAME = 'scrooge.leknarf.net'
env.SITE_DIR = '.'
env.DEPLOY_DIR = os.path.join(env.SITE_DIR, 'deploy')

# Requires the $AWS_ACCESS_KEY_ID and $AWS_SECRET_ACCESS_KEY environment variables
s3_conn = boto.connect_s3()
bucket = s3_conn.get_bucket(env.BUCKET_NAME)

def _keys_and_paths():
    paths = [ os.path.join(path, file_name)
              for path, _, files in os.walk(env.DEPLOY_DIR)
              for file_name in files]
    keys_and_paths = [(os.path.relpath(path, env.DEPLOY_DIR), path) for path in paths]
    return keys_and_paths

def clean_local():
    local('rm -rf {DEPLOY_DIR}'.format(**env))

def clean_bucket(exclude_list=None):

    # By default, don't delete remote files that are still present locally
    if exclude_list is None:
        exclude_list=[k[0] for k in _keys_and_paths()]

    for key in bucket.list():
        if key.key not in exclude_list:
            key.delete()

def _upload():
    for remote_key, local_path in _keys_and_paths():
        key = bucket.get_key(remote_key) or bucket.new_key(remote_key)
        with open(local_path, 'rb') as _file:
            local_md5 = key.compute_md5(_file)[0]
            remote_md5 = key.etag
            if remote_md5 is None or local_md5 != remote_md5.strip('"'):
                print("{remote_key}:\tUploading".format(**locals()))
                key.set_contents_from_filename(local_path, policy='public-read')
            else:
                print("{remote_key}:\tNo changes detected".format(**locals()))

def deploy():
    clean_bucket()
    local('node client/node_modules/browserify/bin/cmd.js client/js/node/sha.js -o client/js/sha.js')
    local('ln -s demo deploy')
    _upload()
    local('rm deploy')
