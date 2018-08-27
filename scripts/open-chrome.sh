unamestr=`uname`
url='http://localhost:3007'

if [[ "$unamestr" == 'Linux' ]]; then
   `google-chrome --remote-debugging-port=9222 $url`
elif [[ "$unamestr" == 'Darwin' ]]; then
   `/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug $url`
fi