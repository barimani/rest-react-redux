# Rest React Redux

[![N|Solid](https://www.twotalltotems.com/img/nav/nav-logo.svg)](https://www.twotalltotems.com)

A higher order component for RestAPI abstraction. Reduces boilerplate and encourages clean code.

By decorating your component with queriedEntity/detailedEntity and initializing the first network call, you can
have access to a managed data entity named according to the "entity name" you passed as argument.

## Installation

npm:
```sh
npm install rest-react-redux --save
```


What you need to do:
- Create the proper reducer structure
- Annotate your component/container with the proper HOC
- Enjoy the props introduced to your component and not ever worry about writing actions and reducers

This library is supposed to be used only on a restful endpoint. here is an example:
- *GET*:  `http://www.url.com/contacts?page=1&page-size=10` returns a list of contacts and metadata about the query
- *POST*:  `http://www.url.com/contacts` creates a contact
- *GET*, *PUT*, *PATCH*: `http://www.url.com/contacts/contactId` gets, updates or patches the specific contact respectively

## Restrictions in the current version
- Json endpoints: network request and response body must be in JSON
- Redux-thunk: your application redux store must contain redux-thunk as middleware
```js
import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
export const store = createStore(rootReducer, compose(applyMiddleware(thunk)));
```
- Axios: your application must use axios as the network call library. BaseUrl and headers must be set in your application scope
```js
import axios from 'axios';
axios.defaults.baseURL = 'http://www.url.com';
```
- reducer: using `queriedEntityReducer` or `detailedEntityReducer` you must create a field in the root reducer matching the name of the entity you create. This is where the library manages the data
```js
import { queriedEntityReducer, detailedEntityReducer } from 'rest-react-redux';
const reducers = {
    contacts: queriedEntityReducer('contact'),
    contact: detailedEntityReducer('contact'),
}
```

## Higher Order Components
### queriedEntity

if you intend to work with an endpoint that returns a list use `queriedEntity` to decorate your components:
```js
import { queriedEntity } from 'rest-react-redux';

@queriedEntity('contact')
class ContactsPage extends React.Component {
    ...
}
```
NOTE: For those of you who do not enjoy decorating as much as I do, use the standard way!

### queriedEntity(entityName, config[optional])

| Config field | Explanation | Default Value |
| ------ | ------ | ------ |
| resultField | he result field name in response body that matches the list of items | `content` |
| retain_number | maximum number of queries to cache | `10` |
| hideLoadIfDataFound | if set to `false`, will trigger loading UI even if data had been cached | `true` |
| reducerName | The reducer name used for the entity. Default is the plural form of the entityName | `[entityName]s` |

#### Properties injected to the wrapped component
| property (props) | Explanation | Example | Sample value |
| ------ | ------ | ------ | ------ |
| [entityName]s | The query result | `contacts` | `[{id: 1, name: 'John Doe'}]` |
| [entityName]sQueryParams | The last successful parameters with which query was performed | `contactsQueryParams` | `{page: 1}` |
| [entityName]sMetadata | The metadata that is received from the endpoint | `contactsMetadata` | `{totalPages: 10}` |
| initialQuery[entityName]s | A *must-be-called* function that initializes the query. Receives url and parameters (object) | `initialQueryContacts('/contacts/', {page: 1})` |
| query[entityName]s | Any query after initial query call. It will append the new params on top of the previous ones  | `queryContacts({pageSize: 1})` |
| create[EntityName] | Creates an object and performs the latest query again  | `createContact({name: 'Foo Bar'})` |
| update[EntityName] | Updates/replaces an entity. After success, will update the store and queries again  | `updateContact({id: 1, name: 'Foo Bar'})` |
| patch[EntityName] | Patches an entity. After success, will update the store and queries again  | `patchContact({id: 1, name: 'Foo Bar'})` |
| delete[EntityName] | Removes an entity. After success, will update the store and queries again  | `deleteContact({id: 1, name: 'Foo Bar'})` |
| loading[EntityName]s | Network loading status  | `loadingContacts` | `true` |

### queriedEntity

if you intend to work with an endpoint that returns a detailed entity use `detailedEntity` to decorate your components:
```js
import { detailedEntity } from 'rest-react-redux';

@detailedEntity('contact')
class ContactsPage extends React.Component {
    ...
}
```
### detailedEntity(entityName, config[optional])

| Config field | Explanation | Default Value |
| ------ | ------ | ------ |
| retain_number | maximum number of queries to cache | `10` |
| hideLoadIfDataFound | if set to `false`, will trigger loading UI even if data had been cached | `true` |
| reducerName | The reducer name used for the entity. Default is the entityName | `[entityName]` |

#### Properties injected to the wrapped component
| property (props) | Explanation | Example | Sample value |
| ------ | ------ | ------ | ------ |
| [entityName] | The result | `contact` | `{id: 1, name: 'John Doe'}` |
| initialGet[entityName]s | A *must-be-called* function that initializes the entity. Receives url and object id | `initialGetContacts('/contacts/12', 12)` |
| get[entityName] | Any get call after the initial get call. This is usually used for receiving updates if any  | `getContact()` |
| update[EntityName] | Updates/replaces the entity. After success, will update the store and gets again  | `updateContact({id: 1, name: 'Foo Bar'})` |
| patch[EntityName] | Patches the entity. After success, will update the store and gets again  | `patchContact({id: 1, name: 'Foo Bar'})` |
| delete[EntityName] | Removes the entity. After success, will update the store | `deleteContact({id: 1, name: 'Foo Bar'})` |
| loading[EntityName] | Network loading status  | `loadingContact` | `true` |

### Todos

 - Remove the redux-thunk dependency
 - Remove the JSON request/response requirement
 - Remove the need to update the reducer for each entity
 - Tests

License
----

MIT