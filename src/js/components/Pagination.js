export function renderPagination({
    container,
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
}) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return;

    const nav = document.createElement('nav');
    nav.className = 'flex gap-2 my-4 flex-wrap justify-center';

    const createButton = (label, page, isActive = false, disabled = false) => {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.className = `px-3 py-1 rounded border transition ${
            isActive ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

        if (!disabled) {
            btn.addEventListener('click', () => {
                onPageChange(page);
                container.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            });
        }

        return btn;
    };

    nav.appendChild(
        createButton('« Prev', currentPage - 1, false, currentPage === 1)
    );

    const maxVisible = 7;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > totalPages) {
        end = totalPages;
        start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
        nav.appendChild(createButton(i, i, i === currentPage));
    }

    nav.appendChild(
        createButton(
            'Next »',
            currentPage + 1,
            false,
            currentPage === totalPages
        )
    );

    container.appendChild(nav);
}
