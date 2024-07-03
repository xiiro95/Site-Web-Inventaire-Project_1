var iplocal = '127.0.0.1';

function showNotification(message, type) {
    const notificationContainer = document.getElementById('notification-container');

    const notification = document.createElement('div');
    notification.classList.add('notification', type);

    const messageElem = document.createElement('span');
    messageElem.textContent = message;
    notification.appendChild(messageElem);

    const closeBtn = document.createElement('button');
    closeBtn.classList.add('close-btn');
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = () => notificationContainer.removeChild(notification);
    notification.appendChild(closeBtn);

    notificationContainer.appendChild(notification);

    setTimeout(() => {
        if (notificationContainer.contains(notification)) {
            notificationContainer.removeChild(notification);
        }
    }, 5000); // Auto-remove after 5 seconds
}




const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.navbar a');

const sections2 = document.querySelectorAll('.section2');
const navLinks2 = document.querySelectorAll('.navbar2 a');

function showSection(sectionsName ,sectionId) {
    sectionsName.forEach(section => {
        if (section.id === sectionId) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const sectionId = this.getAttribute('data-section');
        showSection(sections,sectionId);
    });
});

navLinks2.forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const sectionId = this.getAttribute('data-section');
        showSection(sections2, sectionId);
    });
});

showSection(sections,'home');
showSection(sections2,'categoriesconfig');


function validateForm(form) {
    // Obtenir tous les éléments input et select du formulaire
    const inputs = form.querySelectorAll('input, select');
    
    for (let input of inputs) {
        // Vérifier si l'élément est requis (vous pouvez définir cela via l'attribut 'required' ou une classe)
        if (input.required) {
            // Gestion des différents types d'input et select
            if (input.tagName === 'SELECT' && input.value === undefined) {
                showNotification('Veuillez sélectionner une option pour ' + input.name,'red');
                //alert('Veuillez sélectionner une option pour ' + input.name);
                return false;
            }
            if (input.type === 'text' && input.value.trim() === '') {
                showNotification('Veuillez remplir le champ ' + input.name,'red');
                //alert('Veuillez remplir le champ ' + input.name);
                return false;
            }
            if (input.type === 'email' && !input.value.match(/^[^@]+@[^@]+\.[^@]+$/)) {
                showNotification('Veuillez fournir une adresse email valide pour ' + input.name,'red');
                //alert('Veuillez fournir une adresse email valide pour ' + input.name);
                return false;
            }
            if (input.type === 'date' && !input.value) {
                showNotification('Veuillez choisir une date pour ' + input.name,'red');
                //alert('Veuillez choisir une date pour ' + input.name);
                return false;
            }
            // Vous pouvez ajouter d'autres types et validations selon les besoins
        }
    }
    
    return true; // Si toutes les validations sont passées
}

