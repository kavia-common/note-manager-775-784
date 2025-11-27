#!/bin/bash
cd /tmp/kavia/workspace/code-generation/note-manager-775-784/frontend_react_app
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

