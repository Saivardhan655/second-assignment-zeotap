#!/usr/bin/env bash

TIMEOUT=15
WAITFORIT_CMD=""

usage() {
    echo "Usage: $0 host:port [-t timeout] [-- command args]"
    exit 1
}

while [[ $# -gt 0 ]]; do
    case "$1" in
        -t)
            TIMEOUT="$2"
            shift 2
            ;;
        *)
            WAITFORIT_CMD="$@"
            break
            ;;
    esac
done

if [[ -z "$1" ]]; then
    usage
fi

HOST_PORT="$1"
HOST=$(echo "$HOST_PORT" | cut -d ':' -f 1)  # Use cut to get the host
PORT=$(echo "$HOST_PORT" | cut -d ':' -f 2)  # Use cut to get the port

echo "Waiting for $HOST_PORT..."

SECONDS=0
while ! nc -z "$HOST" "$PORT"; do
    sleep 1
    if [[ $SECONDS -ge $TIMEOUT ]]; then
        echo "Timeout after $TIMEOUT seconds."
        exit 1
    fi
done

echo "$HOST_PORT is available."

if [[ -n "$WAITFORIT_CMD" ]]; then
    exec "${WAITFORIT_CMD[@]}"
fi
