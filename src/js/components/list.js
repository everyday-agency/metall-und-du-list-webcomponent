// components/list.js
import { fetchBerufsberatungData } from '../lib/fetchData.js';

export class DataList extends HTMLElement {
    static properties = {
        data: { type: Array },
        fetching: { type: Boolean },
        error: { type: String },
    };

    constructor() {
        super();
        this.data = [];
        this.fetching = true;
        this.error = null;
    }

    connectedCallback() {
        this.fetchData();
    }

    async fetchData() {
        try {
            this.data = await fetchBerufsberatungData();
        } catch (error) {
            this.error = error.message;
        } finally {
            this.fetching = false;
            this.render();
        }
    }

    render() {
        this.innerHTML = '';
        if (this.fetching) {
            this.innerHTML = '<p>Loading...</p>';
            return;
        }
        if (this.error) {
            this.innerHTML = `<p>Error: ${this.error}</p>`;
            return;
        }

        this.data.forEach((item) => {
            console.log({ item });
            const ul = document.createElement('ul');

            const nameLi = document.createElement('li');
            nameLi.textContent = item.applicationName;

            const streetLi = document.createElement('li');
            streetLi.textContent = item.applicationStreet;

            ul.appendChild(nameLi);
            ul.appendChild(streetLi);

            this.appendChild(ul);
        });
    }
}

customElements.define('data-list', DataList);
