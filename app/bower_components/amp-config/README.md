# High Level Description

Angular services declaring different environment configurations.

## Issues
<ul> 
	<li>unintuitive integration steps</li>
	<li>total lack of unit and integration tests</li>
</ul>

This repo is for distribution on `bower`. The source for this module is in the
[main Prototyping repo](https://gitorious.poc.currdc.net/prototyping/amp-config/source).
Please file issues and pull requests against that repo.

## Install

TODO

Add a `<script>` to your `index.html`:

```html
<script src="/bower_components/amp-config/amp-config.js"></script>
```

And add one of the `ampConfig`s as a dependency for your app:

```javascript
angular.module('myApp', ['ampConfigProduction']);
```

or

```javascript
angular.module('myApp', ['ampConfigDeveloper']);
```

Each module implements a different configuration, which can all be accessed within your application through the same service 'ampConfig'

angular.service('someService', ['ampConfig', function(ampConfig) {
	...	
}])

## Documentation

TODO

## License

TODO