async function sendtoS(endpoint, formData){
    try {
        const response = await fetch(`http://${iplocal}:3000/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        ////////////console.log(response); // Voir l'objet de réponse complet

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        //alert('Mise à jour réussie!');
        showNotification('Mise à jour réussie!','green');
        ////////////console.log('Success:', data);
    } catch (error) {
        console.error('Error:', error);
        showNotification(error.sqlMessage,'red');
        //alert(error.sqlMessage);
    }
    Actualiser();
}

async function submitForm(endpoint, formData) {
    ////////////console.log("Je suis la");

    try {
        const response = await fetch(`http://${iplocal}:3000/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        ////////////console.log(response); // Voir l'objet de réponse complet

        if (!response.ok) {
            const errorData = await response.json(); // Récupérer le corps de la réponse en cas d'erreur
            throw new Error(errorData.error || 'Network response was not ok');
        }

        const data = await response.json();
        //alert('Mise à jour réussie!');
        showNotification('Mise à jour réussie!','green');
        ////////////console.log('Success:', data);
    } catch (error) {
        console.error('Error:', error);
        showNotification('Erreur lors de la mise à jour: ' + error.message,'red');
        //alert('Erreur lors de la mise à jour: ' + error.message);
    }
    
    Actualiser();
}

    document.getElementById('form_import_csv').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const fileInput = document.getElementById('csv_file');
        const formData = new FormData();
        formData.append('csv_file', fileInput.files[0]);

        try {
            const response = await fetch(`http://${iplocal}:3000/importCSV`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'importation du fichier CSV');
            }

            showNotification('Importation réussie!', 'green');
        } catch (error) {
            console.error('Erreur:', error);
            showNotification('Erreur lors de l\'importation du fichier CSV: ' + error.message, 'red');
        }
    });
    

    document.getElementById('formulaire_attribuer').addEventListener('submit', function(e) {
        ////////////console.log("Je submit");
        e.preventDefault(); // Empêcher la soumission normale du formulaire

        const formData = {
                        item_id: document.getElementById('item').value,
                        person_id: document.getElementById('person').value     
                    };

        // Ici, vous pouvez ajouter des validations ou traiter les données
        if (validateForm(document.getElementById('formulaire_attribuer'))) {
            // Si la validation est réussie
            ////////////console.log("Validate From OK");
            submitForm('updateitemtracking', formData);
        } else {
            // Gérer le cas où la validation échoue
            console.error('Validation failed');
        }
    });

    document.getElementById('formulaire_recuperation').addEventListener('submit', function(e) {
        ////////////console.log("Je submit");
        e.preventDefault(); // Empêcher la soumission normale du formulaire

        const formData = {
            item_id: document.getElementById('item_attribuer').value,     
        };

        // Ici, vous pouvez ajouter des validations ou traiter les données
        if (validateForm(document.getElementById('formulaire_recuperation'))) {
            // Si la validation est réussie
            ////////////console.log("Validate From OK");
            submitForm('updateremoveItemperson', formData);
        } else {
            // Gérer le cas où la validation échoue
            console.error('Validation failed');
        }
    });

    document.getElementById('formulaire_addprofil').addEventListener('submit', function(e) {
        ////////////console.log("Je submit");
        //////////console.log("Je lance le programme ici");
        e.preventDefault(); // Empêcher la soumission normale du formulaire

        let formData = {
            name: document.getElementById('addname').value,
            email: document.getElementById('addemail').value        
        };

        // Ici, vous pouvez ajouter des validations ou traiter les données
        if (validateForm(document.getElementById('formulaire_addprofil'))) {
            // Si la validation est réussie
            ////////////console.log("Validate From OK");
            submitForm('addprofil', formData);
            this.reset();
        } else {
            // Gérer le cas où la validation échoue
            console.error('Validation failed');
        }
    });

    document.getElementById('form_add_category').addEventListener('submit', async function(e) {
        e.preventDefault();
        const categoryName = document.getElementById('category_name').value;
        if (validateForm(document.getElementById('form_add_category'))) {
            // Si la validation est réussie
            ////////////console.log("Validate From OK");
            await submitForm('addCategory', { name: categoryName });
            this.reset();
        } else {
            // Gérer le cas où la validation échoue
            console.error('Validation failed');
        }
        loadCategories();
    });

    document.getElementById('form_add_location').addEventListener('submit', async function(e) {
        e.preventDefault();
        const locationName = document.getElementById('location_name').value;

        if (validateForm(document.getElementById('form_add_item'))) {
            // Si la validation est réussie
            ////////////console.log("Validate From OK");
            await submitForm('addLocation', { name: locationName });
        this.reset();
        } else {
            // Gérer le cas où la validation échoue
            console.error('Validation failed');
        }

        loadLocations();
    });
    function getValueOrDefault(value) {
        return value !== undefined ? value : '';
    }

    document.getElementById('form_add_item').addEventListener('submit', async function(e) {
        e.preventDefault();
        const itemCategory = getValueOrDefault(document.getElementById('item_category').value);
        const itemLocation = getValueOrDefault(document.getElementById('item_location').value);
        const itemSerial = getValueOrDefault(document.getElementById('item_serial').value);
        const itemDescription = getValueOrDefault(document.getElementById('item_description').value);
        const itemQuantity = getValueOrDefault(document.getElementById('item_quantity').value);
       
        const formData = {
            category_id: itemCategory,
            location_id : itemLocation,
            serial_number: itemSerial,
            description: itemDescription,
            quantity: itemQuantity
        };
        //////console.log(formData);

        if (validateForm(document.getElementById('form_add_item'))) {
            // Si la validation est réussie
            ////////////console.log("Validate From OK");
            await submitForm('addItems', formData);
            this.reset();;
        } else {
            // Gérer le cas où la validation échoue
            console.error('Validation failed');
        }
    
        
        loadItems();
    });

    document.getElementById('form_add_subcategory').addEventListener('submit', async function(e) {
        e.preventDefault();
        const subcategoryName = document.getElementById('subcategory_name').value;
        const categoryId = document.getElementById('category_id').value;
        console.log(subcategoryName);
        console.log(categoryId);
        if (validateForm(document.getElementById('form_add_subcategory'))) {
            await submitForm('addSubCategory', { name: subcategoryName, category_id: categoryId });
            this.reset();
        } else {
            console.error('Validation failed');
        }
        loadSubCategories();
    });


    
    
