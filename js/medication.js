document.addEventListener('DOMContentLoaded', function() {
    // Initialize medication management functionality
    const addMedicationBtn = document.getElementById('add-medication');
    const medicationList = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.gap-4');
    const scheduleList = document.querySelector('.divide-y');
    const historyTable = document.querySelector('table tbody');

    // Sample medication data
    let medications = [
        {
            id: 1,
            name: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            nextDose: '8:00 AM',
            remaining: 75
        },
        {
            id: 2,
            name: 'Metformin',
            dosage: '500mg',
            frequency: 'Twice daily',
            nextDose: '1:00 PM',
            remaining: 45
        }
    ];

    // Handle add medication button click
    addMedicationBtn.addEventListener('click', function() {
        showAddMedicationModal();
    });

    // Function to show add medication modal
    function showAddMedicationModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 class="text-xl font-semibold mb-4">Add New Medication</h3>
                <form id="medication-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Medication Name</label>
                        <input type="text" name="name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Dosage</label>
                        <input type="text" name="dosage" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Frequency</label>
                        <select name="frequency" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required>
                            <option value="Once daily">Once daily</option>
                            <option value="Twice daily">Twice daily</option>
                            <option value="Three times daily">Three times daily</option>
                            <option value="As needed">As needed</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Next Dose Time</label>
                        <input type="time" name="nextDose" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" required>
                    </div>
                    <div class="flex justify-end space-x-3">
                        <button type="button" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200" onclick="this.closest('.fixed').remove()">
                            Cancel
                        </button>
                        <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">
                            Add Medication
                        </button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        // Handle form submission
        const form = modal.querySelector('#medication-form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            const newMedication = {
                id: medications.length + 1,
                name: formData.get('name'),
                dosage: formData.get('dosage'),
                frequency: formData.get('frequency'),
                nextDose: formData.get('nextDose'),
                remaining: 100
            };
            medications.push(newMedication);
            updateMedicationDisplay();
            modal.remove();
        });
    }

    // Function to update medication display
    function updateMedicationDisplay() {
        // Update current medications
        medicationList.innerHTML = medications.map(med => `
            <div class="bg-${med.id % 2 === 0 ? 'green' : 'blue'}-50 p-4 rounded-lg border border-${med.id % 2 === 0 ? 'green' : 'blue'}-200">
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="font-semibold text-lg">${med.name}</h4>
                        <p class="text-sm text-gray-600">${med.dosage} - ${med.frequency}</p>
                        <p class="text-sm text-gray-600 mt-1">Next dose: Today at ${med.nextDose}</p>
                    </div>
                    <div class="flex space-x-2">
                        <button class="text-blue-500 hover:text-blue-600" onclick="editMedication(${med.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="text-red-500 hover:text-red-600" onclick="deleteMedication(${med.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="mt-3">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-${med.id % 2 === 0 ? 'green' : 'blue'}-500 h-2 rounded-full" style="width: ${med.remaining}%"></div>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">${med.remaining}% remaining</p>
                </div>
            </div>
        `).join('');

        // Update schedule
        scheduleList.innerHTML = medications.map(med => `
            <div class="p-4 flex items-center justify-between hover:bg-gray-50">
                <div class="flex items-center">
                    <div class="w-12 h-12 bg-${med.id % 2 === 0 ? 'green' : 'blue'}-100 rounded-full flex items-center justify-center mr-4">
                        <i class="fas fa-${med.id % 2 === 0 ? 'capsules' : 'pills'} text-${med.id % 2 === 0 ? 'green' : 'blue'}-500"></i>
                    </div>
                    <div>
                        <h4 class="font-semibold">${med.name}</h4>
                        <p class="text-sm text-gray-600">${med.dosage} - 1 tablet</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-semibold">${med.nextDose}</p>
                    <p class="text-sm text-green-500">Upcoming</p>
                </div>
            </div>
        `).join('');

        // Update history
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        historyTable.innerHTML = medications.map(med => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Today, ${med.nextDose}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${med.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${med.dosage}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Taken
                    </span>
                </td>
            </tr>
        `).join('');
    }

    // Function to edit medication
    window.editMedication = function(id) {
        const medication = medications.find(m => m.id === id);
        if (medication) {
            showAddMedicationModal();
            const form = document.querySelector('#medication-form');
            form.name.value = medication.name;
            form.dosage.value = medication.dosage;
            form.frequency.value = medication.frequency;
            form.nextDose.value = medication.nextDose;
            
            // Update form submission to handle edit
            form.onsubmit = function(e) {
                e.preventDefault();
                const formData = new FormData(form);
                medication.name = formData.get('name');
                medication.dosage = formData.get('dosage');
                medication.frequency = formData.get('frequency');
                medication.nextDose = formData.get('nextDose');
                updateMedicationDisplay();
                form.closest('.fixed').remove();
            };
        }
    };

    // Function to delete medication
    window.deleteMedication = function(id) {
        if (confirm('Are you sure you want to delete this medication?')) {
            medications = medications.filter(m => m.id !== id);
            updateMedicationDisplay();
        }
    };

    // Initialize display
    updateMedicationDisplay();
}); 