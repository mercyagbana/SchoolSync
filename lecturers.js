// SCHOOLSYNC - LECTURER MANAGEMENT


// Storage

const lecturerStorageKey = "schoolSyncLecturers";


// DEMO LECTURERS

const defaultLecturers = [
    {
        id: 1,
        lecturerId: "TAU/SE/001",
        name: "Dr. Daniel Adeyemi",
        gender: "Male",
        rank: "Senior Lecturer",
        faculty: "Computing and Technology",
        department: "Software Engineering",
        email: "daniel.adeyemi@university.edu",
        phone: "08031234567",
        status: "Active"
    },

    {
        id: 2,
        lecturerId: "TAU/CS/002",
        name: "Dr. Sarah Ibrahim",
        gender: "Female",
        rank: "Lecturer I",
        faculty: "Computing and Technology",
        department: "Computer Science",
        email: "sarah.ibrahim@university.edu",
        phone: "08042345678",
        status: "Active"
    },

    {
        id: 3,
        lecturerId: "TAU/IT/003",
        name: "Prof. Michael Okafor",
        gender: "Male",
        rank: "Professor",
        faculty: "Computing and Technology",
        department: "Information Technology",
        email: "michael.okafor@university.edu",
        phone: "08053456789",
        status: "Active"
    },

    {
        id: 4,
        lecturerId: "TAU/SE/004",
        name: "Mrs. Grace Williams",
        gender: "Female",
        rank: "Lecturer II",
        faculty: "Computing and Technology",
        department: "Software Engineering",
        email: "grace.williams@university.edu",
        phone: "08064567890",
        status: "Inactive"
    },

    {
        id: 5,
        lecturerId: "TAU/ACC/005",
        name: "Dr. Samuel Yusuf",
        gender: "Male",
        rank: "Associate Professor",
        faculty: "Management Sciences",
        department: "Accounting",
        email: "samuel.yusuf@university.edu",
        phone: "08075678901",
        status: "Active"
    }
];


// GET SAVED LECTURERS

let lecturers = JSON.parse(
    localStorage.getItem(lecturerStorageKey)
) || defaultLecturers;


// HTML ELEMENTS

const lecturerTableBody = document.getElementById("lecturerTableBody");

const searchLecturer = document.getElementById("searchLecturer");

const departmentFilter = document.getElementById("departmentFilter");

const lecturerModal = document.getElementById("lecturerModal");

const lecturerForm = document.getElementById("lecturerForm");

const modalTitle = document.getElementById("modalTitle");

const closeModal = document.getElementById("closeModal");

const cancelBtn = document.getElementById("cancelBtn");

const emptyState = document.getElementById("emptyState");

const emptyAddBtn = document.getElementById("emptyAddBtn");


// STATISTICS 

const totalLecturers = document.getElementById("totalLecturers");

const activeLecturers = document.getElementById("activeLecturers");

const professorCount = document.getElementById("professorCount");

const departmentCount = document.getElementById("departmentCount");


// FORM FIELDS 

const lecturerIdInput = document.getElementById("lecturerId");

const lecturerNameInput = document.getElementById("lecturerName");

const lecturerGenderInput = document.getElementById("lecturerGender");

const lecturerRankInput = document.getElementById("lecturerRank");

const lecturerFacultyInput = document.getElementById("lecturerFaculty");

const lecturerDepartmentInput = document.getElementById("lecturerDepartment");

const lecturerEmailInput = document.getElementById("lecturerEmail");

const lecturerPhoneInput = document.getElementById("lecturerPhone");

const lecturerStatusInput = document.getElementById("lecturerStatus");


// EDITING STATE

let editingLecturerId = null;


// SAVE TO LOCAL STORAGE


function saveLecturers() {

    localStorage.setItem(
        lecturerStorageKey,
        JSON.stringify(lecturers)
    );

}


// DISPLAY LECTURERS


