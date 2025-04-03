// components/list.js
import { fetchBerufsberatungData } from '../lib/fetchData.js';
import { fetchCantonData } from '../lib/fetchCantons.js';

export class DataList extends HTMLElement {
    static properties = {
        data: { type: Array },
        fetching: { type: Boolean },
        error: { type: String },
        currentPage: { type: Number },
        itemsPerPage: { type: Number },
        filteredData: { type: Array },
        cantons: { type: Object },
        selectedCanton: { type: String },
    };

    constructor() {
        super();
        this.data = [];
        this.fetching = true;
        this.error = null;
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.filteredData = [];
        this.cantons = {};
        this.selectedCanton = null;
    }

    connectedCallback() {
        this.fetchData();
    }

    async fetchData() {
        try {
            this.data = await fetchBerufsberatungData();
            const zipToCanton = await fetchCantonData();
            this.cantons = this.groupCantons(zipToCanton);
            this.filteredData = this.data;
        } catch (error) {
            this.error = error.message;
        } finally {
            this.fetching = false;
            this.render();
        }
    }

    groupCantons(zipMap) {
        const cantonGroups = {};
        for (const [zip, canton] of Object.entries(zipMap)) {
            if (!cantonGroups[canton]) {
                cantonGroups[canton] = new Set();
            }
            cantonGroups[canton].add(zip);
        }
        return cantonGroups;
    }

    handleCantonChange(cantonCode) {
        this.selectedCanton = cantonCode;
        this.currentPage = 1;

        if (!cantonCode || !this.cantons[cantonCode]) {
            this.filteredData = this.data;
        } else {
            const zipSet = this.cantons[cantonCode];
            this.filteredData = this.data.filter((item) =>
                zipSet.has(String(item.locationZipCode))
            );
        }

        this.render();
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

        this.renderFilterDropdown(); // ← Add this line!

        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const currentItems = this.filteredData.slice(start, end);

        const wrapper = document.createElement('div');
        wrapper.className = 'pt-4';

        currentItems.forEach((item) => {
            wrapper.appendChild(this.renderCard(item));
        });

        this.appendChild(wrapper);

        this.renderPagination(); // remains unchanged
    }

    renderFilterDropdown() {
        const wrapper = document.createElement('div');
        wrapper.className = 'mb-4';

        const label = document.createElement('label');
        label.textContent = 'Kanton wählen:';
        label.className = 'mr-2';

        const select = document.createElement('select');
        select.className = 'p-2 border rounded';
        select.innerHTML = `<option value="">Alle Kantone</option>`;

        Object.keys(this.cantons)
            .sort()
            .forEach((code) => {
                const option = document.createElement('option');
                option.value = code;
                option.textContent = code; // Optional: replace with full name mapping if desired
                select.appendChild(option);
            });

        select.value = this.selectedCanton || '';
        select.addEventListener('change', (e) =>
            this.handleCantonChange(e.target.value)
        );

        wrapper.appendChild(label);
        wrapper.appendChild(select);
        this.appendChild(wrapper);
    }

    renderCard(item) {
        const ul = document.createElement('ul');
        ul.className = 'mb-4 p-4 border rounded bg-gray-50';

        const titleLi = document.createElement('li');
        titleLi.textContent = item.professionNameDeMf;
        titleLi.className = 'font-bold text-lg';

        const nameLi = document.createElement('li');
        nameLi.textContent = item.locationName;

        const streetLi = document.createElement('li');
        streetLi.textContent =
            item.locationStreet + ' ' + item.locationHouseNumber;

        const zipCodeLi = document.createElement('li');
        zipCodeLi.textContent =
            item.locationZipCode + ' ' + item.locationLocalityNameDe;

        ul.appendChild(titleLi);
        ul.appendChild(nameLi);
        ul.appendChild(streetLi);
        ul.appendChild(zipCodeLi);

        return ul;
    }

    renderPagination() {
        // const totalPages = Math.ceil(this.data.length / this.itemsPerPage);
        const totalPages = Math.ceil(
            this.filteredData.length / this.itemsPerPage
        );
        if (totalPages <= 1) return;

        const nav = document.createElement('nav');
        nav.className = 'flex gap-2 my-4 flex-wrap justify-center';

        // Helper to create a page button
        const createButton = (
            label,
            page,
            isActive = false,
            disabled = false
        ) => {
            const btn = document.createElement('button');
            btn.textContent = label;
            btn.className = `px-3 py-1 rounded border transition ${
                isActive
                    ? 'bg-blue-500 text-white'
                    : 'bg-white hover:bg-gray-100'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

            if (!disabled) {
                btn.addEventListener('click', () => {
                    this.currentPage = page;
                    this.render();
                    this.scrollIntoView({ behavior: 'smooth', block: 'start' });
                });
            }

            return btn;
        };

        // Previous button
        nav.appendChild(
            createButton(
                '« Prev',
                this.currentPage - 1,
                false,
                this.currentPage === 1
            )
        );

        // Pagination logic
        const maxVisible = 7;
        let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let end = start + maxVisible - 1;

        if (end > totalPages) {
            end = totalPages;
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            nav.appendChild(createButton(i, i, i === this.currentPage));
        }

        // Next button
        nav.appendChild(
            createButton(
                'Next »',
                this.currentPage + 1,
                false,
                this.currentPage === totalPages
            )
        );

        this.appendChild(nav);
    }
}

customElements.define('data-list', DataList);
