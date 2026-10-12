// Schoolsync - Department management

//Storage 
const departmentStorageKey = "schoolSyncDepartments";

// Demo Departments 
const defaultDepartments = [
    {
        id: 1,
        code: "SWE",
        name: "Software Engineering",
        faculty: "Computing and Applied Science",
        hod: "Dr. Olabode Omoshola",
        students: 156,
        status: "Active"
    },
    {
        id: 2,
        code: "CSC",
        name: "Computer Science",
        faculty: "Computing and Applied Science",
        hod: "Dr. Folaranmi Ibrahim",
        students: 184,
        status: "Active"
    },
    {
        id: 3,
        code: "NSC",
        name: "Nursing Science",
        faculty: "Nursing Science",
        hod: "Prof. Ajibola Olalakan",
        students: 132,
        status: "Active"
    },
    {
        id: 4,
        code: "ACC",
        name: "Accounting",
        faculty: "Management Sciences",
        hod: "Dr. Samuel Yusuf",
        students: 210,
        status: "Active"
    },
    {
        id: 5,
        code: "BUS",
        name: "Business Administration",
        faculty: "Management Sciences",
        hod: "Mrs. Grace Williams",
        students: 195,
        status: "Inactive"
    }
];


// GET Saved Departments
let departments = JSON.parse(
    localStorage.getItem(departmentStorageKey)
) || defaultDepartments;


// HTML Elements 
const departmentTableBody =
    document.getElementById("departmentTableBody");

const searchDepartment =
    document.getElementById("searchDepartment");

const facultyFilter =
    document.getElementById("facultyFilter");

const departmentModal =
    document.getElementById("departmentModal");

const departmentForm =
    document.getElementById("departmentForm");

const modalTitle =
    document.getElementById("modalTitle");

const closeModal =
    document.getElementById("closeModal");

const cancelBtn =
    document.getElementById("cancelBtn");

const addDepartmentBtn =
    document.getElementById("addDepartmentBtn");

const emptyAddBtn =
    document.getElementById("emptyAddBtn");

const emptyState =
    document.getElementById("emptyState");


// Statistics 
const totalDepartments =
    document.getElementById("totalDepartments");

const activeDepartments =
    document.getElementById("activeDepartments");

const facultyCount =
    document.getElementById("facultyCount");

const hodCount =
    document.getElementById("hodCount");


// Form fields 
const departmentCodeInput =
    document.getElementById("departmentCode");

const departmentNameInput =
    document.getElementById("departmentName");

const departmentFacultyInput =
    document.getElementById("departmentFaculty");

const departmentHodInput =
    document.getElementById("departmentHod");

const departmentStudentsInput =
    document.getElementById("departmentStudents");

const departmentStatusInput =
    document.getElementById("departmentStatus");


// Editing state
let editingDepartmentId = null;


// Save Department

function saveDepartments() {

    localStorage.setItem(
        departmentStorageKey,
        JSON.stringify(departments)
    );

}


// Display Departments

function renderDepartments() {

    const searchValue =
        searchDepartment.value
            .toLowerCase()
            .trim();

    const selectedFaculty =
        facultyFilter.value;


    const filteredDepartments =
        departments.filter(function (department) {

            const matchesSearch =
                department.name
                    .toLowerCase()
                    .includes(searchValue) ||

                department.code
                    .toLowerCase()
                    .includes(searchValue) ||

                department.faculty
                    .toLowerCase()
                    .includes(searchValue) ||

                department.hod
                    .toLowerCase()
                    .includes(searchValue);


            const matchesFaculty =
                selectedFaculty === "all" ||
                department.faculty === selectedFaculty;


            return matchesSearch && matchesFaculty;

        });


    departmentTableBody.innerHTML = "";


    // No results
    if (filteredDepartments.length === 0) {

        departmentTableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    <div class="no-results">
                    No departments match your search.
                    </div>
                </td>
            </tr>
        `;

        emptyState.style.display = "none";

        return;
    }


    emptyState.style.display = "none";


    filteredDepartments.forEach(function (department) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <div class="department-info">

                    <div class="department-icon">
                        ${department.code.substring(0, 2)}
                    </div>

                    <div>

                        <div class="department-name">
                            ${department.name}
                        </div>

                        <div class="department-label">
                            Academic Department
                        </div>

                    </div>

                </div>

            </td>


            <td>

                <span class="department-code">
                    ${department.code}
                </span>

            </td>


            <td>
                ${department.faculty}
            </td>


            <td>

                <div class="hod-info">

                    <span class="hod-avatar">
                        ${getInitials(department.hod)}
                    </span>

                    <span>
                        ${department.hod}
                    </span>

                </div>

            </td>


            <td>

                <strong class="student-count">
                    ${department.students}
                </strong>

            </td>


            <td>

                <span class="status-badge ${
                    department.status === "Active"
                        ? "status-active"
                        : "status-inactive"
                }">

                    ${department.status}

                </span>

            </td>


            <td>

                <div class="action-buttons">

                    <button
                        class="action-btn edit-btn"
                        data-id="${department.id}"
                        title="Edit department"
                    >
                        ✎
                    </button>


                    <button
                        class="action-btn delete delete-btn"
                        data-id="${department.id}"
                        title="Delete department"
                    >
                    ×
                    </button>

                </div>

            </td>

        `;


        departmentTableBody.appendChild(row);

    });

}