function renderLecturers() {

    const searchValue = searchLecturer.value
        .toLowerCase()
        .trim();

    const selectedDepartment = departmentFilter.value;


    const filteredLecturers = lecturers.filter(function (lecturer) {

        const matchesSearch =
            lecturer.name.toLowerCase().includes(searchValue) ||
            lecturer.lecturerId.toLowerCase().includes(searchValue) ||
            lecturer.email.toLowerCase().includes(searchValue);


        const matchesDepartment =
            selectedDepartment === "all" ||
            lecturer.department === selectedDepartment;


        return matchesSearch && matchesDepartment;

    });


    lecturerTableBody.innerHTML = "";


    if (filteredLecturers.length === 0) {

        emptyState.style.display = "block";

        document.querySelector(".table-container").style.display = "none";

        return;
    }


    emptyState.style.display = "none";

    document.querySelector(".table-container").style.display = "block";


    filteredLecturers.forEach(function (lecturer) {

        const row = document.createElement("tr");


        const initials = getInitials(lecturer.name);


        row.innerHTML = `
            <td>
                <div class="lecturer-info">

                    <div class="lecturer-avatar">
                        ${initials}
                    </div>

                    <div>
                        <div class="lecturer-name">
                            ${lecturer.name}
                        </div>

                        <div class="lecturer-email">
                            ${lecturer.email}
                        </div>
                    </div>

                </div>
            </td>


            <td>
                <span class="staff-id">
                    ${lecturer.lecturerId}
                </span>
            </td>


            <td>
                <span class="rank-badge">
                    ${lecturer.rank}
                </span>
            </td>


            <td>
                ${lecturer.department}
            </td>


            <td>
                ${lecturer.email}
            </td>


            <td>
                <span class="status-badge ${
                    lecturer.status === "Active"
                        ? "status-active"
                        : "status-inactive"
                }">
                    ${lecturer.status}
                </span>
            </td>


            <td>

                <div class="action-buttons">

                    <button
                        class="action-btn edit-btn"
                        data-id="${lecturer.id}"
                        title="Edit lecturer">
                        ✎
                    </button>


                    <button
                        class="action-btn delete delete-btn"
                        data-id="${lecturer.id}"
                        title="Delete lecturer">
                        ×
                    </button>

                </div>

            </td>
        `;


        lecturerTableBody.appendChild(row);

    });

}


// GET INITIALS


function getInitials(name) {

    const nameParts = name.trim().split(" ");


    if (nameParts.length === 1) {
        return nameParts[0].substring(0, 2).toUpperCase();
    }


    return (
        nameParts[0][0] +
        nameParts[nameParts.length - 1][0]
    ).toUpperCase();

}


// UPDATE STATISTICS


function updateStatistics() {

    totalLecturers.textContent = lecturers.length;


    const activeCount = lecturers.filter(function (lecturer) {

        return lecturer.status === "Active";

    }).length;


    activeLecturers.textContent = activeCount;


    const professorTotal = lecturers.filter(function (lecturer) {

        return lecturer.rank === "Professor";

    }).length;


    professorCount.textContent = professorTotal;


    const departments = new Set(

        lecturers.map(function (lecturer) {

            return lecturer.department;

        })

    );


    departmentCount.textContent = departments.size;

}


// POPULATE DEPARTMENT FILTER


function populateDepartmentFilter() {

    const departments = [...new Set(

        lecturers.map(function (lecturer) {

            return lecturer.department;

        })

    )];


    departmentFilter.innerHTML = `
        <option value="all">All Departments</option>
    `;


    departments.sort().forEach(function (department) {

        const option = document.createElement("option");

        option.value = department;

        option.textContent = department;

        departmentFilter.appendChild(option);

    });

}


// OPEN MODAL

function openModal() {

    lecturerModal.classList.remove("hidden");

    document.body.style.overflow = "hidden";

}


// Close modal

function closeLecturerModal() {

    lecturerModal.classList.add("hidden");

    document.body.style.overflow = "";

    lecturerForm.reset();

    editingLecturerId = null;

    modalTitle.textContent = "Add Lecturer";

}


// ADD LECTURER BUTTONS


