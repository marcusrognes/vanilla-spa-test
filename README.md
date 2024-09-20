# Vanilla SPA Test

## Getting Started:

`npx live-server --port=3000 --entry-file=./index.html`

## How it functions

This is designed to be a simple proof of concept, testing if one can recreate the simple routing and component workflows that make react so easy to use as a spa framework.

There is no dependencies, and should run on all browsers

The backbone of this test is the browsers buildt in `customElements.define("element-name", ElementClass);`

### Simple routing:

```html
<main>
  <a-route cache pattern="/" src="/assets/routes/home.html"></a-route>
  <a-route
    cache
    pattern="/persons/"
    src="/assets/routes/persons.html"
  ></a-route>
  <a-route
    cache
    pattern="/persons/:personId/"
    src="/assets/routes/person.html"
  ></a-route>
</main>
```

The a-route element is designed to fetch the file in src and apply any parameters found in the pattern

For the "/persons/:personId/" route, this will load the "/\_/routes/person.html" file and replace any {{personId}} found within.

The person.html file can then use the personId parameter like this:

`person.html`

```html
<h1>{{personId}}</h1>

<script>
  (() => {
    const personId = "{{personId}}";
    console.log(personId);
  })();
</script>
```

script tags also work


### Simple components

```html
<a-component src="/assets/components/reusable.html" title="Hello, World" sub-title="This works." text="Some more props and stuff"></a-component>

<div>
  <a-component src="/assets/components/person-details.html" personId="1"></a-component>
</div>

<div>
  <a-component src="/assets/components/person-details.html" personId="2"></a-component>
</div>
```

Components can be nested, they can pass props to eachother and they rerender when props change.

## This site

[index.html](index.html) has the routes and imports to js and css files.

it links to the 3 route files that are loaded when needed.

- [home.html](/assets/routes/home.html)
- [person.html](/assets/routes/person.html)
- [persons.html](/assets/routes/persons.html)

These implement some components

Take [home.html](/assets/routes/home.html) for example

it implements the [person-details.html](/assets/components/person-details.html) component and gives it personId`s.

Routes and components can be nested.
