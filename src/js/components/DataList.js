import { fetchBerufsberatungData } from '../lib/fetchData.js';
import { fetchCantonData } from '../lib/fetchCantons.js';
import { renderPagination } from './Pagination.js';
import { renderSelectFilter } from './Filters.js';
import { renderCard } from './Card.js';

export class DataList extends HTMLElement {
    static properties = {
        data: { type: Array },
        fetching: { type: Boolean },
        error: { type: String },
        currentPage: { type: Number },
        itemsPerPage: { type: Number },
        filteredData: { type: Array },
        cantons: { type: Object },
        professions: { type: Array },
        selectedCanton: { type: String },
        selectProfession: { type: String },
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
        this.professions = [
            'Metallbauer/-in (Metallbau) EFZ',
            'Metallbaukonstrukteur/-in EFZ',
            'Metallbaupraktiker/-in EBA',
        ];
        this.selectedCanton = null;
        this.selectProfession = null;
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
        this.applyFilters();
    }

    handleProfessionChange(profession) {
        this.selectProfession = profession;
        this.applyFilters();
    }

    applyFilters() {
        const filteredByCanton = this.selectedCanton
            ? this.data.filter((item) =>
                  this.cantons[this.selectedCanton]?.has(
                      String(item.locationZipCode)
                  )
              )
            : this.data;

        const filteredByProfession = this.selectProfession
            ? filteredByCanton.filter(
                  (item) => item.professionNameDeMf === this.selectProfession
              )
            : filteredByCanton;

        this.filteredData = filteredByProfession;
        this.currentPage = 1;
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

        this.renderCantonsFilter();
        this.renderFilterProfessionDropdown();

        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const currentItems = this.filteredData.slice(start, end);

        const wrapper = document.createElement('div');
        wrapper.className = 'pt-4';

        currentItems.forEach((item) => {
            wrapper.appendChild(renderCard(item));
        });

        this.appendChild(wrapper);

        const paginationContainer = document.createElement('div');
        renderPagination({
            container: paginationContainer,
            currentPage: this.currentPage,
            totalItems: this.filteredData.length,
            itemsPerPage: this.itemsPerPage,
            onPageChange: (page) => {
                this.currentPage = page;
                this.render();
            },
        });
        this.appendChild(paginationContainer);
    }

    renderCantonsFilter() {
        const cantonOptions = Object.keys(this.cantons).sort();
        const container = document.createElement('div');

        renderSelectFilter({
            container,
            labelText: 'Kanton wählen:',
            options: cantonOptions,
            selectedValue: this.selectedCanton,
            onChange: this.handleCantonChange.bind(this),
            defaultOptionText: 'Alle Kantone',
        });

        this.appendChild(container);
    }

    renderFilterProfessionDropdown() {
        const container = document.createElement('div');

        renderSelectFilter({
            container,
            labelText: 'Ausbildungsberuf wählen:',
            options: this.professions,
            selectedValue: this.selectProfession,
            onChange: this.handleProfessionChange.bind(this),
            defaultOptionText: 'Alle Ausbildungsberufe',
        });

        this.appendChild(container);
    }
}

customElements.define('data-list', DataList);
