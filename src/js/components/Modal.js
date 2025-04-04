export function renderModal(item) {
    const template = `
        <div class="modal fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div class="bg-white p-6 rounded shadow-lg w-80 max-w-full relative">
                <button class="close-modal absolute top-2 right-2 text-gray-600 text-xl">×</button>
                <h2 class="text-xl font-semibold mb-2">Kontaktdaten</h2>
                <p>${item.contactPerson ?? 'Kein Kontakt verfügbar'}</p>
                <p>${item.contactEmail ?? ''}</p>
                <p>${item.contactPhone ?? ''}</p>
            </div>
        </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = template;

    const modal = wrapper.firstElementChild;

    // ✅ Add close logic
    modal.querySelector('.close-modal')?.addEventListener('click', () => {
        modal.remove(); // Remove modal from DOM
    });

    // ✅ Optional: also close on clicking outside modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // ✅ Append modal to document body
    document.body.appendChild(modal);
}