var adresse = { 
    'itemdispo': `http://${iplocal}:3000/itemsdispo`,
    'person': `http://${iplocal}:3000/personne`,
    'itematt': `http://${iplocal}:3000/itemsattribuer`,
    'history': `http://${iplocal}:3000/item_history`,
    'categories': `http://${iplocal}:3000/categories`,
    'items': `http://${iplocal}:3000/items`,
    'items2': `http://${iplocal}:3000/items2`,
    'status': `http://${iplocal}:3000/status`,
    'itemtracking': `http://${iplocal}:3000/itemtracking`,
    'locations': `http://${iplocal}:3000/locations`,
    'subcategories':  `http://${iplocal}:3000/subcategories`
}

async function fetchData(e) {
    try {
        const response = await fetch(adresse[e]);
        const data = await response.json();
        ////////console.log(data);
        return data;
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
}

async function getSubCategoryStatusCount() {
    // Récupérer les données des sous-catégories, items, et suivis des items
    const subcategories = await fetchData('subcategories');
    const items = await fetchData('items2');
    const itemTracking = await fetchData('itemtracking');

    // Initialiser un tableau pour stocker les statistiques
    const subCategoryStatusCount = subcategories.map(subcategory => {
        // Filtrer les items appartenant à la sous-catégorie
        const itemsInSubCategory = items.filter(item => item.subcategory_id === subcategory.subcategory_id);
        const total = itemsInSubCategory.length;
        const statusCount = { enStock: 0, attribue: 0, enMaintenance: 0, retire: 0 };

        // Calculer les statistiques des items dans la sous-catégorie
        itemsInSubCategory.forEach(item => {
            const tracking = itemTracking.find(track => track.item_id === item.item_id);
            if (tracking) {
                if (tracking.status_id === 1) statusCount.enStock++;
                if (tracking.status_id === 2) statusCount.attribue++;
                if (tracking.status_id === 3) statusCount.enMaintenance++;
                if (tracking.status_id === 4) statusCount.retire++;
            }
        });

        // Retourner les statistiques de la sous-catégorie
        return {
            subCategory: subcategory.subcategory_name,
            category: subcategory.category_name, // Inclure le nom de la catégorie
            total: total,
            enStock: statusCount.enStock,
            attribue: statusCount.attribue,
            enMaintenance: statusCount.enMaintenance,
            retire: statusCount.retire
        };
    });

    // Retourner les statistiques des sous-catégories
    return subCategoryStatusCount;
}

// Appel de la fonction pour tester
getSubCategoryStatusCount().then(statsArray => console.log(statsArray));




async function loadSubCategories() {
    const subcategories = await fetchData('subcategories');
    console.log(subcategories);
    displayTable(subcategories, '', '#subcategoriesTable tbody', ['subcategory_name'], 'subcategories', undefined, undefined, 'true');
}

async function loadSubCategoryStatistics() {
    const subcategories = await getSubCategoryStatusCount(); // Adjust this based on your endpoint
    displayTable(subcategories, '', '#subCategoryTable tbody', [], 'subcategories');
}

loadSubCategories();
loadSubCategoryStatistics();





async function loadItems() {
    const items = await fetchData('items');
    //////console.log("Je suis dans loasItems");
    //////console.log(items);
    
    displayTable(items, '', '#itemsTable tbody', ['description', 'serial_number'], 'items', 'locations', ['location_name'], 'true');
}

async function loadCategoriesForSubCategories() {
    const categories = await fetchData('categories');
    const categorySelect = document.getElementById('category_id');
    categorySelect.innerHTML = '';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.category_id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}
loadCategoriesForSubCategories();


async function loadCategoriesForItems() {
    const categories = await fetchData('categories');
    const categorySelect = document.getElementById('item_category');
    categorySelect.innerHTML = '';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.category_id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}

async function loadLocationsForItems() {
    const categories = await fetchData('locations');
    const categorySelect = document.getElementById('item_location');
    categorySelect.innerHTML = '';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.location_id;
        option.textContent = category.location_name;
        categorySelect.appendChild(option);
    });
}

