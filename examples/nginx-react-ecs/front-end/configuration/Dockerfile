#!/usr/local/bin/docker

# -*- Coding: UTF-8 -*-
# -*- System: Linux -*-
# -*- Usage:   *.*  -*-

# Owner: Jacob B. Sanders
# Source: gitlab.cloud-technology.io
# License: BSD 3-Clause License

#
# Copyright 2021, Jacob B. Sanders - Cloud Hybrid LLC. & Affiliates
#
# Redistribution and use in source and binary forms, with or without modification, are permitted
# provided that the following conditions are met:
#
# 1.  Redistributions of source code must retain the above copyright notice, this list of
#     conditions and the following disclaimer.
#
# 2.   Redistributions in binary form must reproduce the above copyright notice, this list of
#      conditions and the following disclaimer in the documentation and/or other materials
#      provided with the distribution.
#
# 3.  Neither the name of the copyright holder nor the names of its contributors may be used
#     to endorse or promote products derived from this software without specific prior written
#     permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
# OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY
# AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER
# OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
# CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
# SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
# THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
# OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY
# OF SUCH DAMAGE.
#

FROM node:16-alpine

#
# =================================================================================================
# Node-JS Alpine Container Image
# =================================================================================================
#
# >>> npm install .
#
# >>> source .env.production || true
#
# >>> cat << EOF > .env
# ... PORT="${PORT:-8443}"
# ... HTTPS="${HTTPS:-false}"
# ... HOST="${HOST:-0.0.0.0}"
# ...
# ... FAST_REFRESH="${FAST_REFRESH:-false}"
# ...
# ... NODE_ENV="${NODE_ENV:-production}"
# ... BABEL_ENV="${BABEL_ENV:-production}"
# ...
# ... SCROLL_TRACKING="${SCROLL_TRACKING:-false}"
# ... GENERATE_SOURCEMAP="${GENERATE_SOURCEMAP:-true}"
# ... INLINE_RUNTIME_CHUNK="${INLINE_RUNTIME_CHUNK:-true}"
# ... ESLINT_NO_DEV_ERRORS="${ESLINT_NO_DEV_ERRORS:-true}"
# ... DISABLE_ESLINT_PLUGIN="${DISABLE_ESLINT_PLUGIN:-true}"
# ...
# ... SASS_PATH="${SASS_PATH:-node_modules:src}"
# ...
# ... SSL_CRT_FILE="${SSL_CRT_FILE}"
# ... SSL_KEY_FILE="${SSL_KEY_FILE}"
# ...
# ... ENVIRONMENT="${ENVIRONMENT:-Production}"
# ...
# ... REACT_APP_API="${REACT_APP_API:-localhost:3000}"
# ... REACT_APP_API_ENDPOINT="${REACT_APP_API_ENDPOINT:-https://localhost:3000}"
# ... REACT_APP_WS_ENDPOINT="${REACT_APP_WS_ENDPOINT:-wss://localhost:3000}"
# ... EOF
#
# >>> npm run build
#
# >>> docker build -t registry.cloud-technology.io/nexus/user-interface/dashboard . --file Dockerfile --no-cache
#
# >>> docker build --tag nexus-ui:latest . --file Dockerfile --no-cache
# >>> docker run --publish 8443:8443 nexus-ui:latest ? [--detach]
# >>> export CONTAINER_ID="$( docker run --publish 8443:8443 nexus-ui:latest ? [--detach] )"
# >>> docker logs "${CONTAINER_ID}"
#
# ... Accepting connections at http://localhost:8443
#
# Common Docker Commands
# -----------------------
# --> Building, Listing, & Running Container Image(s)
# >>> docker build --tag [Image-Tag-Name]/[Image-Version] [ "." || ? --file [File-Name] ]
#
# --> Listing Container Images
# >>> docker images
# ... REPOSITORY                            TAG        ID              CREATED
# ... [Image-Tag-Name]/[Image-Version]      latest     d64d3505b0d2    1 minute ago
#
# --> Starting the Container
# >>> export CONTAINER_ID="$( docker run --publish 3000:3000 --detach [Image-Tag-Name]/[Image-Version] )"
#
# --> Print Application Logs via Container ID
# >>> docker logs "${CONTAINER_ID}"
# ... "Running On http://localhost:3000/
#
# --> Accessing & Spawning a TTY within the Container
# >>> docker exec -it "${CONTAINER_ID}" /bin/bash
#
# --> Testing the Container & Application via Host
# >>> curl -i localhost:49160
#
# --> Stop the Container + Application
# >>> docker stop ${CONTAINER_ID}
#
# --> Prune the System of Containers
# >>> docker system prune --all --force
#
# --> Prune the System of Container Images
# >>> docker images purge --all
#

MAINTAINER Jacob B. Sanders <jacob.sanders@cloudhybrid.io>

ENV LANG C.UTF-8

ENV TITLE "\\n\\33[33m"
ENV EOM "\\33[0m\\n"

EXPOSE 8443

WORKDIR /Application

# -------------------------------------------------------------------------------------------------
# Base ALpine Setup
# -------------------------------------------------------------------------------------------------

RUN echo -e "Updating" \
    && apk update --verbose

RUN echo -e "Installing Packages" \
    && apk add build-base   \
        ca-certificates     \
        openssh             \
        bash                \
        curl                \
        tree                \
        zip                 \
        jq

# -------------------------------------------------------------------------------------------------
# NodeJS Container Image
# -------------------------------------------------------------------------------------------------

RUN echo -e "Checking Version & Installing NPM" \
    && node --version && apk add --no-cache npm --quiet --force

RUN echo -e "Updating NPM" \
    && npm install --global npm --upgrade || true

RUN echo -e "Installing Package-Management Dependencies" \
    && npm install --global yarn || true

RUN echo -e "Installing Production Web-Server" \
    && npm install --global serve || true

# - - - - - - - - -
# Cache & Clean-Up
# - - - - - - - - -

RUN echo -e "Removing Container Local-Cache" \
    && rm -rf /var/cache/apk/*

# - - - - - - - - - - - - - - - - - - -
# Container Entry-Point & Layer Cache
# - - - - - - - - - - - - - - - - - - -

RUN echo -e "Creating Application Directories" \
    && mkdir -p /Application

RUN echo -e "Copying Files from Host"

COPY build HTML

COPY configuration/*.key    tls.key
COPY configuration/*.crt    tls.crt
COPY configuration/*.json   server.json

CMD ["serve", "HTML", "--config", "server.json", "--ssl-cert", "tls.crt", "--ssl-key", "tls.key", "--listen", "tcp://0.0.0.0:8443", "--cors", "--no-clipboard", "--debug"]
