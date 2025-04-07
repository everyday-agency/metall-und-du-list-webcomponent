import { renderModal } from './Modal';

export function renderCard(item, isLoading = false) {
    if (isLoading) {
        const skeleton = document.createElement('div');
        skeleton.className =
            'mb-4 p-4 border rounded bg-gray-100 flex flex-col lg:flex-row lg:justify-between gap-2 animate-pulse';

        skeleton.innerHTML = `
        <ul class="space-y-2 w-full lg:w-1/2">
            <li class="h-4 w-1/3 bg-gray-300 rounded"></li>
            <li class="h-6 w-2/3 bg-gray-300 rounded"></li>
            <li class="h-4 w-1/2 bg-gray-300 rounded"></li>
            <li class="h-4 w-1/4 bg-gray-300 rounded"></li>
        </ul>
        <ul class="flex flex-col lg:items-end space-y-3 w-full lg:w-1/2 mt-4 lg:mt-0">
            <li class="flex items-center gap-2 lg:flex-row-reverse">
                <span class="w-[1rem] h-[1rem] bg-gray-300 rounded-full flex-shrink-0"></span>
                <span class="h-4 w-40 bg-gray-300 rounded"></span>
            </li>
            <li class="flex items-center gap-2 lg:flex-row-reverse">
                <span class="w-[1rem] h-[1rem] bg-gray-300 rounded-full flex-shrink-0"></span>
                <span class="h-4 w-48 bg-gray-300 rounded"></span>
            </li>
            <li class="mt-4">
                <div class="h-10 w-40 bg-gray-300 rounded-lg"></div>
            </li>
        </ul>
    `;

        return skeleton;
    }

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

function renderSkeletton() {}
