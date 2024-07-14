---
title: "Most Adequate Guide to FP 读书笔记"
description: "Most Adequate Guide to FP 读书笔记"
pubDate: "Jul 13 2024"
---

# Pure Function

> A pure function is a function that, given the same input, will always return the same output and does not have any observable side effects

## The Case for Purity

### Cacheable

pure functions can always be cached by input

transform some impure functions into pure ones by delaying evaluation

```javascript
const pureHttpCall = memoize((url, params) => () => $.getJSON(url, params))
```

### Portable / Self-documenting

Pure functions are completely self contained. A function's dependencies are explicit.

### Testable

We don't have to mock a "real" payment gateway or setup and assert the state of the world after each test. We simply give the function input and assert output.

### Reasonable

- **Referential transparency**: A spot of code is referentially transparent when it can be substituted for its evaluated value without changing the behavior of the program.

### Parallel Code

We can run any pure function since it does not need access to shared memory and it cannot have a race condition due to some side effect.

# Currying

**The concept**: You call a function with fewer arguments than it expects. It returns a function that takes the remaining arguments.

# Composing

```javascript
const compose =
  (...fns) =>
  (...args) =>
    fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0]
```

Composition is associative, meaning it doesn't matter how you group two of them.

## Pointfree

Pointfree style means never having to say your data.

```javascript
const initials = compose(
  intercalate(". "),
  map(compose(toUpperCase, head)),
  split(" ")
)

initials("hunter stockton thompson") // 'H. S. T'
```

## Debugging

```javascript
const trace = curry((tag, x) => {
  console.log(tag, x)
  return x
})
```

## Category Theory

An abstract branch of mathematics that can formalize concepts from several different branches such as set theory, type theory, group theory, logic and more.

A category is defined as a collection with the following components:

- A collection of objects
- A collection of morphisms
- A notion of composition on the morphisms
- A distinguished morphism called identity

apply this to types and functions

- **A collection of objects**: this objects will be data types. We often view data types as sets of all the possible values.
- **A collection of morphisms**: the morphisms will be our standard every day pure functions.
- **A notion of composition on the morphisms**: `compose` associative is a property that must hold for any composition in category theory.
- **A distinguished morphism called identity**: A function simply takes some input and spits it back at you.

```javascript
const id = (x) => x
```

# "Hindley-Milner" system

```javascript
// capitalize :: String -> String
const capitalize = (s) => toUpperCase(head(s)) + toLowerCase(tail(s))

// strLength :: String -> Number
const strLength = (s) => s.length

// join :: String -> [String] -> String
const join = curry((what, xs) => xs.join(what))

// match :: Regex -> String -> [String]
const match = curry((reg, s) => s.match(reg))

// replace :: Regex -> String -> String -> String
const replace = curry((reg, sub, s) => s.replace(reg, sub))
```

## Type variable

```javascript
// id :: a -> a
const id = (x) => x

// map :: (a -> b) -> [a] -> [b]
const map = curry((f, xs) => xs.map(f))
```

Variable names like `a` and `b` are convention, but they are arbitrary and can be replaced with whatever name you'd like. If they are the same variable, they have to be the same type.

## Parametricity - Narrowing the Possibility

This property states that a function will act on all types in a uniform manner.

```javascript
// head :: [a] -> a
```

> Looking at `head`, we see that it takes [a] to a. Besides the concrete type `array`, it has no other information available and, therefore, its functionality is limited to working on the array alone. What could it possibly do with the variable `a` if it knows nothing about it? In other word, `a` says it cannot be a specific type, which means it can be _any_ type, which leaves us with a function that must work uniformly for _every_ conceivable type. This is what _parametricity_ is all about. Guessing at the implementation, the only reasonable assumptions are that it takes the first, last, or a random element from that array. The name `head` should tip us off.

## Free Theorems

```javascript
// head :: [a] -> a
compose(f, head) === compose(head, map(f))

// filter :: (a -> Bool) -> [a] -> [a]
compose(map(f), filter(compose(p, f))) === compose(filter(p), map(f))
```

## Constraints

We can constrain types to an interface

```javascript
// sort :: Ord a => [a] -> [a]
```

```javascript
// assertEqual :: (Eq a, Show a) => a -> a -> Assertion
```

# Container

```javascript
class Container {
  constructor(x) {
    this.$value = x
  }

  static of(x) {
    return new Container(x)
  }
}
```

```javascript
Container.of(3)
// Container(3)

Container.of("hotdogs")
// Container("hotdogs")

Container.of(Container.of({ name: "yoda" }))
// Container(Container({ name: 'yoda' }))
```

- `Container` is a object with one property. Lots of containers just hold one thing, though they aren't limited to one. We've arbitrarily named property `$value`
- The `$value` cannot be some specific type or our `Container` would be hardly live up to the name
- Once data goes into the `Container` it stays there. We _could_ get it out by using `.value`, but that would defeat the purpose.

# Functor

```javascript
// (a -> b) -> Container a -> Container b
Container.prototype.map = function (f) {
  return Container.of(f(this.$value))
}
```

```javascript
Container.of(2).map((two) => two + 2)
// Container(4)

Container.of("flamethrowers").map((s) => s.toUpperCase())
// Container('FLAMETHROWERS')

Container.of("bombs").map(append(" away")).map(prop("length"))
// Container(10)
```

