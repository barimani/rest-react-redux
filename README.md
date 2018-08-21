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
- *GET*, *PUT*, *PATCH* and *DELETE*: `http://www.url.com/contacts/contactId` gets, updates, patches or deletes the specific contact respectively

## Restrictions in the current version
- JSON endpoints: network request and response body must be of `application/json` content type
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
| resultField | the result field name in response body that matches the list of items | `content` |
| retain_number | maximum number of queries to cache | `10` |
| hideLoadIfDataFound | if set to `false`, will trigger loading UI even if data had been cached | `true` |
| reducerName | The reducer name used for the entity. Default is the plural form of the entityName | `[entityName]s` |
| preloadValidTime | The time (milliseconds) that a preloaded query is valid and should not be re-fetched | `10000` |
| smartPreload | If set to `true` the library times the network calls specific to the defined entity. If the average is greater than 0.3 seconds, preloading will be cancelled. Overwrite this time with the next field | `false` |
| smartThresholdTime | The acceptable average time (milliseconds) for network calls to continue preloading in `smartPreload` mode | `300` |

#### Properties injected to the wrapped component
| property (props) | Explanation | Example | Sample value |
| ------ | ------ | ------ | ------ |
| [entityName]s | The query result | `contacts` | `[{id: 1, name: 'John Doe'}]` |
| [entityName]sQueryParams | The last successful parameters with which query was performed | `contactsQueryParams` | `{page: 1}` |
| [entityName]sMetadata | The metadata that is received from the endpoint | `contactsMetadata` | `{totalPages: 10}` |
| initialQuery[EntityName]s | A *must-be-called* function that initializes the query. Receives url and parameters (object) | `initialQueryContacts('/contacts/', {page: 1})` |
| query[EntityName]s | Any query after initial query call. It will append the new partial params on top of the previous ones  | `queryContacts({pageSize: 1})` |
| create[EntityName] | Creates an object and performs the latest query again  | `createContact({name: 'Foo Bar'})` |
| update[EntityName] | Updates/replaces an entity. After success, will update the store and queries again  | `updateContact({id: 1, name: 'Foo Bar'})` |
| patch[EntityName] | Patches an entity. After success, will update the store and queries again  | `patchContact({id: 1, name: 'Foo Bar'})` |
| delete[EntityName] | Removes an entity. After success, will update the store and queries again  | `deleteContact({id: 1, name: 'Foo Bar'})` |
| set[EntityName]sPreloader | Sets a function for pre-loading data for a smooth UX  | `setContactsPreloader(customPreloader)`* |
| loading[EntityName]s | Network loading status  | `loadingContacts` | `true` |

*Note: the preloader function will receive (partialParams, params, queryMetadata) as arguments. The function should return an array of partialParams. See the preloading
section for more information

### detailedEntity

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
| initialGet[EntityName]s | A *must-be-called* function that initializes the entity. Receives url and object id | `initialGetContacts('/contacts/12', 12)` |
| get[EntityName] | Any get call after the initial get call. This is usually used for receiving updates if any  | `getContact()` |
| update[EntityName] | Updates/replaces the entity. After success, will update the store and gets again  | `updateContact({id: 1, name: 'Foo Bar'})` |
| patch[EntityName] | Patches the entity. After success, will update the store and gets again  | `patchContact({id: 1, name: 'Foo Bar'})` |
| delete[EntityName] | Removes the entity. After success, will update the store | `deleteContact()` |
| loading[EntityName] | Network loading status  | `loadingContact` | `true` |

### Preloading
For a better user experience, you may pre-load the data that have a good chance of being loaded later. There are
two main methods of preloading data:

#### Entity specific preloading
If you are dealing with a queried entity like calendar events, table data, chat messages etc.
it might be a good idea to dynamically preload data based on what the user queries. For instance, loading the previous and
the next pages of a table sounds like a good investment! To do that you simply need to set 
a function via property `set[EntityName]sPreloader`: 

```js
import { queriedEntity } from 'rest-react-redux';

@queriedEntity('contact')
class ContactsPage extends React.Component {
    
    componentDidMount() {
        this.props.initialQueryContacts('/contacts/', {page: 1, size: 20});
        this.props.setContactsPreloader((partialParams) => {
            
            const page = partialParams.page;
            
            // If the query does not contain a new page do not preload
            if (!partialParams.page) return [];
            
            // Preload previous and next pages
            return [{page: page - 1}, {page: page + 1}];
        })
    }
}
```

#### Generic preloading
You may need to preload entities that are not related to the component you are focusing at.
For instance, if a user gets to the main dashboard, you want to preload all the contacts before
the user goes to the contacts page. To achieve that you can use the exposed `queryEntities` or `getEntity`
action generators:

`queryEntities(entityName, url, params)`  
`getEntity(entityName, url)`

Usage example:

```js
import { queryEntities, getEntity } from 'rest-react-redux';
import store from '../store';

class Dashboard extends React.Component {
    
    componentDidMount() {
        // Preload a contact list query
        store.dispatch(queryEntities('contact', '/contacts/', {page: 1}));
        
        // Preload a detailed contact
        store.dispatch(getEntity('contact', '/contacts/1'));
    }
}
```


### Todos

 - Remove the redux-thunk dependency
 - Remove the JSON request/response requirement
 - Remove the need to update the reducer for each entity
 - Tests

License
----

MIT