loadItems();
loadCategoriesForItems();
loadLocationsForItems();


function sortByAttribute(array, key) {
    return array.sort((a, b) => {
        if (a[key] === undefined || a[key] === null) return 1;
        if (b[key] === undefined || b[key] === null) return -1;
        return a[key].toString().localeCompare(b[key].toString(), 'fr', { sensitivity: 'base' });
    });
}


async function loadOptionsPersonne() {
    let items2 = await fetchData('person');
    let items = sortByAttribute(items2, 'name');
    //console.log(items);
    var select = document.getElementById('person');
    ////////////console.log("Je suis la");
    ////////////console.log(items);
    select.innerHTML = '';
    items.forEach(function(item) {
        var option = document.createElement('option');
        option.value = item.person_id;
        option.textContent = item.name + ' - ' + item.email;
        select.appendChild(option);
    });

    displayTable(items, '', '#tableprofil tbody', ['name', 'email'], 'person');
}
loadOptionsPersonne();



async function loadOptionsItemshistory(){
    let items = await fetchData('history');
    //////////console.log(items);
    displayTable(items, '', '#itemHistoryTable tbody', [], 'history');
}
loadOptionsItemshistory();



async function loadCategories() {
    const categories = await fetchData('categories');
    
    displayTable(categories, '', '#categoriesTable tbody', ['name'], 'categories', undefined, undefined, 'true');
}
loadCategories();


async function loadLocations() {
    const locations = await fetchData('locations');
    displayTable(locations, '', '#locationsTable tbody', ['location_name'], 'locations',undefined, undefined, 'true');
}
loadLocations();



async function loadOptions() {
    let items = await fetchData("itemdispo");
    var select = document.getElementById('item');
    select.innerHTML = '';
    items.forEach(function(item) {
        var option = document.createElement('option');
        option.value = item.item_id;
        option.textContent = item.description + ' - ' + item.serial_number;
        select.appendChild(option);
    });
}
loadOptions();


async function loadOptionsItemAtt() {
    let items = await fetchData('itematt');
    ////////////console.log("Dispo");
    ////////////console.log(items);
    var select = document.getElementById('item_attribuer');
    select.innerHTML = '';
    items.forEach(function(item) {
        var option = document.createElement('option');
        option.value = item.item_id;
        option.textContent = item.description + ' - ' + item.serial_number + ' - ' + item.name + ' - ' + item.email;
        select.appendChild(option);
    });
}
loadOptionsItemAtt();


async function filterOptions(inputId, selectId, fetchDataFunction, argg, filterFields) {
    var input = document.getElementById(inputId).value.toLowerCase();
    var select = document.getElementById(selectId);
    let items = await fetchDataFunction(argg);
    
    var filteredItems = items.filter(item => 
        filterFields.some(field => item[field] && item[field].toLowerCase().includes(input))
    );

    select.innerHTML = ''; // Clear existing options
    filteredItems.forEach(function(item) {
        var option = document.createElement('option');
        option.value = item.item_id;
        option.textContent = filterFields.map(field => item[field]).join(' - ');
        select.appendChild(option);
    });
}