> A Functor is a type that implements `map` and obeys some laws.

What do we gain from asking our container to apply functions for us?

- Abstraction of function application. When we `map` a function, we ask the container type to run it for us.

# Maybe

```javascript
class Maybe {
  static of(x) {
    return new Maybe(x)
  }

  get isNothing() {
    return this.$value === null || this.$value === undefined
  }

  constructor(x) {
    this.$value = x
  }

  map(fn) {
    return this.isNothing ? this : Maybe.of(fn(this.$value))
  }

  inspect() {
    return this.isNothing ? "Nothing" : `Just(${inspect(this.$value)})`
  }
}
```

Maybe will first check to see if it has a value before calling the supplied function. This has the effect of side stepping those pesky nulls as we `map`.

## Use Case

```haskell
withdraw :: (Ord a, Num a) => a -> a -> Maybe a
withdraw amount balance =
    if balance >= amount then Just (balance - amount)
    else Nothing

updateLedger :: p -> p
updateLedger account = account

remainingBalance :: (Show a) => a -> [Char]
remainingBalance balance = "Your balance is " ++ show balance

finishTransaction :: (Show a) => a -> [Char]
finishTransaction = remainingBalance . updateLedger

getTwenty = fmap finishTransaction . withdraw 20

main = do
    print $ getTwenty 100 -- Just "Your balance is 80"
    print $ getTwenty 10 -- Nothing
```

## Release the value

```javascript
// maybe :: b -> (a -> b) -> Maybe a -> b
const maybe = curry((v, f, m) => {
  if (m.isNothing) {
    return v
  }

  return f(m.$value)
})

// getTwenty :: Account -> String
const getTwenty = compose(
  maybe("You're broke!", finishTransaction),
  withdraw(20)
)

getTwenty({ balance: 200.0 })
// 'Your balance is $180.00'

getTwenty({ balance: 10.0 })
// 'You\'re broke!'
```

```haskell
main = do
    print $ fromMaybe "You're broke" $ getTwenty 100
    print $ fromMaybe "You're broke" $ getTwenty 10
```

# Either (Error handling)

```javascript
class Either {
  static of(x) {
    return new Right(x)
  }

  constructor(x) {
    this.$value = x
  }
}

class Left extends Either {
  map(f) {
    return this
  }

  inspect() {
    return `Left(${inspect(this.$value)})`
  }
}

class Right extends Either {
  map(f) {
    return Either.of(f(this.$value))
  }

  inspect() {
    return `Right(${inspect(this.$value)})`
  }
}

const left = (x) => new Left(x)
```

```javascript
Either.of("rain").map((str) => `b${str}`)
// Right('brain')

left("rain").map((str) => `It's gonna ${str}, better bring your umbrella!`)
// Left('rain')

Either.of({ host: "localhost", port: 80 }).map(prop("host"))
// Right('localhost')

left("rolls eyes...").map(prop("host"))
// Left('rolls eyes...')
```

```javascript
// fortune :: Number -> String
const fortune = compose(
  concat("If you survive, you will be "),
  toString,
  add(1)
)

// zoltar :: User -> Either(String, _)
const zoltar = compose(map(console.log), map(fortune), getAge(moment()))

zoltar({ birthDate: "2005-12-12" })
// 'If you survive, you will be 10'
// Right(undefined)

zoltar({ birthDate: "balloons!" })
// Left('Birth date could not be parsed')
```

**fortune** is completely ignorant of any functors. At the time of calling, a function can be surrounded by `map`, which transforms it from a non-functory function to a functory one, in informal terms. We call this process _lifting_. Functions tend to be better off working with normal data types rather than container types, then _lifted_ into the right container as deemed necessary. This leads to simpler, more reusable functions that can be altered to work with any functor on demand.

```javascript
// either :: (a -> c) -> (b -> c) -> Either a b -> c
const either = curry((f, g, e) => {
  let result

  switch (e.constructor) {
    case Left:
      result = f(e.$value)
      break

    case Right:
      result = g(e.$value)
      break

    // No Default
  }

  return result
})

// zoltar :: User -> _
const zoltar = compose(console.log, either(id, fortune), getAge(moment()))

zoltar({ birthDate: "2005-12-12" })
// 'If you survive, you will be 10'
// undefined

zoltar({ birthDate: "balloons!" })
// 'Birth date could not be parsed'
// undefined
```

# IO

```javascript
class IO {
  static of(x) {
    return new IO(() => x)
  }

  constructor(fn) {
    this.$value = fn
  }

  map(fn) {
    return new IO(compose(fn, this.$value))
  }

  inspect() {
    return `IO(${inspect(this.$value)})`
  }
}
```

```javascript
// ioWindow :: IO Window
const ioWindow = new IO(() => window)

ioWindow.map((win) => win.innerWidth)
// IO(1430)

ioWindow.map(prop("location")).map(prop("href")).map(split("/"))
// IO(['http:', '', 'localhost:8000', 'blog', 'posts'])

// $ :: String -> IO [DOM]
const $ = (selector) => new IO(() => document.querySelectorAll(selector))

$("#myDiv")
  .map(head)
  .map((div) => div.innerHTML)
// IO('I am some inner html')
```

> `IO` delays the impure action by capturing it in a function wrapper. As such, we think of `IO` as containing the return value of the wrapped action and not the wrapper itself.

# Asynchronous Tasks
