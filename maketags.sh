#! /bin/bash
cd ~/dev/nashorn-repl
find lib test bower_components -name '*.js' | ack -v min | xargs /usr/local/bin/ctags -e
