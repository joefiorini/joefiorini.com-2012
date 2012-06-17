.PHONY: build css

css:
	mkdir -p css
	./node_modules/less/bin/lessc less/layout.css.less > css/layout.css
build: css
	mkdir -p build/css
	cp -r index.html images css build
deploy: build
	s3cmd sync build/* s3://www.joefiorini.com
