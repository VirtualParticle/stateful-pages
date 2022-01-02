# Stateful Pages

[![npm version](https://badge.fury.io/js/stateful-pages.svg)](https://www.npmjs.com/package/stateful-pages)

A simple and lightweight library for state management.

## How to use

Put the Stateful Pages script tag at the bottom of the `body`, but before your JavaScript code.

```html
<html lang="en">

<body>

<!-- Body -->

<script src="path/to/stateful/pages"></script>
<script src="path/to/your/code"></script>
</body>

</html>
```

To use Stateful Pages, wrap your code inside a `<stateful>` tag.

```html
<stateful>
    <h1>Stateful Pages!</h1>
</stateful>
```

Each `<stateful>` tag works independently, so there can be multiple tags per page, but you can also just put the entire
page within one tag.

## State

This is where the work is done. Everything works based on the values within the state. To set values in the state,
use `setState()` from the `stateful` tag.

```javascript
const stateful = document.getElementById("stateful-root");
const { setState } = stateful;

setState({
    foo: "bar",
});
```

Getting values within the state is done using the `state` object from the tag.

```javascript
const stateful = document.getElementById("stateful-root");
const { state, setState } = stateful;

setState({
    foo: "bar",
});

console.log(state.foo); // "bar"
```

## Values

To use a value in the page, use the `<value>` tag.

```html
<stateful id="stateful-root">
    <p>The value is
        <value name="foo"></value>
    </p>
</stateful>

<script>
    const stateful = document.getElementById("stateful-root");
    const { state, setState } = stateful;

    setState({
        foo: "bar",
    });
</script>
```

This will render out to

```html
<p>The value is bar</p>
```

### Updating values

This will produce a button with a counter

```html
<stateful id="stateful-root">
    <button id="button">Click me!</button>
    Presses:
    <value name="presses"></value>
</stateful>

<script>
    const stateful = document.getElementById("stateful-root");
    const { state, setState } = stateful;

    setState({
        presses: 0,
    });

    document.getElementById("button").onclick = () => {
        setState({
            presses: state.presses + 1,
        });
    };
</script>
```

Every time the button is pressed, the counter will increment.

## Conditionals

Conditionals can be created using the `<if>` tag. Nested within the `<if>` tag
can be one `<then>` tag, zero or more `<elif>` tags, and zero or one `<else>` tag.

```html
<stateful id="stateful-root">
    <h1>
        <if condition="raining">
            <then>It is raining</then>
            <else>It is not raining</else>
        </if>
    </h1>
</stateful>

<script>
    const stateful = document.getElementById("stateful-root");
    const { state, setState } = stateful;

    setState({
        raining: true,
    });
</script>
```

This will render to
```html
<h1>It is raining</h1>
```

Notice how the `<h1>` tag is wrapping the entire conditional. You can also put the
`<h1>` tag *within* the conditional, and it would produce the same result.

## When statements

The `<when>` tag functions similarly to `switch` statements in many programming
languages.

```html
<stateful id="stateful-root">
    
    <label for="when-select">When Value:</label>
    <select id="when-select">
        <option>0</option>
        <option>1</option>
        <option>2</option>
        <option>3</option>
        <option>4</option>
    </select>
    
    <when value="number">
        <case value="!0">
            <p>Zero</p>
        </case>
        <case value="!1">
            <p>One</p>
        </case>
        <case value="!2">
            <p>Two</p>
        </case>
        <case value="!3">
            <p>Three</p>
        </case>
        <else>
            <p>Other</p>
        </else>
    </when>
    
</stateful>

<script>
    const stateful = document.getElementById("stateful-root");
    const { state, setState } = stateful;

    setState({
        number: 0,
    });

    document.getElementById("when-select").onchange = e => {
        setState({
            whenValue: e.target.value,
        });
    }
    
</script>
```

This would initially render to
```html
<label for="when-select">When Value:</label>
<select id="when-select">
    <option>0</option>
    <option>1</option>
    <option>2</option>
    <option>3</option>
    <option>4</option>
</select>
<p>Zero</p>
```

and then would update whenever the selection changes.
