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
        const ul = document.createElement('ul');
        this.data.forEach((item) => {
            const li = document.createElement('li');
            li.textContent = item.applicationName;
            ul.appendChild(li);
        });
        this.appendChild(ul);
    }
}

customElements.define('data-list', DataList);