async function displayTable(data, filter = '', tableau, editable, type, select, selectlist, ButtonDelete) {
    const tableBody = document.querySelector(tableau);
    let elements;

    if(select != undefined){
        elements = await fetchData(select);
    }

    tableBody.innerHTML = ''; // Clear existing rows
    const filterFields = [];
    for(key in data[1]){
        filterFields.push(key);
    }

   var filteredData = data.filter(item => 
       filterFields.some(field => item[field] && (item[field].toString().toLowerCase().includes(filter)))
    );

    filteredData.forEach(row => {
        const tr = document.createElement('tr');

        for (const key in row) {
            const td = document.createElement('td');
            if(editable.includes(key)){
                td.contentEditable = true;
            }
            if( selectlist != undefined && selectlist.includes(key)) {
                //////console.log('jarrive ici');
                const slct = document.createElement('select');
                elements.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.location_id;
                    option.textContent = category.location_name;
                    if (category.location_name == row[key]) {
                        option.selected = true;
                    }
                    slct.appendChild(option);
                    //////console.log(option);
                });
                
                //////console.log(slct);
                td.appendChild(slct);            
            }
            else{
                td.dataset.column = key;
                td.dataset.id = row.history_id;
                td.textContent = row[key];  
            }
            tr.appendChild(td);
        }

        if(editable.length > 0){
            const saveTd = document.createElement('td');
            saveTd.classList.add('saveTd');
            const saveButton = document.createElement('button');
            saveButton.textContent = 'Save';
            saveButton.onclick = () => { saveRow(type, tr); }
            saveTd.appendChild(saveButton);
            tr.appendChild(saveTd);
        }

        if(ButtonDelete === 'true'){
            const deleteTd = document.createElement('td');
            deleteTd.classList.add('saveTd');
            const saveButton1 = document.createElement('button');
            saveButton1.classList.add('buttondelte');
            //saveButton1.textContent = 'Save';
            saveButton1.onclick = () => { DeleteRow(type, tr); }
            deleteTd.appendChild(saveButton1);
            tr.appendChild(deleteTd);
        }

        // Add a save button
        tableBody.appendChild(tr);
    });
}

async function DeleteRow(type ,ligne){
    ////console.log(type);
    var cellules = ligne.getElementsByTagName('td');
    switch (type) {
        case 'person':
            const formData = {
                person_id: cellules[0].textContent   
            };
            sendtoS('deleteprofil', formData);
            break;
        case 'locations':
            const formData1 = {
                location_id: cellules[0].textContent
            };
            sendtoS('deletelocation', formData1);
            break;
        case 'categories':
            const formData2 = {
                category_id: cellules[0].textContent
            };
            sendtoS('deletecategorie', formData2);
            break;
        case 'items':
            //console.log("Je suis arrivé ici");
            const fromData3 = {
                item_id: cellules[0].textContent
            };
            sendtoS('deleteItem', fromData3);
            break;
        case 'subcategories':
            const fromData4 = {
                subcategory_id: cellules[0].textContent,
            }
            console.log(fromData4);
            sendtoS('deleteSubCategory', fromData4);
            break;

        default:
            break;
    }
    // Récupérez toutes les cellules (td) de cette ligne
    var cellules = ligne.getElementsByTagName('td');
    //////////console.log(cellules);
    // Parcourez les cellules pour extraire et afficher leur contenu
    for (var i = 0; i < cellules.length; i++) {
    //////////console.log(cellules[i].textContent);  // Affiche le contenu de chaque cellule
    }
}




async function saveRow(type ,ligne){
    console.log(type);
    var cellules = ligne.getElementsByTagName('td');
    switch (type) {
        case 'person':
            const formData = {
                person_id: cellules[0].textContent,     
                name: cellules[1].textContent,
                email: cellules[2].textContent
            };
            sendtoS('updateprofil', formData);
            break;
        case 'locations':
            const formData1 = {
                location_id: cellules[0].textContent,     
                name: cellules[1].textContent
            };
            sendtoS('updatelocation', formData1);
            break;
        case 'categories':
            const formData2 = {
                category_id: cellules[0].textContent,     
                name: cellules[1].textContent
            };
            sendtoS('updatecategorie', formData2);
            break;
        case 'items':
            ////console.log(cellules[4].getElementsByTagName('select')[0].value);
            const fromData3 = {
                location_id: cellules[4].getElementsByTagName('select')[0].value,
                numero_de_serie: cellules[2].textContent,
                description: cellules[3].textContent,
                item_id: cellules[0].textContent
            };
            sendtoS('updateitem', fromData3);
            break;
        case 'subcategories':
            const fromData4 = {
                subcategory_id: cellules[0].textContent,
                subcategory_name: cellules[1].textContent
            }
            console.log(fromData4);
            sendtoS('editSubCategory', fromData4);
            break;
        default:
            break;
    }
    // Récupérez toutes les cellules (td) de cette ligne
    var cellules = ligne.getElementsByTagName('td');
    //////////console.log(cellules);
    // Parcourez les cellules pour extraire et afficher leur contenu
    for (var i = 0; i < cellules.length; i++) {
    //////////console.log(cellules[i].textContent);  // Affiche le contenu de chaque cellule
    }
}
async function filterTable(data, inputId, tableau, editable, select, selectlist, buttonDelete) {
    //////console.log("Je modifie");
    const input = document.getElementById(inputId).value.toLowerCase();
    //////console.log('Input = ' + input);
    let data2 = await fetchData(data);
    displayTable(data2, input, tableau, editable, data, select, selectlist, buttonDelete);
}

