document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const symptomForm = document.getElementById('symptom-form');
    const symptomType = document.getElementById('symptom-type');
    const otherSymptomContainer = document.getElementById('other-symptom-container');
    const otherSymptom = document.getElementById('other-symptom');
    const severitySlider = document.getElementById('severity');
    const severityValue = document.getElementById('severity-value');
    const symptomDate = document.getElementById('symptom-date');
    const notes = document.getElementById('notes');
    const viewToggle = document.getElementById('view-toggle');
    const tableView = document.getElementById('table-view');
    const listView = document.getElementById('list-view');
    const symptomHistory = document.getElementById('symptom-history');
    const symptomsListView = document.getElementById('symptoms-list-view');
    const emptyState = document.getElementById('empty-state');
    const totalSymptomsElement = document.querySelector('.symptom-card:nth-child(1) p.text-3xl');
    const recentSymptomElement = document.querySelector('.symptom-card:nth-child(2) .symptom-tag');
    const recentSeverityElement = document.querySelector('.symptom-card:nth-child(2) .text-sm');
    const recentDateElement = document.querySelector('.symptom-card:nth-child(2) p.text-sm');
    const trackingDaysElement = document.querySelector('.symptom-card:nth-child(3) p.text-3xl');
    const trackingTextElement = document.querySelector('.symptom-card:nth-child(3) p.text-sm');
    
    // New elements
    const trendsVisualization = document.getElementById('trends-visualization');
    const filterButton = document.getElementById('filter-button');
    const trendsButton = document.getElementById('trends-button');
    const shareButton = document.getElementById('share-button');
    const filterModal = document.getElementById('filter-modal');
    const closeFilterModal = document.getElementById('close-filter-modal');
    const applyFilterButton = document.getElementById('apply-filter');
    const filterSymptomType = document.getElementById('filter-symptom-type');
    const filterMinSeverity = document.getElementById('filter-min-severity');
    const filterMaxSeverity = document.getElementById('filter-max-severity');
    const filterMinSeverityValue = document.getElementById('filter-min-severity-value');
    const filterMaxSeverityValue = document.getElementById('filter-max-severity-value');
    const filterFromDate = document.getElementById('filter-from-date');
    const filterToDate = document.getElementById('filter-to-date');
    const shareModal = document.getElementById('share-modal');
    const closeShareModal = document.getElementById('close-share-modal');
    const generateReportButton = document.getElementById('generate-report');
    
    // Initialize symptom data from localStorage or empty array
    let symptoms = JSON.parse(localStorage.getItem('symptoms')) || [];
    
    // Set current date and time as default
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    symptomDate.value = `${year}-${month}-${day}T${hours}:${minutes}`;
    
    // Show or hide "other" symptom input based on selection
    symptomType.addEventListener('change', function() {
        if (this.value === 'other') {
            otherSymptomContainer.classList.remove('hidden');
        } else {
            otherSymptomContainer.classList.add('hidden');
        }
    });
    
    // Update severity value display
    severitySlider.addEventListener('input', function() {
        severityValue.textContent = `${this.value}/10`;
    });
    
    // Toggle between table and list view
    viewToggle.addEventListener('click', function() {
        const currentView = this.getAttribute('data-current-view');
        
        if (currentView === 'table') {
            tableView.classList.add('hidden');
            listView.classList.remove('hidden');
            this.setAttribute('data-current-view', 'list');
            this.innerHTML = '<i class="fas fa-table mr-1"></i> Table View';
        } else {
            tableView.classList.remove('hidden');
            listView.classList.add('hidden');
            this.setAttribute('data-current-view', 'table');
            this.innerHTML = '<i class="fas fa-list mr-1"></i> List View';
        }
    });
    
    // Handle form submission
    symptomForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        let symptomName = symptomType.value;
        if (!symptomName) {
            showNotification('Please select a symptom type', 'error');
            return;
        }
        
        if (symptomName === 'other') {
            if (!otherSymptom.value.trim()) {
                showNotification('Please specify your symptom', 'error');
                return;
            }
            symptomName = otherSymptom.value.trim();
        }
        
        if (!symptomDate.value) {
            showNotification('Please select a date and time', 'error');
            return;
        }
        
        // Create new symptom object
        const newSymptom = {
            id: Date.now(), // Unique ID
            type: symptomType.value,
            name: symptomName,
            severity: severitySlider.value,
            date: symptomDate.value,
            notes: notes.value.trim(),
            timestamp: new Date(symptomDate.value).getTime()
        };
        
        // Add to symptoms array
        symptoms.unshift(newSymptom); // Add to beginning for chronological order
        
        // Save to localStorage
        localStorage.setItem('symptoms', JSON.stringify(symptoms));
        
        // Update UI
        updateSymptomDisplay();
        
        // Reset form
        symptomForm.reset();
        otherSymptomContainer.classList.add('hidden');
        severitySlider.value = 5;
        severityValue.textContent = '5/10';
        symptomDate.value = `${year}-${month}-${day}T${hours}:${minutes}`;
        
        showNotification('Symptom logged successfully', 'success');
    });
    
    // Enhanced filter functionality with modal
    filterButton.addEventListener('click', function() {
        // Set default dates if not already set
        if (!filterFromDate.value && symptoms.length > 0) {
            const oldestDate = new Date(symptoms[symptoms.length - 1].date);
            filterFromDate.value = oldestDate.toISOString().split('T')[0];
        }
        
        if (!filterToDate.value) {
            const today = new Date();
            filterToDate.value = today.toISOString().split('T')[0];
        }
        
        // Show filter modal
        filterModal.classList.remove('hidden');
    });
    
    // Update filter range values
    filterMinSeverity.addEventListener('input', function() {
        filterMinSeverityValue.textContent = this.value;
        // Ensure min doesn't exceed max
        if (parseInt(this.value) > parseInt(filterMaxSeverity.value)) {
            filterMaxSeverity.value = this.value;
            filterMaxSeverityValue.textContent = this.value;
        }
    });
    
    filterMaxSeverity.addEventListener('input', function() {
        filterMaxSeverityValue.textContent = this.value;
        // Ensure max doesn't go below min
        if (parseInt(this.value) < parseInt(filterMinSeverity.value)) {
            filterMinSeverity.value = this.value;
            filterMinSeverityValue.textContent = this.value;
        }
    });
    
    // Close filter modal
    closeFilterModal.addEventListener('click', function() {
        filterModal.classList.add('hidden');
    });
    
    // Apply filter
    applyFilterButton.addEventListener('click', function() {
        const symptomTypeFilter = filterSymptomType.value;
        const minSeverity = parseInt(filterMinSeverity.value);
        const maxSeverity = parseInt(filterMaxSeverity.value);
        const fromDate = filterFromDate.value ? new Date(filterFromDate.value).getTime() : 0;
        const toDate = filterToDate.value ? new Date(filterToDate.value + 'T23:59:59').getTime() : Number.MAX_SAFE_INTEGER;
        
        // Apply filters
        const filteredSymptoms = symptoms.filter(symptom => {
            const matchesType = !symptomTypeFilter || symptom.type === symptomTypeFilter;
            const matchesSeverity = symptom.severity >= minSeverity && symptom.severity <= maxSeverity;
            const symptomTime = new Date(symptom.date).getTime();
            const matchesDate = symptomTime >= fromDate && symptomTime <= toDate;
            
            return matchesType && matchesSeverity && matchesDate;
        });
        
        // Update UI with filtered symptoms
        renderSymptoms(filteredSymptoms);
        
        // Show result message
        if (filteredSymptoms.length === 0) {
            showNotification('No symptoms match your filter criteria', 'info');
        } else {
            showNotification(`Found ${filteredSymptoms.length} matching symptoms`, 'success');
        }
        
        // Close modal
        filterModal.classList.add('hidden');
    });
    
    // Trends button functionality
    trendsButton.addEventListener('click', function() {
        if (symptoms.length === 0) {
            showNotification('No symptoms data available for trends', 'info');
            return;
        }
        
        // Toggle trends visualization
        if (trendsVisualization.classList.contains('hidden')) {
            trendsVisualization.classList.remove('hidden');
            renderCharts();
            this.innerHTML = '<i class="fas fa-chart-line mr-1"></i> Hide Trends';
        } else {
            trendsVisualization.classList.add('hidden');
            this.innerHTML = '<i class="fas fa-chart-line mr-1"></i> View Trends';
        }
    });
    
    // Share button functionality
    shareButton.addEventListener('click', function() {
        if (symptoms.length === 0) {
            showNotification('No symptoms data available to share', 'info');
            return;
        }
        
        // Set default date range if not set
        if (!document.getElementById('share-from-date').value && symptoms.length > 0) {
            const oldestDate = new Date(symptoms[symptoms.length - 1].date);
            document.getElementById('share-from-date').value = oldestDate.toISOString().split('T')[0];
        }
        
        if (!document.getElementById('share-to-date').value) {
            const today = new Date();
            document.getElementById('share-to-date').value = today.toISOString().split('T')[0];
        }
        
        // Show share modal
        shareModal.classList.remove('hidden');
    });
    
    // Close share modal
    closeShareModal.addEventListener('click', function() {
        shareModal.classList.add('hidden');
    });
    
    // Generate report
    generateReportButton.addEventListener('click', function() {
        const recipient = document.getElementById('share-recipient').value;
        const format = document.querySelector('input[name="format"]:checked').value;
        const fromDate = document.getElementById('share-from-date').value;
        const toDate = document.getElementById('share-to-date').value;
        
        // In a real application, this would generate and send the report
        // For this demo, we'll just show a notification
        showNotification(`Report ${format.toUpperCase()} sent to your ${recipient}`, 'success');
        shareModal.classList.add('hidden');
    });
    
    // Function to update symptom display
    function updateSymptomDisplay() {
        renderSymptoms(symptoms);
        updateSummaryCards();
    }
    
    // Function to render symptoms in both table and list views
    function renderSymptoms(symptomsToRender) {
        // Clear current displays
        symptomHistory.innerHTML = '';
        symptomsListView.innerHTML = '';
        
        if (symptomsToRender.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
            
            // Populate table view
            symptomsToRender.forEach(symptom => {
                const row = document.createElement('tr');
                
                // Format date for display
                const dateObj = new Date(symptom.date);
                const formattedDate = dateObj.toLocaleDateString() + ' ' + 
                                     dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                
                // Create symptom tag with appropriate class
                let tagClass = '';
                if (['headache', 'nausea', 'fatigue', 'fever', 'cough', 'muscle-pain', 'shortness-of-breath'].includes(symptom.type)) {
                    tagClass = symptom.type;
                }
                
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${formattedDate}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="symptom-tag ${tagClass}">${symptom.name}</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div class="flex items-center">
                            <span class="mr-2">${symptom.severity}/10</span>
                            <div class="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div class="bg-blue-500 h-full" style="width: ${symptom.severity * 10}%"></div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-900 max-w-xs">
                        <div class="line-clamp-2">${symptom.notes || 'No notes'}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button class="text-blue-600 hover:text-blue-900 mr-3" data-id="${symptom.id}" data-action="edit">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button class="text-red-600 hover:text-red-900" data-id="${symptom.id}" data-action="delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                
                symptomHistory.appendChild(row);
                
                // Add event listeners to action buttons
                const editButton = row.querySelector('[data-action="edit"]');
                const deleteButton = row.querySelector('[data-action="delete"]');
                
                editButton.addEventListener('click', () => editSymptom(symptom.id));
                deleteButton.addEventListener('click', () => deleteSymptom(symptom.id));
            });
            
            // Populate list view
            symptomsToRender.forEach(symptom => {
                const listItem = document.createElement('div');
                listItem.className = 'bg-white rounded-lg shadow-md p-4 mb-4';
                
                // Format date for display
                const dateObj = new Date(symptom.date);
                const formattedDate = dateObj.toLocaleDateString() + ' ' + 
                                     dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                
                // Create symptom tag with appropriate class
                let tagClass = '';
                if (['headache', 'nausea', 'fatigue', 'fever', 'cough', 'muscle-pain', 'shortness-of-breath'].includes(symptom.type)) {
                    tagClass = symptom.type;
                }
                
                listItem.innerHTML = `
                    <div class="flex justify-between items-start">
                        <div>
                            <span class="symptom-tag ${tagClass} mb-2">${symptom.name}</span>
                            <p class="text-sm text-gray-500">${formattedDate}</p>
                        </div>
                        <div class="flex space-x-2">
                            <button class="text-blue-600 hover:text-blue-900" data-id="${symptom.id}" data-action="edit">
                                <i class="fas fa-pen"></i>
                            </button>
                            <button class="text-red-600 hover:text-red-900" data-id="${symptom.id}" data-action="delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="flex items-center mt-3">
                        <span class="text-sm font-medium text-gray-700 mr-2">Severity: ${symptom.severity}/10</span>
                        <div class="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div class="bg-blue-500 h-full" style="width: ${symptom.severity * 10}%"></div>
                        </div>
                    </div>
                    <p class="text-sm text-gray-700 mt-3">${symptom.notes || 'No notes'}</p>
                `;
                
                symptomsListView.appendChild(listItem);
                
                // Add event listeners to action buttons
                const editButton = listItem.querySelector('[data-action="edit"]');
                const deleteButton = listItem.querySelector('[data-action="delete"]');
                
                editButton.addEventListener('click', () => editSymptom(symptom.id));
                deleteButton.addEventListener('click', () => deleteSymptom(symptom.id));
            });
        }
    }
    
    // Function to update summary cards
    function updateSummaryCards() {
        // Update total symptoms
        totalSymptomsElement.textContent = symptoms.length;
        
        // Update most recent symptom
        if (symptoms.length > 0) {
            const mostRecent = symptoms[0]; // First element is the most recent
            
            // Create symptom tag with appropriate class
            let tagClass = '';
            if (['headache', 'nausea', 'fatigue', 'fever', 'cough', 'muscle-pain', 'shortness-of-breath'].includes(mostRecent.type)) {
                tagClass = mostRecent.type;
            }
            
            recentSymptomElement.className = `symptom-tag ${tagClass}`;
            recentSymptomElement.textContent = mostRecent.name;
            recentSeverityElement.textContent = `${mostRecent.severity}/10 severity`;
            
            const dateObj = new Date(mostRecent.date);
            recentDateElement.textContent = dateObj.toLocaleDateString() + ' ' + 
                                           dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            // Update tracking days
            const firstSymptomDate = new Date(symptoms[symptoms.length - 1].date); // Last element is the oldest
            const trackingDays = Math.ceil((now - firstSymptomDate) / (1000 * 60 * 60 * 24));
            
            trackingDaysElement.textContent = `${trackingDays} days`;
            trackingTextElement.textContent = `Since ${firstSymptomDate.toLocaleDateString()}`;
        } else {
            recentSymptomElement.className = 'symptom-tag';
            recentSymptomElement.textContent = 'None';
            recentSeverityElement.textContent = '0/10 severity';
            recentDateElement.textContent = 'No date recorded';
            
            trackingDaysElement.textContent = '0 days';
            trackingTextElement.textContent = 'No tracking started';
        }
    }
    
    // Function to render charts
    function renderCharts() {
        if (symptoms.length === 0) return;
        
        // Count occurrences of each symptom type
        const symptomCounts = {};
        symptoms.forEach(symptom => {
            const name = symptom.name;
            symptomCounts[name] = (symptomCounts[name] || 0) + 1;
        });
        
        // Prepare data for frequency chart
        const frequencyLabels = Object.keys(symptomCounts);
        const frequencyData = Object.values(symptomCounts);
        const frequencyColors = frequencyLabels.map(label => {
            switch(label.toLowerCase()) {
                case 'headache': return '#1e40af';
                case 'nausea': return '#3f6212';
                case 'fatigue': return '#854d0e';
                case 'fever': return '#991b1b';
                case 'cough': return '#3730a3';
                case 'muscle pain': return '#9a3412';
                case 'shortness of breath': return '#1e3a8a';
                default: return '#4b5563';
            }
        });
        
        // Create frequency chart
        const frequencyChart = new Chart(
            document.getElementById('frequency-chart'),
            {
                type: 'bar',
                data: {
                    labels: frequencyLabels,
                    datasets: [{
                        label: 'Frequency',
                        data: frequencyData,
                        backgroundColor: frequencyColors,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                precision: 0
                            }
                        }
                    }
                }
            }
        );
        
        // Prepare data for severity over time chart
        // Sort symptoms by date
        const sortedSymptoms = [...symptoms].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Group by symptom type
        const symptomTypes = [...new Set(sortedSymptoms.map(s => s.name))];
        const datasets = symptomTypes.map(type => {
            const symptomData = sortedSymptoms
                .filter(s => s.name === type)
                .map(s => ({
                    x: new Date(s.date),
                    y: s.severity
                }));
            
            let color;
            switch(type.toLowerCase()) {
                case 'headache': color = '#1e40af'; break;
                case 'nausea': color = '#3f6212'; break;
                case 'fatigue': color = '#854d0e'; break;
                case 'fever': color = '#991b1b'; break;
                case 'cough': color = '#3730a3'; break;
                case 'muscle pain': color = '#9a3412'; break;
                case 'shortness of breath': color = '#1e3a8a'; break;
                default: color = '#4b5563';
            }
            
            return {
                label: type,
                data: symptomData,
                borderColor: color,
                backgroundColor: color + '33', // Add transparency
                tension: 0.1
            };
        });
        
        // Create severity chart
        const severityChart = new Chart(
            document.getElementById('severity-chart'),
            {
                type: 'line',
                data: {
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'day'
                            }
                        },
                        y: {
                            beginAtZero: true,
                            max: 10
                        }
                    }
                }
            }
        );
    }
    
    // Function to edit a symptom
    function editSymptom(id) {
        const symptomToEdit = symptoms.find(s => s.id === id);
        if (!symptomToEdit) return;
        
        // Populate form with symptom data
        symptomType.value = symptomToEdit.type;
        
        if (symptomToEdit.type === 'other') {
            otherSymptomContainer.classList.remove('hidden');
            otherSymptom.value = symptomToEdit.name;
        } else {
            otherSymptomContainer.classList.add('hidden');
        }
        
        severitySlider.value = symptomToEdit.severity;
        severityValue.textContent = `${symptomToEdit.severity}/10`;
        symptomDate.value = symptomToEdit.date;
        notes.value = symptomToEdit.notes;
        
        // Change submit button to update
        const submitButton = symptomForm.querySelector('button[type="submit"]');
        submitButton.innerHTML = '<i class="fas fa-save mr-1"></i> Update Symptom';
        submitButton.classList.add('editing');
        submitButton.setAttribute('data-edit-id', id);
        
        // Scroll to form
        symptomForm.scrollIntoView({ behavior: 'smooth' });
        
        // Replace the submit event handler with an update handler
        const originalSubmitHandler = symptomForm.onsubmit;
        symptomForm.onsubmit = function(e) {
            e.preventDefault();
            
            // Validate form (same as before)
            let symptomName = symptomType.value;
            if (!symptomName) {
                showNotification('Please select a symptom type', 'error');
                return;
            }
            
            if (symptomName === 'other') {
                if (!otherSymptom.value.trim()) {
                    showNotification('Please specify your symptom', 'error');
                    return;
                }
                symptomName = otherSymptom.value.trim();
            }
            
            if (!symptomDate.value) {
                showNotification('Please select a date and time', 'error');
                return;
            }
            
            // Update the symptom
            const index = symptoms.findIndex(s => s.id === id);
            symptoms[index] = {
                ...symptoms[index],
                type: symptomType.value,
                name: symptomName,
                severity: severitySlider.value,
                date: symptomDate.value,
                notes: notes.value.trim(),
                timestamp: new Date(symptomDate.value).getTime()
            };
            
            // Save to localStorage
            localStorage.setItem('symptoms', JSON.stringify(symptoms));
            
            // Update UI
            updateSymptomDisplay();
            
            // Reset form
            symptomForm.reset();
            otherSymptomContainer.classList.add('hidden');
            severitySlider.value = 5;
            severityValue.textContent = '5/10';
            symptomDate.value = `${year}-${month}-${day}T${hours}:${minutes}`;
            
            // Restore submit button
            submitButton.innerHTML = '<i class="fas fa-plus mr-1"></i> Add Symptom';
            submitButton.classList.remove('editing');
            submitButton.removeAttribute('data-edit-id');
            
            // Restore original submit handler
            symptomForm.onsubmit = originalSubmitHandler;
            
            showNotification('Symptom updated successfully', 'success');
        };
    }
    
    // Function to delete a symptom
    function deleteSymptom(id) {
        if (confirm('Are you sure you want to delete this symptom?')) {
            // Remove from array
            symptoms = symptoms.filter(s => s.id !== id);
            
            // Save to localStorage
            localStorage.setItem('symptoms', JSON.stringify(symptoms));
            
            // Update UI
            updateSymptomDisplay();
            
            showNotification('Symptom deleted successfully', 'success');
        }
    }
    
    // Function to show notification
    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed bottom-4 right-4 py-2 px-4 rounded-md shadow-md notification ${type}`;
        
        // Set colors based on type
        switch (type) {
            case 'success':
                notification.classList.add('bg-green-500', 'text-white');
                break;
            case 'error':
                notification.classList.add('bg-red-500', 'text-white');
                break;
            case 'info':
                notification.classList.add('bg-blue-500', 'text-white');
                break;
            default:
                notification.classList.add('bg-gray-700', 'text-white');
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Initialize the UI
    updateSymptomDisplay();
}); 