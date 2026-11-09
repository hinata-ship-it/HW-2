document.addEventListener('DOMContentLoaded', function() {
    const sourceJson = `{
      "event": {
        "title": "Ночь в музее",
        "date": "15 ноября, 18:30",
        "place": "Музей космонавтики, проспект Мира, 111",
        "description": "Вечерняя программа с выставкой и экскурсиями",
        "meeting": "Сбор: 18:30. Начало: 19:00."
      },
      "services": [
        { "id": "guide", "title": "Экскурсия с гидом", "price": 500 },
        { "id": "audio", "title": "Аудиогид", "price": 350 },
        { "id": "catalog", "title": "Каталог выставки", "price": 250 }
      ]
    }`;

    let data;

    try {
        data = JSON.parse(sourceJson);

        const eventDate = document.getElementById('event-date');
        const eventPlace = document.getElementById('event-place');
        const eventDescription = document.getElementById('event-description');

        if (eventDate) eventDate.textContent = data.event.date;
        if (eventPlace) eventPlace.textContent = data.event.place;
        if (eventDescription) eventDescription.textContent = data.event.description;

        const showProgramBtn = document.getElementById('show-program');
        const programDiv = document.getElementById('program');

        if (showProgramBtn && programDiv) {
            showProgramBtn.addEventListener('click', function() {
                programDiv.textContent = data.event.meeting;
                programDiv.hidden = false;
            });
        }

        const serviceForm = document.getElementById('service-form');
        if (serviceForm) {
            serviceForm.hidden = false;
        }
    } catch (error) {
        console.error('Ошибка парсинга JSON:', error);
        const dataError = document.getElementById('data-error');
        if (dataError) {
            dataError.textContent = 'Ошибка загрузки данных.';
            dataError.hidden = false;
        }
        const serviceForm = document.getElementById('service-form');
        if (serviceForm) serviceForm.hidden = true;
    }

    function buildReport(services, guideChecked, audioChecked, catalogChecked) {
        const selectedServices = services.filter(service => {
            if (service.id === 'guide' && guideChecked) return true;
            if (service.id === 'audio' && audioChecked) return true;
            if (service.id === 'catalog' && catalogChecked) return true;
            return false;
        });

        const items = selectedServices.map(({ title, price }) => ({
            title: title.trim(),
            price: price
        }));

        const total = items.reduce((sum, item) => sum + item.price, 0);

        return {
            count: items.length,
            total: total,
            items: items
        };
    }

    const serviceForm = document.getElementById('service-form');
    if (serviceForm) {
        serviceForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const guideChecked = document.getElementById('guide')?.checked || false;
            const audioChecked = document.getElementById('audio')?.checked || false;
            const catalogChecked = document.getElementById('catalog')?.checked || false;

            const choiceErrorDiv = document.getElementById('choice-error');
            const resultDiv = document.getElementById('result');
            const reportJsonDiv = document.getElementById('report-json');

            if (!guideChecked && !audioChecked && !catalogChecked) {
                if (choiceErrorDiv) choiceErrorDiv.hidden = false;
                if (resultDiv) resultDiv.hidden = true;
                if (reportJsonDiv) reportJsonDiv.hidden = true;
                return;
            }

            if (choiceErrorDiv) choiceErrorDiv.hidden = true;

            const report = buildReport(data.services, guideChecked, audioChecked, catalogChecked);

            let resultHTML = `Выбрано услуг: ${report.count}<br>Итого: ${report.total} руб.<br>`;
            report.items.forEach(item => {
                resultHTML += `${item.title} — ${item.price} руб.<br>`;
            });

            if (resultDiv) {
                resultDiv.innerHTML = resultHTML;
                resultDiv.hidden = false;
            }

            if (reportJsonDiv) {
                reportJsonDiv.textContent = JSON.stringify(report, null, 2);
                reportJsonDiv.hidden = false;
            }
        });
    }
});
