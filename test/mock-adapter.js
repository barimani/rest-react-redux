import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

// Unimportant server name
axios.defaults.baseURL = 'http://mockserver.com';


/**
 * Sets up the mock server with corresponding endpoints
 */
const configureAxiosMockAdapter = () => {
    // Creating a mock instance with a delay response
    const mock = new MockAdapter(axios);


    let contacts = [{id: '1', name: 'Name1'}, {id: '2', name: 'Name2'}, {id: '3', name: 'Name3'}];

    /**
     * Mocking Authentication/Evaluation/Registration flow
     * */
    mock.onGet(/\/contacts\/\d+/).reply(({url}) => {
        const id = url.match(/\d+/)[0];
        const contact = contacts.find(contact => contact.id == id);
        if (contact) return [200, contact];
        else return [404];
    });

    mock.onPut(/\/contacts\/\d+/).reply(({url, data}) => {
        const id = url.match(/\d+/)[0];
        let updateSuccessful = false;
        contacts = contacts.map(contact => {
            if (contact.id == id) {
                updateSuccessful = true;
                const newContact = JSON.parse(data);
                return {id, ...newContact};
            } else return contact;
        });
        if (updateSuccessful) return [200, data];
        else return [404];
    });

    mock.onDelete(/\/contacts\/\d+/).reply(({url}) => {
        const id = url.match(/\d+/)[0];
        let removeSuccessful = false;
        contacts = contacts.filter(contact => {
            if (contact.id == id) {
                removeSuccessful = true;
                return false;
            } else return true;
        });
        if (removeSuccessful) return [200];
        else return [404];
    });
};

export default configureAxiosMockAdapter;
