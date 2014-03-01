
## Development commands

 - Bootstrap: `git submodule update --init; npm install`
 - Run tests: `(cd netlocal-spec; rspec)`
 - Build: `find lib -name "*.js" -print0 | xargs -0 js-beautify -r`
 - Run: `./bin/netlocal`
