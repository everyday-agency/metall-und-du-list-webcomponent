export function renderSelectFilter({
    container,
    labelText,
    options,
    selectedValue,
    onChange,
    defaultOptionText = 'Alle auswählen',
}) {
    const wrapper = document.createElement('div');
    wrapper.className = 'mb-4';

    const label = document.createElement('label');
    label.textContent = labelText;
    label.className = 'mr-2';

    const select = document.createElement('select');
    select.className = 'p-2 border rounded';
    select.innerHTML = `<option value="">${defaultOptionText}</option>`;

    options.forEach((opt) => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        select.appendChild(option);
    });

    select.value = selectedValue || '';
    select.addEventListener('change', (e) => onChange(e.target.value));

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    container.appendChild(wrapper);
}