// GET Iniatials

function getInitials(name) {

    const parts =
        name.trim().split(" ");


    if (parts.length === 1) {

        return parts[0]
            .substring(0, 2)
            .toUpperCase();

    }


    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();

}


// Update Statistics

function updateStatistics() {

    totalDepartments.textContent =
        departments.length;


    const activeCount =
        departments.filter(function (department) {

            return department.status === "Active";

        }).length;


    activeDepartments.textContent =
        activeCount;


    const faculties =
        new Set(
            departments.map(function (department) {

                return department.faculty;

            })
        );


    facultyCount.textContent =
        faculties.size;


    const hods =
        departments.filter(function (department) {

            return department.hod.trim() !== "";

        }).length;


    hodCount.textContent =
        hods;

}


// POPULATE FACULTY FILTER


function populateFacultyFilter() {

    const faculties =
        [
            ...new Set(
                departments.map(function (department) {
                    return department.faculty;
                })
            )
        ];


    facultyFilter.innerHTML = `
        <option value="all">
            All Faculties
        </option>
    `;


    faculties.sort().forEach(function (faculty) {

        const option =
            document.createElement("option");


        option.value = faculty;
        option.textContent = faculty;


        facultyFilter.appendChild(option);

    });

}


// Open Modal

function openModal() {

    departmentModal.classList.remove("hidden");

    document.body.style.overflow = "hidden";

}

// Close Modal


function closeDepartmentModal() {

    departmentModal.classList.add("hidden");

    document.body.style.overflow = "";

    departmentForm.reset();

    editingDepartmentId = null;

    modalTitle.textContent =
        "Add New Department";

}


// Prepare Add Departments

function prepareAddDepartment() {

    editingDepartmentId = null;

    departmentForm.reset();

    modalTitle.textContent =
        "Add New Department";

    openModal();

}


// Add Department

addDepartmentBtn.addEventListener(
    "click",
    prepareAddDepartment
);


if (emptyAddBtn) {

    emptyAddBtn.addEventListener(
        "click",
        prepareAddDepartment
    );

}


// Close Modal

closeModal.addEventListener(
    "click",
    closeDepartmentModal
);


cancelBtn.addEventListener(
    "click",
    closeDepartmentModal
);

// Click Outside Modal

departmentModal.addEventListener(
    "click",
    function (event) {

        if (event.target === departmentModal) {

            closeDepartmentModal();

        }

    }
);


// Save Department

departmentForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const departmentData = {

            code:
                departmentCodeInput.value
                    .trim()
                    .toUpperCase(),

            name:
                departmentNameInput.value
                    .trim(),

            faculty:
                departmentFacultyInput.value
                    .trim(),

            hod:
                departmentHodInput.value
                    .trim(),

            students:
                Number(
                    departmentStudentsInput.value
                ),

            status:
                departmentStatusInput.value

        };


        // EDIT
        if (editingDepartmentId !== null) {

            const departmentIndex =
                departments.findIndex(
                    function (department) {

                        return department.id ===
                            editingDepartmentId;

                    }
                );


            if (departmentIndex !== -1) {

                departments[departmentIndex] = {

                    ...departments[departmentIndex],

                    ...departmentData

                };

            }

        }


        // ADD
        else {

            const newDepartment = {

                id: Date.now(),

                ...departmentData

            };


            departments.push(newDepartment);

        }


        saveDepartments();

        populateFacultyFilter();

        renderDepartments();

        updateStatistics();

        closeDepartmentModal();

    }
);


// Search

searchDepartment.addEventListener(
    "input",
    function () {

        renderDepartments();

    }
);

// Faculty Filter

facultyFilter.addEventListener(
    "change",
    function () {

        renderDepartments();

    }
);


// Edit And Delete

departmentTableBody.addEventListener(
    "click",
    function (event) {

        const editButton =
            event.target.closest(".edit-btn");


        const deleteButton =
            event.target.closest(".delete-btn");


        if (editButton) {

            const id =
                Number(editButton.dataset.id);

            editDepartment(id);

        }


        if (deleteButton) {

            const id =
                Number(deleteButton.dataset.id);

            deleteDepartment(id);

        }

    }
);


//  Edit And Department

function editDepartment(id) {

    const department =
        departments.find(function (department) {

            return department.id === id;

        });


    if (!department) {
        return;
    }


    editingDepartmentId = id;


    departmentCodeInput.value =
        department.code;

    departmentNameInput.value =
        department.name;

    departmentFacultyInput.value =
        department.faculty;

    departmentHodInput.value =
        department.hod;

    departmentStudentsInput.value =
        department.students;

    departmentStatusInput.value =
        department.status;


    modalTitle.textContent =
        "Edit Department";


    openModal();

}


// Delete Department

function deleteDepartment(id) {

    const department =
        departments.find(function (department) {

            return department.id === id;

        });


    if (!department) {
        return;
    }


    const confirmed =
        confirm(
            `Are you sure you want to delete ${department.name}?`
        );


    if (!confirmed) {
        return;
    }


    departments =
        departments.filter(function (department) {

            return department.id !== id;

        });


    saveDepartments();

    populateFacultyFilter();

    renderDepartments();

    updateStatistics();

}


// Iniatial Page Load

saveDepartments();

populateFacultyFilter();

renderDepartments();

updateStatistics();