async function getCategoryStatusCount() {
    ////console.log('Je suis la');
    const categories = await fetchData('categories');
    const items = await fetchData('items2');
    const itemTracking = await fetchData('itemtracking');
    const locations = await fetchData('locations');
    ////console.log(items);
    const categoryStatusCount = categories.map(category => {
        
        const itemsInCategory = items.filter(item => item.category_id === category.category_id);
        const total = itemsInCategory.length;
        const statusCount = { enStock: 0, attribue: 0, enMaintenance: 0, retire: 0 };
        ////console.log(itemsInCategory);
        itemsInCategory.forEach(item => {
            const tracking = itemTracking.find(track => track.item_id === item.item_id);
            
            if (tracking) {
                
                if (tracking.status_id === 1) statusCount.enStock++;
                if (tracking.status_id === 2) statusCount.attribue++;
                if (tracking.status_id === 3) statusCount.enMaintenance++;
                if (tracking.status_id === 4) statusCount.retire++;
            }
        });

        return {
            category: category.name,
            total: total,
            enStock: statusCount.enStock,
            attribue: statusCount.attribue,
            enMaintenance: statusCount.enMaintenance,
            retire: statusCount.retire
        };
    });

    return { categoryStatusCount, locations, items, itemTracking, categories };
}

async function renderTable(tableId, data) {
    const tableBody = document.getElementById(tableId).querySelector('tbody');
    tableBody.innerHTML = '';
    data.forEach(row => {
        const tr = document.createElement('tr');
        Object.values(row).forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}

async function renderLocationTables() {
    const { categoryStatusCount, locations, items, itemTracking, categories } = await getCategoryStatusCount();
    //////console.log(locations); 
    //////console.log(categories);
    ////console.log(await getCategoryStatusCount());
    ////console.log(categoryStatusCount);

    // Render the main inventory table
    renderTable('inventoryTable', categoryStatusCount);

    // Render tables for each location
    const locationsContainer = document.getElementById('locationsTables');
    locationsContainer.innerHTML = '';  // Clear existing tables if any

    locations.forEach(location => {
        // Calculate status counts for each category in the current location
        const locationStatusCount = categories.map(category => {
            const itemsInCategory = items.filter(item => item.category_id === category.category_id && item.location_id === location.location_id);
            const total = itemsInCategory.length;
            const statusCount = { enStock: 0, attribue: 0, enMaintenance: 0, retire: 0 };

            itemsInCategory.forEach(item => {
                const tracking = itemTracking.find(track => track.item_id === item.item_id);
                if (tracking) {
                    if (tracking.status_id === 1) statusCount.enStock++;
                    if (tracking.status_id === 2) statusCount.attribue++;
                    if (tracking.status_id === 3) statusCount.enMaintenance++;
                    if (tracking.status_id === 4) statusCount.retire++;
                }
            });

            return {
                category: category.name,
                total: total,
                enStock: statusCount.enStock,
                attribue: statusCount.attribue,
                enMaintenance: statusCount.enMaintenance,
                retire: statusCount.retire
            };
        });

        // Create table for current location
        const tableId = `locationTable_${location.location_id}`;
        const tableHTML = `
            <h3>${location.location_name}</h3>
            <div class="table-responsive">
                <table id="${tableId}">
                    <thead>
                        <tr>
                            <th>Catégorie</th>
                            <th>Total</th>
                            <th>En Stock</th>
                            <th>Attribué</th>
                            <th>En Maintenance</th>
                            <th>Retiré</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Les données seront insérées ici par JavaScript -->
                    </tbody>
                </table>
            </div>
        `;
        locationsContainer.insertAdjacentHTML('beforeend', tableHTML);

        // Render the location table
        renderTable(tableId, locationStatusCount);
    });
}

renderLocationTables();

async function Actualiser() {
    renderLocationTables();
    loadOptionsItemAtt();
    loadOptions();
    loadLocations();
    loadCategories();
    loadOptionsItemshistory();
    loadOptionsPersonne();
    loadItems();
    loadCategoriesForItems();
    loadLocationsForItems();
    loadCategoriesForSubCategories();
    loadSubCategories();
    loadSubCategoryStatistics();
}