document.querySelectorAll(".open-add-modal").forEach(function (button) {

    button.addEventListener("click", function () {

        editingLecturerId = null;

        lecturerForm.reset();

        modalTitle.textContent = "Add Lecturer";

        openModal();

    });

});


if (emptyAddBtn) {

    emptyAddBtn.addEventListener("click", function () {

        editingLecturerId = null;

        lecturerForm.reset();

        modalTitle.textContent = "Add Lecturer";

        openModal();

    });

}


// CLOSE MODAL BUTTONS



closeModal.addEventListener("click", closeLecturerModal);

cancelBtn.addEventListener("click", closeLecturerModal);


// CLICK OUTSIDE MODAL


lecturerModal.addEventListener("click", function (event) {

    if (event.target === lecturerModal) {

        closeLecturerModal();

    }

});


// SAVE LECTURER


lecturerForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const lecturerData = {

        lecturerId: lecturerIdInput.value.trim(),

        name: lecturerNameInput.value.trim(),

        gender: lecturerGenderInput.value,

        rank: lecturerRankInput.value,

        faculty: lecturerFacultyInput.value.trim(),

        department: lecturerDepartmentInput.value.trim(),

        email: lecturerEmailInput.value.trim(),

        phone: lecturerPhoneInput.value.trim(),

        status: lecturerStatusInput.value

    };


    // EDIT

    if (editingLecturerId !== null) {

        const lecturerIndex = lecturers.findIndex(function (lecturer) {

            return lecturer.id === editingLecturerId;

        });


        if (lecturerIndex !== -1) {

            lecturers[lecturerIndex] = {

                ...lecturers[lecturerIndex],

                ...lecturerData

            };

        }

    }


    // ADD 

    else {

        const newLecturer = {

            id: Date.now(),

            ...lecturerData

        };


        lecturers.push(newLecturer);

    }


    saveLecturers();

    populateDepartmentFilter();

    renderLecturers();

    updateStatistics();

    closeLecturerModal();

});


// search

searchLecturer.addEventListener("input", function () {

    renderLecturers();

});


// DEPARTMENT FILTER


departmentFilter.addEventListener("change", function () {

    renderLecturers();

});


// EDIT & DELETE BUTTONS


lecturerTableBody.addEventListener("click", function (event) {

    const editButton = event.target.closest(".edit-btn");

    const deleteButton = event.target.closest(".delete-btn");


    // EDIT

    if (editButton) {

        const lecturerId = Number(editButton.dataset.id);

        editLecturer(lecturerId);

    }


    // DELETE

    if (deleteButton) {

        const lecturerId = Number(deleteButton.dataset.id);

        deleteLecturer(lecturerId);

    }

});


// EDIT LECTURER


function editLecturer(id) {

    const lecturer = lecturers.find(function (lecturer) {

        return lecturer.id === id;

    });


    if (!lecturer) {
        return;
    }


    editingLecturerId = id;


    lecturerIdInput.value = lecturer.lecturerId;

    lecturerNameInput.value = lecturer.name;

    lecturerGenderInput.value = lecturer.gender;

    lecturerRankInput.value = lecturer.rank;

    lecturerFacultyInput.value = lecturer.faculty;

    lecturerDepartmentInput.value = lecturer.department;

    lecturerEmailInput.value = lecturer.email;

    lecturerPhoneInput.value = lecturer.phone;

    lecturerStatusInput.value = lecturer.status;


    modalTitle.textContent = "Edit Lecturer";


    openModal();

}


// DELETE LECTURER


function deleteLecturer(id) {

    const lecturer = lecturers.find(function (lecturer) {

        return lecturer.id === id;

    });


    if (!lecturer) {
        return;
    }


    const confirmed = confirm(
        `Are you sure you want to delete ${lecturer.name}?`
    );


    if (!confirmed) {
        return;
    }


    lecturers = lecturers.filter(function (lecturer) {

        return lecturer.id !== id;

    });


    saveLecturers();

    populateDepartmentFilter();

    renderLecturers();

    updateStatistics();

}


// INITIAL PAGE LOAD


saveLecturers();

populateDepartmentFilter();

renderLecturers();

updateStatistics();