#!/bin/bash

# Delete movies aged of more than 1.

find /tmp/hypertube/ -type f -atime +30 -exec rm {} \;
echo "Inactive movies for 1 month were sucesfully removed."
