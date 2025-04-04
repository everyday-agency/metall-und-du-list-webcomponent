export function renderModal(item) {
    const template = `
        <div class="modal fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div class="bg-white p-6 rounded shadow-lg w-3/4 relative">
                <button class="close-modal absolute top-2 right-2 text-gray-600 text-3xl pr-3">×</button>
                <div class="flex flex-col lg:flex-row gap-4 justify-between items-center p-6">
                    <div>
                        <p class="text-sm">${item.professionNameDeMf}</p>
                        <h2 class="font-bold text-2xl">${item.locationName}</h2>
                        <p>${item.locationStreet} ${
        item.locationHouseNumber
    }</p>
                        <p>${item.locationZipCode} 
                        ${item.locationLocalityNameDe}</p>
                    <div class="mt-4">
                        <h3 class="font-bold">Kontaktdaten Bewerbung</h3>
                        <p>${renderContactName(item)}</p>
                        <p>${renderEmail(item)}</p>
                        <p>${renderPhone(item)}</p>
                    </div>
                </div>
                <div>
                    <ul class="flex flex-col lg:items-end">
                        ${renderAdditionalInfromation(item)}
                    </ul>
                    <div class="mt-4">                        
                        ${renderURL(item)}
                    </div>
                </div>
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

function renderContactName(item) {
    const contactFirstName =
        item.applicationPersonFirstname || item.locationContactPersonFirstname;
    const contactLastName =
        item.applicationPersonLastname || item.locationContactPersonLastname;
    const contactName =
        contactFirstName && contactLastName
            ? `${contactFirstName} ${contactLastName}`
            : contactFirstName || contactLastName;
    return contactName ? `<p>${contactName}</p>` : '';
}

function renderEmail(item) {
    const selectedEmail =
        item.apprenticeshipPlaceSchoolYears?.[0]?.email ||
        item.applicationEmail ||
        item.locationEmail;

    const emailHTML = selectedEmail
        ? `<a href="mailto:${selectedEmail}" class="text-black underline">${selectedEmail}</a>`
        : '';

    return emailHTML;
}

function renderPhone(item) {
    const phone = item.applicationBusinessPhone || item.locationBusinessPhone;

    const phoneData = phone ? formatPhoneNumber(phone) : null;

    const phoneHTML = phoneData
        ? `<a href="tel:${phoneData.href}" class="text-black underline">${phoneData.formatted}</a>`
        : '';

    return phoneHTML;
}

function formatPhoneNumber(phoneNumber) {
    // Remove all non-digit characters
    let digits = phoneNumber.replace(/\D/g, '');

    // Remove 0041 / 41 / 0 prefixes
    if (digits.startsWith('0041')) {
        digits = digits.slice(4);
    } else if (digits.startsWith('41')) {
        digits = digits.slice(2);
    } else if (digits.startsWith('0')) {
        digits = digits.slice(1);
    }

    const href = `+41${digits}`;
    const formatted = digits.replace(
        /(\d{2})(\d{3})(\d{2})(\d{2})/,
        '+41 $1 $2 $3 $4'
    );

    return { href, formatted };
}

function renderAdditionalInfromation(item) {
    const additionalInfoHTML = `<li class="flex items-center gap-2">Offene Lehrstelle 2025 ${
        item.apprenticeshipPlaceSchoolYears
            ? '<span class="flex bg-green-500 w-[1rem] h-[1rem] rounded-full"></span>'
            : '<span class="flex bg-red-500 w-[1rem] h-[1rem] rounded-full"></span>'
    }</li>
            <li class="flex items-center gap-2">Schnupperlehre auf Anfrage möglich <span class="flex bg-green-500 w-[1rem] h-[1rem] rounded-full"></span> </li>
            `;
    return additionalInfoHTML;
}

function renderURL(item) {
    const url =
        item.apprenticeshipPlaceSchoolYears?.[0]?.url ||
        item.applicationUrl ||
        item.locationUrl;

    const urlHTML = url
        ? `<h3 class="font-bold">Mehr über das Unternehmen erfahren</h3>
        <a href="${url}" class="text-black underline">${item.locationName}</a>`
        : '';

    return urlHTML;
}
