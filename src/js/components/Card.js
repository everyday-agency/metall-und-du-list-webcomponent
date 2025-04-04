import { renderModal } from './Modal';

export function renderCard(item) {
    const additionalInfoHTML = `
            <li class="flex items-center gap-2 lg:flex-row-reverse">
                <span class="${
                    item.apprenticeshipPlaceSchoolYears
                        ? 'bg-green-500'
                        : 'bg-red-500'
                } w-[1rem] h-[1rem] rounded-full flex-shrink-0"></span>
                <span>Offene Lehrstelle 2025</span>
            </li>
            <li class="flex items-center gap-2 lg:flex-row-reverse"> <span class="flex bg-green-500 w-[1rem] h-[1rem] rounded-full"></span>
            <span>Schnupperlehre auf Anfrage möglich</span> </li>
            <li class="mt-4">
                <button class="bg-black text-white px-16 py-2 rounded-lg" data-modal data-open-modal>Kontaktdaten</button>
            </li>
        `;

    const template = `
        <div class="mb-4 p-4 border rounded bg-gray-50 flex flex-col lg:flex-row lg:justify-between gap-2">
            <ul>
                <li class="text-sm">${item.professionNameDeMf}</li>
                <li class="font-bold text-2xl">${item.locationName}</li>
                <li>${item.locationStreet} ${item.locationHouseNumber}</li>
                <li>${item.locationZipCode} ${item.locationLocalityNameDe}</li>
            </ul>
            <ul class="flex flex-col lg:items-end">
                ${additionalInfoHTML}
            </ul>
        </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;

    const card = wrapper.firstElementChild;
    const openBtn = card.querySelector('[data-open-modal]');
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            renderModal(item);
        });
    }

    return wrapper.firstElementChild;
}
