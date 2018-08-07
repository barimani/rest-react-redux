## Rest Redux

A higher order component RestAPI abstraction. Reduces lots of boilerplate code and encourages clean code.

depends on Axios
depends on redux and redux-thunk

By decorating your component with queriedEntity/detailedEntity and initializing the first network call, you can
have access to a managed data entity named according to the "entity name" you passed as argument.

What you need to do:
* Create the proper repository in your reducer
* Annotate your component/container with the proper HOC
* Enjoy the props introduced to your component and not ever worry about writing actions and reducers