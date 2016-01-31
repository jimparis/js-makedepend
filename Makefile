.SUFFIXES: .js .css .html
GIT=git
GIT_CURRENT_BRANCH=$(shell utl/get_current_git_branch.sh)
GIT_DEPLOY_FROM_BRANCH=master
NPM=npm
MAKEDEPEND=bin/js-makedepend --exclude "node_modules|fixtures" --system cjs

.PHONY: help dev-build install deploy-gh-pages check stylecheck fullcheck mostlyclean clean noconsolestatements consolecheck lint cover prerequisites static-analysis test update-dependencies run-update-dependencies depend

help:
	@echo
	@echo " -------------------------------------------------------- "
	@echo "| More information and other targets: see README.md      |"
	@echo " -------------------------------------------------------- "
	@echo

# production rules

# "phony" targets
prerequisites:
	$(NPM) install

dev-build: bin/js-makedepend $(ALL_SRC) package.json

lint:
	$(NPM) run lint

stylecheck:
	$(NPM) run jscs

cover: dev-build
	$(NPM) run cover

bump-patch:
	$(NPM) version patch

bump-minor:
	$(NPM) version minor

bump-major:
	$(NPM) version major

tag:
	$(GIT) tag -a v`utl/getver` -m "v`utl/getver`"
	$(GIT) push --tags

publish:
	$(GIT) push
	$(GIT) push --tags
	$(NPM) publish

mirrors: .git/refs/remotes/bitbucket-mirror .git/refs/remotes/gitlab-mirror
	$(GIT) remote add bitbucket-mirror git@bitbucket.org:sverweij/js-makedepend.git
	$(GIT) remote add gitlab-mirror https://gitlab.com/sverweij/js-makedepend.git

push-mirrors: mirrors
	$(GIT) push bitbucket-mirror
	$(GIT) push gitlab-mirror

static-analysis:
	$(NPM) run plato

test: dev-build
	$(NPM) run test

nsp:
	$(NPM) run nsp

outdated:
	$(NPM) outdated

update-dependencies: run-update-dependencies dev-build test
	$(GIT) diff package.json
	
run-update-dependencies: 
	$(NPM) run npm-check-updates
	$(NPM) install

noconsolestatements:
	@echo "scanning for console statements (run 'make consolecheck' to see offending lines)"
	grep -r console src/* | grep -c console | grep ^0$$
	@echo ... ok

consolecheck:
	grep -r console src/*

check: noconsolestatements lint stylecheck test
	
fullcheck: check outdated nsp
	
depend:
	$(MAKEDEPEND) src/cli.js
	$(MAKEDEPEND) --append --flat-define ALL_SRC src/cli.js
	$(MAKEDEPEND) --append test

sinopia:
	sinopia

# DO NOT DELETE THIS LINE -- js-makedepend depends on it.

# cjs dependencies
src/cli.js: \
	src/chewy.js

src/chewy.js: \
	src/core.js \
	src/utl.js

src/core.js: \
	src/utl.js

# cjs dependencies
ALL_SRC=src/cli.js \
	src/chewy.js \
	src/core.js \
	src/utl.js
# cjs dependencies
test/chewy.spec.js: \
	src/chewy.js \
	test/utl/testutensils.js

test/core.spec.js: \
	src/core.js

