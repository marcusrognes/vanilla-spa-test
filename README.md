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
