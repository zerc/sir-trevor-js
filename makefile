SHELL = /bin/bash
BIN  := ./node_modules/.bin

.PHONY: setup
setup:
	npm install

# SASS
STYLESRC   = ./src/sass/main.scss
STYLEOUT   = ./build/sir-trevor.css
STYLEFLAGS = --output-style compressed $(STYLESRC) $@
STYLEOBJ   = $(STYLESRC) $(wildcard ./src/sass/**/*.js ./src/sass/*.js)

# JS
SCRIPTSRC   = ./index.js
SCRIPTOUT   = ./build/sir-trevor.js
SCRIPTDEBUG = ./build/sir-trevor.debug.js
SCRIPTMIN   = ./build/sir-trevor.min.js
SCRIPTFLAGS = $(SCRIPTSRC) $@ --config ./.webpackconfig.js
SCRIPTOBJ   = $(SCRIPTSRC) $(wildcard ./src/**/*.js ./src/*.js)

# Banner
BANNERTMP = ./banner.tmp
define BANNER
"/*\n\
  * Sir Trevor JS v`./$(BIN)/mversion | sed -n -e 's/^.*package\.json: //p'`\n\
  *\n\
  * Released under the MIT license\n\
  * www.opensource.org/licenses/MIT\n\
  *\n\
  * `date +%Y-%m-%d`\n\
  */"
endef

$(BANNERTMP):
	echo -e $(BANNER) > $@

# Build SASS
$(STYLEOUT): $(STYLEOBJ)
	@$(BIN)/node-sass $(STYLEFLAGS)
	@$(BIN)/autoprefixer $@

.PHONY: styles
styles: $(STYLEOUT)

# Build JS
$(SCRIPTOUT): $(SCRIPTOBJ) $(BANNERTMP)
	@$(BIN)/webpack $(SCRIPTFLAGS)
	@cat $(BANNERTMP) $@ > tmp.js && mv tmp.js $@

.PHONY: js
js: $(SCRIPTOUT)

# Build debug JS
$(SCRIPTDEBUG): $(SCRIPTOBJ) $(BANNERTMP)
	$(BIN)/webpack $(SCRIPTFLAGS) --debug
	@cat $(BANNERTMP) $@ > tmp.debug.js && mv tmp.debug.js $@

.PHONY: debug
debug: $(SCRIPTDEBUG)

# Build minified JS
$(SCRIPTMIN): $(SCRIPTOUT) $(BANNERTMP)
	@cat $(BANNERTMP) <($(BIN)/uglifyjs $<)> $@

.PHONY: uglify
uglify: $(SCRIPTMIN)

.PHONY: scripts
scripts: js debug uglify clean

.PHONY: jshint
jshint:
	@$(BIN)/jshint --config .jshintrc $(SCRIPTOBJ)

.PHONY: karma
karma:
	node_modules/karma/bin/karma start .karmaconfig.js

.PHONY: clean
clean:
	rm $(BANNERTMP)

.PHONY: test
test: jshint karma

.PHONY: build
build: test styles scripts banner

.PHONY: dev
dev: styles $(SCRIPTDEBUG) clean
