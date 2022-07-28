FROM postgres:12.3-alpine

RUN apk --no-cache add curl python3 which bash su-exec && \
    curl -sSL https://sdk.cloud.google.com > /tmp/gcl && \
    bash /tmp/gcl --install-dir=/usr/local/bin --disable-prompts && \
    rm -rf /tmp/gcl

RUN ["chmod", "u+s", "/sbin/su-exec"]
