document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('jsonForm');
    const jsonInput = document.getElementById('jsonInput');
    const errorElement = document.getElementById('error');
    const filters = document.getElementById('filters');
    const filterAlphabets = document.getElementById('filterAlphabets');
    const filterNumbers = document.getElementById('filterNumbers');
    const filterHighestLowercase = document.getElementById('filterHighestLowercase');
    const responseContainer = document.getElementById('response');
    const noResults = document.getElementById('noResults');
    const dropdownButton = document.getElementById('dropdownMenuButton');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const input = jsonInput.value;

        let parsedJson;
        try {
            parsedJson = JSON.parse(input);
            if (!parsedJson.data || !Array.isArray(parsedJson.data)) {
                throw new Error('Invalid JSON format or "data" array missing.');
            }
            errorElement.textContent = '';
        } catch (error) {
            errorElement.textContent = 'Invalid JSON format.';
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/bfhl', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(parsedJson),
            });

            const data = await response.json();

            filters.style.display = 'block';

            dropdownButton.addEventListener('click', () => {
                dropdownMenu.classList.toggle('show');
            });

            document.querySelectorAll('.dropdown-menu .form-check-input').forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    renderFilteredResponse(data);
                });
            });

            renderFilteredResponse(data);

        } catch (error) {
            errorElement.textContent = 'Error fetching API response.';
        }
    });

    const renderFilteredResponse = (data) => {
        const selectedOptions = [];
        if (filterAlphabets.checked) selectedOptions.push('alphabets');
        if (filterNumbers.checked) selectedOptions.push('numbers');
        if (filterHighestLowercase.checked) selectedOptions.push('highest_lowercase');

        let filteredData = [];

        if (selectedOptions.includes('alphabets')) {
            filteredData.push(...data.alphabets);
        }

        if (selectedOptions.includes('numbers')) {
            filteredData.push(...data.numbers);
        }

        if (selectedOptions.includes('highest_lowercase')) {
            filteredData.push(...data.highest_lowercase_alphabet);
        }

        // Display response
        if (filteredData.length > 0) {
            noResults.style.display = 'none';
            responseContainer.innerHTML = filteredData.map(item => `<div class="alert">${item}</div>`).join('');
        } else {
            noResults.style.display = 'block';
            responseContainer.innerHTML = '';
        }
    };
});
