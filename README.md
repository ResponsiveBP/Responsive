#Responsive
##A super lightweight HTML, CSS, and JavaScript framework for building responsive websites

###[Bootstrap](http://getbootstrap.com/) and [Foundation](http://foundation.zurb.com) are too heavy.


They're great for prototyping but every time you start a real, front-facing, project with them you have to overwrite lots of designer styles that do nothing to add to the functionality of the website. That's annoying!

**Responsive** has been built with that in mind. It has been specifically designed and coded to be as lightweight as possible to prevent the need to undo styles set by the framework itself and allow developers to write efficient code and speed up development time.

**Responsive** is tiny. The combined CSS and JavaScript is **only 20.3kb minified and gzipped** but there is a lot of functionality built into the framework. It's designed to be dropped-in, as-is to your website such as you would with [Normalize.css](http://necolas.github.io/normalize.css/).

Browser support covers IE8+ as well as all other modern browsers.

##Documentation

Responsives' documentation, included in the [gh-pages](https://github.com/ResponsiveBP/Responsive/tree/gh-pages) repo. It is built with [Jekyll](http://jekyllrb.com) and publicly hosted on GitHub Pages at [http://responsivebp.com](http://responsivebp.com). The docs may also be run locally.

1. If necessary, [install Jekyll](http://jekyllrb.com/docs/installation) (requires v1.x).
2. From the root `/Responsive` directory, run `jekyll serve --baseurl '' --watch` in the command line.

 - **Windows users:** For Ruby 2.0.0, run `chcp 65001` first. For Ruby 1.9.3, you can alternatively do `SET LANG=en_EN.UTF-8` first to change the command prompt's character encoding ([code page](http://en.wikipedia.org/wiki/Windows_code_page)) to `UTF-8` so Jekyll runs without errors.
 - Open [http://localhost:4000](http://localhost:4000) in your browser to view the compiled docs.


Learn more about using Jekyll by reading its [documentation](http://jekyllrb.com/docs/home/).

##Contributing

Contribution is most welcome, that's the whole idea! Together as a community we can build a boilerplate for building responsive sites that will ensure that high standards can be delivered across all devices.   

Please adhere to existing JavaScript and CSS styles though when submitting code and ensure that you test thoroughly on multiple devices, we don't want another Semicolongate ;)

##Building the CSS and Javascript

The build process for Responsive is powered by [gulpjs](http://gulpjs.com/). To build Responsive you will need to first install the required plugins using the following commands from the root `/Responsive` directory:

1. `npm install -g gulp` To install gulp globally.
2. `npm install` to install the necessary build dependencies based on the contents of the `package.json` file.

If you are adding new functionality to the build process use:

    npm install {your_new_build_dependency} --save-dev

There are three types of build available:

 1. `gulp` Compiles the framework to the **build** folder.
 2. `gulp watch` For debug purposes. Compiles the framework to the **build** folder and watches for further changes
 3. `gulp release` Compiles the framework to the **build** folder and zips up the build in the **dist** folder for release.

##Bugs and feature requests

Have a bug or a feature request? Please open a new [issue](https://github.com/JimBobSquarePants/Responsive/issues) or even better submit a pull request. Before opening any issue, please search for existing issues and read the Issue Guidelines, written by [Nicolas Gallagher](https://github.com/necolas/).

##Authors

James South [@james_m_south](http://twitter.com/james_m_south)

##Community

Follow [@responsivebp](http://twitter.com/responsivebp) on Twitter.

###Copyright and license

Copyright 2013 James South under the [MIT license](http://opensource.org/licenses/MIT).