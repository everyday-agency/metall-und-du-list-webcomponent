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

    async handleCantonChange(cantonCode) {
        this.selectedCanton = cantonCode;
        this.fetching = true;
        this.render(); // show skeleton

        await delay(300);
        this.applyFilters(); // already calls render
        this.fetching = false;
        this.render();
    }

    async handleProfessionChange(profession) {
        this.selectProfession = profession;
        this.fetching = true;
        this.render(); // show skeleton

        await delay(300);
        this.applyFilters(); // already calls render
        this.fetching = false;
        this.render();
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
    }

    render() {
        this.innerHTML = '';
        if (this.error) {
            this.innerHTML = `<p>Error: ${this.error}</p>`;
            return;
        }

        const wrapper = document.createElement('div');
        wrapper.className = 'pt-4';
        wrapper.id = 'data-list-wrapper';

        // Render filters
        this.renderCantonsFilter(wrapper);
        this.renderFilterProfessionDropdown(wrapper);

        if (this.fetching) {
            for (let i = 0; i < this.itemsPerPage; i++) {
                wrapper.appendChild(renderCard(null, true));
            }
        } else {
            const openJobs = this.filteredData.filter(
                (item) => item.apprenticeshipPlaceSchoolYears?.length > 0
            );
            const otherJobs = this.filteredData.filter(
                (item) => !item.apprenticeshipPlaceSchoolYears?.length
            );

            const groupedData = [...openJobs, ...otherJobs];

            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            const currentItems = groupedData.slice(start, end);

            const visibleOpen = currentItems.filter((item) =>
                openJobs.includes(item)
            );
            const visibleOther = currentItems.filter((item) =>
                otherJobs.includes(item)
            );

            if (visibleOpen.length) {
                const heading = document.createElement('h2');
                heading.textContent = 'Offene Lehrstellen';
                heading.className = 'text-xl font-bold mt-8 mb-4';
                wrapper.appendChild(heading);

                visibleOpen.forEach((item) =>
                    wrapper.appendChild(renderCard(item, false))
                );
            }

            if (visibleOther.length) {
                const heading = document.createElement('h2');
                heading.textContent = 'Weitere Betriebe';
                heading.className = 'text-xl font-bold mt-8 mb-4';
                wrapper.appendChild(heading);

                visibleOther.forEach((item) =>
                    wrapper.appendChild(renderCard(item, false))
                );
            }

            if (!visibleOpen.length && !visibleOther.length) {
                wrapper.innerHTML += `<p class="text-gray-500">Keine Einträge gefunden.</p>`;
            }
        }

        this.appendChild(wrapper);

        // ✅ Pagination now works on grouped full list
        const paginationContainer = document.createElement('div');
        renderPagination({
            container: paginationContainer,
            currentPage: this.currentPage,
            totalItems: this.filteredData.length,
            itemsPerPage: this.itemsPerPage,
            onPageChange: async (page) => {
                this.currentPage = page;
                this.fetching = true;
                this.render();
                await delay(300);
                this.fetching = false;
                this.render();
            },
        });
        this.appendChild(paginationContainer);
    }

    renderCantonsFilter(wrapper) {
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
        wrapper.appendChild(container);
    }

    renderFilterProfessionDropdown(wrapper) {
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
        wrapper.appendChild(container);
    }
}

customElements.define('data-list', DataList);

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
