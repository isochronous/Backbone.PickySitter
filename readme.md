# Backbone.Picky

Selectable entities as mixins for Backbone.Views in a Backbone.BabySitter ChildViewContainer!

## Source Code And Downloads

You can download the raw source code from the "src" folder above, or grab one of the builds from the "lib" folder. To get the latest stable release, use these links which point to the 'master' branch's builds:

### Standard Builds

Development: [backbone.pickysitter.js](https://raw.github.com/isochronous/Backbone.PickySitter/master/lib/backbone.pickysitter.js)

Production: [backbone.picky.min.js](https://raw.github.com/isochronous/Backbone.PickySitter/master/lib/backbone.picky.min.js)

### AMD/RequireJS Builds

Development: [backbone.pickysitter.js](https://raw.github.com/isochronous/Backbone.PickySitter/master/lib/amd/backbone.pickysitter.js)

Production: [backbone.picky.min.js](https://raw.github.com/isochronous/Backbone.PickySitter/master/lib/amd/backbone.picky.min.js)

## Documentation

This readme file contains basic usage examples and details on the full API, including methods, attributes and events.

## Method Name Overrides

## View and Container Interactions

If you implement a `Selectable` view, the methods on the views and the
`MultiSelect` container will keep each other in sync. That is, if you
call `view.select()` on a view, the container will be notified of the
view being selected and it will correctly update the `selectedLength` and
fire the correct events.

Therefore, the following are functionally the same:

```js
view = new MyView();
col = new MyContainer([view]);

view.select();
```

```js
view = new MyView();
col = new MyContainer([view]);

col.select(view);
```

### View Requirements For Picky Containers

Your view for a Picky container must implement the following API to be
usable by the selection methods and functionality:

* `select: function(){...}`
* `deselect: function(){...}`

The easiest way to do this is to have your view extend `Selectable`. You
can, however, implement your own version of these methods.

## Backbone.Picky's Components:

* **Picky.Selectable:** Creates select / deselect capabilities for a view
* **Picky.MultiSelect:** Allows a container to know about the selection of multiple views, including select all / deselect all
* **Picky.SingleSelect:** Allow a container to have an exclusively selected view

## Picky.Selectable

Creates selectable capabilities for a view, including tracking whether or
not the view is selected, and raising events when selection changes.

```js
var selectable = new Backbone.PickySitter.Selectable(myView);
```

### Basic Usage

Extend your view with the `Selectable` instance to make your view
selectable directly.

```js
SelectableView = Backbone.View.extend({
  initialize: function(){
    var selectable = new Backbone.PickySitter.Selectable(this);
    _.extend(this, selectable);
  }
});
```

### Selectable Methods

The following methods are included in the `Selectable` object

#### Selectable#select

Select a view, setting the view's `selected` attribute to true and triggering a "select" event.

```js
var myView = new SelectableView();

myView.on("select", function(){
  console.log("I'm selected!");
});

myView.select(); //=> logs "I'm selected!"
myView.selected; //=> true
```
#### Selectable#deselect

Deselect a view, setting the view's `selected` attribute to false and triggering a "deselect" event.

```js
var myView = new SelectableView();

myView.on("deselect", function(){
  console.log("I'm no longer selected!");
});

// must select it before it can be deselected
myView.select();

myView.deselect(); //=> logs "I'm no longer selected!";
myView.selected; //=> false
```

#### Selectable#toggleSelected

Toggles the selection state between selected and deselected by calling
the `select` or `deselect` method appropriately.

```js
var myView = new SelectableView();

myView.on("select", function(){
  console.log("I'm selected!");
});

myView.on("deselect", function(){
  console.log("I'm no longer selected!");
});

// toggle selection
myView.toggleSelected(); //=> "I'm selected!"
myView.toggleSelected(); //=> "I'm no longer selected!"
```

### Selectable Attributes

The following attributes are manipulated by the Selectable object

#### Selectable#selected

Returns a boolean value indicating whether or not the view is
currently selected.

### Selectable Events

The following events are triggered from Selectable views

#### "selected"

Triggers when a view is selected. 

#### "deselected"

Triggers when a view is deselected.

## Picky.SingleSelect

Creates single-select capabilities for a `Backbone.ChildViewContainer`, allowing a single view to be exclusively selected within the container. Selecting another view will cause the first one to be deselected.

```js
var singleSelect = new Backbone.PickySitter.SingleSelect(myContainer) ;
```

### Basic Usage

Extend your container with the `SingleSelect` instance to make your container support exclusive selections directly.

```js
SelectableView = Backbone.View.extend({
  initialize: function(){
    var selectable = new Backbone.PickySitter.Selectable(this);
    _.extend(this, selectable);
  }
});

SingleContainer = Backbone.ChildViewContainer.extend({
  view: SelectableView,

  initialize: function(){
    var singleSelect = new Backbone.PickySitter.SingleSelect(this);
    _.extend(this, singleSelect);
  }
});
```

### SingleSelect Methods

The following methods are provided by the `SingleSelect` object.

#### SingleSelect#select(view)

Select a view. This method will store the selected view in the container's `selected` attribute, and call the view's `select` method to ensure the view knows it has been selected.

```js
myView = new SelectableView();
myCont = new MultiContainer();
myCont.select(myView);
```

Or

```js
myView = new SelectableView();
myCont = new MultiContainer([myView]);
myView.select();
```

If the view is already selected, this is a no-op. If a previous view is already selected, the previous view will be deselected.

#### SingleSelect#deselect(view)

Deselect the currently selected view. This method will remove the view from the container's `selected` attribute, and call the view's `deselect` method to ensure the view knows it has been deselected.

```js
myView = new SelectableView();
myCont = new MultiContainer();
myCont.deselect(myView);
```

Or

```js
myView = new SelectableView();
myCont = new MultiContainer();
myView.deselect();
```

If the view is not currently selected, this is a no-op. If you try to
deselect a view that is not the currently selected view, the actual
selected view will not be deselected.

### SingleSelect Attributes

The following attribute is set by the multi-select automatically

### SingleSelect#selected

Returns the one selected view for this container

```js
myCont = new MultiContainer();
myCont.select(view);

myCont.selected; //=> view
```

### SingleSelect Events

The following events are triggered by the MultiSelect based on changes in selection:

#### "selected"

Triggered when a view has been selected. Provides the selected view as the first parameter.

#### "deselected"

Triggered when a view has been deselected. Provides the deselected view as the first parameter.

This fires whether `deselect` has been called explicitly, or the selection is being replace through another call to `select`.

## Picky.MultiSelect

Creates multi-select capabilities for a `Backbone.ChildViewContainer`, including select all, select none and select some features.

```js
var multiSelect = new Backbone.PickySitter.MultiSelect(myContainer) ;
```

### Basic Usage

Extend your container with the `MultiSleect` instance to make your container support multiple selections directly.

```js
SelectableView = Backbone.View.extend({
  initialize: function(){
    var selectable = new Backbone.PickySitter.Selectable(this);
    _.extend(this, selectable);
  }
});

MultiContainer = Backbone.ChildViewContainer.extend({
  
  view: SelectableView,

  initialize: function(){
    var multiSelect = new Backbone.PickySitter.MultiSelect(this);
    _.extend(this, multiSelect);
  }
});
```
### MultiSelect Methods

The following methods are provided by the `MultiSelect` object

#### MultiSelect#select(view)

Select a view. This method will store the selected view in the container's `selected` list, and call the view's `select` method to ensure the view knows it has been selected.

```js
myCont = new MultiContainer();

myCont.select(myView);
```

If the view is already selected, this is a no-op.

#### MultiSelect#deselect(view)

Deselect a view. This method will remove the  view from the container's `selected` list, and call the view's `deselect` method to ensure the view knows it has been deselected.

```js
myCont = new MultiContainer();

myCont.deselect(myView);
```

If the view is not currently selected, this is a no-op.

#### MultiSelect#selectAll

Select all views in the container.

```js
myCont = new MultiContainer();

myCont.selectAll();
```

Views that are already selected will not be re-selected. Views that are not currently selected will be selected. The end result will be all views in the container are selected.

#### MultiSelect#deselectAll

Deselect all views in the container.

```js
myCont = new MultiContainer();

myCont.deselectAll();
```

Views that are selected will be deselected. Views that are not selected will not be deselected again. The end result will be no views in the container are selected.

#### MultiSelect#toggleSelectAll

Toggle selection of all views in the container:

```js
myCont = new MultiContainer();

myCont.toggleSelectAll(); // select all views in the container

myCont.toggleSelectAll(); // de-select all views in the container
```

The following rules are used when toggling:

* If no views are selected, select them all
* If 1 or more views, but less than all views are selected, select them all
* If all views are selected, deselect them all

### MultiSelect Attributes

The following attribute is set by the multi-select automatically

### MultiSelect#selected

Returns a hash of selected views, keyed from the view's `cid`.

```js
myCont = new MultiContainer();
myCont.select(view);

myCont.selected;

//=> produces
// {
//   "c1": (view object here)
// }
```

#### MultiSelect#selectedLength

Returns the number of items in the container that are selected.

```js
myCont = new MultiContainer();
myCont.select(view);

myCont.selectedLength; //=> 1
```

### MultiSelect Events

The following events are triggered by the MultiSelect based on changes
in selection:

#### "select:all"

Triggered when all views have been selected

#### "select:none"

Triggered when all views have been deselected

#### "select:some"

Triggered when at least 1 view is selected, but less than all views have
been selected

## Building Backbone.PickySitter

If you wish to build Backbone.PickySitter on your system, you will need Ruby to run the Jasmine specs, and NodeJS to run the grunt build. 

### To Run The Jasmine Specs

1. Don't even try, they haven't been updated since this worked on models and collections

### To Build The Packages

1. Be sure you have NodeJS and NPM installed on your system

2. Run `npm install -g grunt` to install the grunt build system

3. From the project folder, run `grunt` to produce a build

## Release Notes

### v0.0.1

* Refactored [Backbone.Picky] to work on Views contained in a Backbone.ChildViewContainer

## Legal Mumbo Jumbo (MIT License)

Copyright (c) 2012 Jeremy McLeod, Isochronous.org

Huge thanks to Derick Bailey of Muted Solutions LLC, from whose code this library is almost entirely based.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
