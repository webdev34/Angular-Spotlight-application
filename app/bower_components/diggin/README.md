# Description

This repository is a starting point for AngularJS based projects.

Included:

* Vagrant as a way to package all development dependencies inside a virtual machine. See [www.vagrantup.com](http://docs.vagrantup.com/v2/)
* [Gulp](https://github.com/gulpjs/gulp/blob/master/docs/README.md) as a build tool.
* [AngularJS](https://docs.angularjs.org/guide), [Lodash](http://lodash.com/docs), and [Foundation](http://foundation.zurb.com/docs/).


# Quick start

Install VirtualBox, Ansible, and Vagrant.

### New project only

Fork this repository **on Gitorious** taking care to rename the project to something meaningful.  
Assuming that you named your forked project `fantastish-app` run:

```
$ git clone git@.../fantastish-app fantastish-app
$ cd fantastish-app
$ vagrant up
$ vagrant ssh
vagrant@...$ cd /vagrant
vagrant@...$ npm install
vagrant@...$ gulp init --app-name myFantastishApp --title "Fantastish Thingamagits"
``` 

### Working on a project

```
$ vagrant up
$ vagrant ssh
vagrant@...$ cd /vagrant
vagrant@...$ npm install
vagrant@...$ bower install
vagrant@...$ gulp dev
```
Use your brower to navigate to the address that you see in the output.

`gulp dev` puts you into a development loop:

* Live compiling sass.
* Linting js files.
* Reloading any open browsers and syncing events between the different instances.


### Creating a build

```
$ vagrant up
$ vagrant ssh
vagrant@...$ cd /vagrant
vagrant@...$ gulp build
```
This step creates a `build` directory that is ready for deployment to your web server.

### Important notes

* Run all `npm`, `bower`, `gulp`, and similar tasks inside the vagrant virtual machine!  
**DO NOT** use your host machine binaries to interact with the project files, perform all tasks after running `vagrant ssh`.
* **DO NOT** modify the virtual machine state using it's shell. Add any system wide dependencies required by your project into the ansible playbook (`ansible/playbook.yml`) then run `vagrant provision`.
* Remember to run `npm install` and `bower install` after fetching from remote to install missing dependencies.
* Look at `gulpfile.js` for a list of available gulp tasks.
* Optimize for development (include non-minified versions of libraries in your pages). Minification will happen when you run `gulp build`.
* By default, we chose to include bundled Foundation JavaScript and it's dependencies. You should review these dependencies (jQuery, Modernizr, Fastclick, and foundation.js itself.)

### Report any issues to [`prototyping`](https://jira.poc.wgennc.net/browse/PROTO) on Jira, or by contacting [Nick Zalutskiy](nzalutskiy@amplify.com) or [Dan Fast](dfast@amplify.com).

# Project structure

* Project root contain the various configuration files. 
* `app` contains your entire application, including assets. 
* Put all js under `app/js`,  
all WebWorkers under `app/js/workers` (WebWorkers require unique build steps),  
all scss under `app/scss`, and  
all images in `app/images`, or subdirectories thereof.
* `Libsass` will generate `app/css` for you, do not edit this directory by hand and do not commit it to the repository.

### The million little files

* `Vagrantfile` and `ansible/playbook.yml` - Together contain the cononical definition for the entire development environment. 
* `package.json` - This is a nodejs package definition file. Howerver, note that we do not have a `name` nor `version` field in this file. We are using it purely to fetch dependencies needed for the development process. Namely, gulp, its plugins, and related node packages.
* `bower.json` - List the client side dependencies of your applications. Normally files from these packages are included in your `index.html` and, as a result, bundled with your application when you do `gulp build`.
* `.bowerrc` - Simply tels bower that we want the `bower_components` folder to be placed under `app` and not at the root of the project (the default location.)
* `.jshintrc` - Contains `jshint` rules for our codebase. When you have `gulp dev` running, pay attention to the output. Any time that you save a js file, jshint will run and warn you about any JavaScript gotchas. Some of these rules may seem arbitrary, but there are very specific reasons behind each one.
* `gulpfile.js` - Contains build, dev, and other tasks. Add your own tasks as your project necessitates, `gulp deploy` for example.

# Tooling explained

* `Vagrant` - Is a way to package the developemnt environment as part of the repository. This eliminates variation between developer machines, significantly reduces ramp up time, and ensures that the project can always be compiled on a new machine. Vagrant accomplishes this task by spinning up a fresh virtual machine, installing all system and project dependencies into it, setting up a shared folder into your cloned repository and tunneling a port to the host machine. As a result you can run `vagrant up` and have an entire dev environment, while still using your favorite editor and browser for development. For provisioning we use:
* `Ansible` - Automation and configuration management tool. Ansible expects a "playbook" as input. A playbook defines what a machine *should* look like, what system depenencies should exist, what configuration files should look like, etc. Ansible "magically" matches the machines state to what is defined in said playbook.
* `Gulp` - A simple build tool based entirely on nodejs streams. It was chosen for it's simplicity and [approchable source code](https://github.com/gulpjs/gulp), compared to grunt. You need to understand [Stream](http://nodejs.org/api/stream.html)s to understand why it works.
* `Bower` - You can think of it as a "package downloader," it doesn't do much beyond that. Bower will download packages and their dependencies and place them under `app/bower_components`. You have to manually include, in `index.html`, any scripts and styles that you'd like to use from these packages. See `index.html` for examples (Angular, jQuery, Foundation, etc. are managed using `bower`.)
* `Foundation` - Grid system, control styles, optional JS-enabled controls, decent default typography, media queries, and other goodies. Chosen for fast UI prototyping. Foundation is similar to Bootstrap in spirit, but easier to customize down the line, and works well with:
* `Sass` - The only true way (aka. one of two) to write modern CSS.
* `jshint` - If you use the bundled `lint-js`, `build`, or `dev` tasks, you'll get helpful messages that will save your blank. However, we encourage you to configure your editor to lint your js code whenever you save a Javascript file. `syntastic` + globally installed `jshint` is a good choice for `vim`, for example.
* `browser-sync` - If you use the bundled `dev` task you will have access to an address (such as `10.10.5.5:3002`). You can visit this address on any device and see a live updating version of your work as soon as you save a file. Morever, all events on one device (such as click, scroll, etc.) are propagated to all other devices.
* `Uglify` + `imagemin` - Optimize/minify your javascript and images, respectively. There are only executed during the `build` task.
* `lodash` - Use it. Allows you to use functional constructs (such as `map`, `reduce`, `filter`, `pluck`, and many others) in JavaScript. We encourage you to use these tools and to not optimize for performance prematurely. Using lodash results in much more readable and maintainable code.
* `AngularJS` - Two-way binding (and kitchen sink) framework. Wires your data to your UI, among other things.
* `jQuery` - Most of the time you should look to AngularJS for a solution to your UI wiring needs. When you do need to manipulate the DOM directly, jQuery is the de-facto choice.




