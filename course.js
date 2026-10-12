// SCHOOLSYNC - COURSE MANAGEMENT


// Storage keys
const courseStorageKey = "schoolSyncCourses";
const departmentStorageKey = "schoolSyncDepartments";

// Default Courses


const defaultCourses = [
    {
        id: 1,
        code: "SEN 301",
        title: "Software Engineering Principles",
        department: "Software Engineering",
        faculty: "Computing and Applied Science",
        units: 3,
        level: "300",
        semester: "First Semester",
        type: "Core",
        status: "Active"
    },
    {
        id: 2,
        code: "SEN 332",
        title: "Introduction To C##",
        department: "Software Engineering",
        faculty: "Computing and Applied Science",
        units: 3,
        level: "300",
        semester: "First Semester",
        type: "Core",
        status: "Active"
    },
    {
        id: 3,
        code: "SEN 305",
        title: "Introduction To Web Technology",
        department: "Software Engineering",
        faculty: "Computing and Technology",
        units: 2,
        level: "300",
        semester: "Second Semester",
        type: "Core",
        status: "Active"
    },
    {
        id: 4,
        code: "CSC 301",
        title: "Data Structures and Algorithms",
        department: "Computer Science",
        faculty: "Computing and Applied Science",
        units: 2,
        level: "300",
        semester: "First Semester",
        type: "Core",
        status: "Active"
    },
    {
        id: 5,
        code: "CSC 305",
        title: "Artificial Intelligence",
        department: "Computer Science",
        faculty: "Computing and Applied Science",
        units: 3,
        level: "300",
        semester: "Second Semester",
        type: "Core",
        status: "Active"
    },
    {
        id: 6,
        code: "IFT 303",
        title: "Database Management Systems",
        department: "Computer Science",
        department: "Software Engineering",
        faculty: "Computing and Applied Science",
        units: 3,
        level: "300",
        semester: "First Semester",
        type: "Core",
        status: "Active"
    },
    {
        id: 7,
        code: "ACC 301",
        title: "Financial Accounting",
        department: "Accounting",
        faculty: "Management Sciences",
        units: 3,
        level: "300",
        semester: "First Semester",
        type: "Core",
        status: "Active"
    },
    {
        id: 8,
        code: "BUS 305",
        title: "Entrepreneurship Development",
        department: "Business Administration",
        faculty: "Management Sciences",
        units: 2,
        level: "300",
        semester: "Second Semester",
        type: "Elective",
        status: "Active"
    },

     {
        id: 9,
        code: "MTH 301",
        title: "Introduction To Elementary Mathematics",
        department: "Software Engineering",
        faculty: "Computing and Applied Science",
        units: 2,
        level: "300",
        semester: "First Semester",
        type: "Core",
        status: "Active"
    },

     {
        id: 10,
        code: "GST 301",
        title: "Philosophy , Logic and Human Existence",
        department: "Software Engineering",
        faculty: "Computing and Applied Science",
        units: 2,
        level: "300",
        semester: "First Semester",
        type: "Core",
        status: "Active"
    },
];


// Load Course

let courses = JSON.parse(
    localStorage.getItem(courseStorageKey)
) || defaultCourses;


// GET HTML Elements

const courseTableBody = document.getElementById("courseTableBody");

const totalCourses = document.getElementById("totalCourses");
const coreCourses = document.getElementById("coreCourses");
const electiveCourses = document.getElementById("electiveCourses");
const courseDepartmentCount = document.getElementById("courseDepartmentCount");

const searchCourse = document.getElementById("searchCourse");
const courseDepartmentFilter = document.getElementById("courseDepartmentFilter");
const courseLevelFilter = document.getElementById("courseLevelFilter");

const addCourseBtn = document.getElementById("addCourseBtn");
const emptyAddBtn = document.getElementById("emptyAddBtn");

const courseModal = document.getElementById("courseModal");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");

const courseForm = document.getElementById("courseForm");

const courseCode = document.getElementById("courseCode");
const courseTitle = document.getElementById("courseTitle");
const courseDepartment = document.getElementById("courseDepartment");
const courseFaculty = document.getElementById("courseFaculty");
const courseUnits = document.getElementById("courseUnits");
const courseLevel = document.getElementById("courseLevel");
const courseSemester = document.getElementById("courseSemester");
const courseType = document.getElementById("courseType");
const courseStatus = document.getElementById("courseStatus");


// EDITING STATE


let editingCourseId = null;


// SAVE COURSES

function saveCourses() {
    localStorage.setItem(
        courseStorageKey,
        JSON.stringify(courses)
    );
}


// GET INITIALS


function getCourseInitials(title) {
    const words = title.split(" ");

    if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase();
    }

    return (
        words[0].charAt(0) +
        words[1].charAt(0)
    ).toUpperCase();
}


// RENDER COURSES


function renderCourses() {

    const searchValue = searchCourse.value.toLowerCase().trim();
    const departmentValue = courseDepartmentFilter.value;
    const levelValue = courseLevelFilter.value;

    const filteredCourses = courses.filter(function(course) {

        const matchesSearch =
            course.code.toLowerCase().includes(searchValue) ||
            course.title.toLowerCase().includes(searchValue);

        const matchesDepartment =
            departmentValue === "all" ||
            course.department === departmentValue;

        const matchesLevel =
            levelValue === "all" ||
            course.level === levelValue;

        return (
            matchesSearch &&
            matchesDepartment &&
            matchesLevel
        );
    });


    courseTableBody.innerHTML = "";


    if (filteredCourses.length === 0) {

        courseTableBody.innerHTML = `
            <tr>
                <td colspan="9">
                    <div class="no-results">
                        No courses found.
                    </div>
                </td>
            </tr>
        `;

        return;
    }


    filteredCourses.forEach(function(course) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <div class="course-info">
                    <div class="course-icon">
                        ${getCourseInitials(course.title)}
                    </div>

                    <div class="course-name">
                        <strong>${course.title}</strong>
                        <span>${course.semester}</span>
                    </div>
                </div>
            </td>

            <td>
                <span class="course-code">
                    ${course.code}
                </span>
            </td>

            <td>
                <span class="course-department">
                    ${course.department}
                </span>
            </td>

            <td>
                <span class="course-faculty">
                    ${course.faculty}
                </span>
            </td>

            <td>
                <span class="units-badge">
                    ${course.units}
                </span>
            </td>

            <td>
                ${course.level} Level
            </td>

            <td>
                <span class="course-badge ${
                    course.type === "Core"
                        ? "badge-core"
                        : "badge-elective"
                }">
                    ${course.type}
                </span>
            </td>

            <td>
                <span class="course-badge ${
                    course.status === "Active"
                        ? "badge-active"
                        : "badge-inactive"
                }">
                    ${course.status}
                </span>
            </td>

            <td>
                <div class="action-buttons">

                    <button
                        class="action-btn edit"
                        onclick="editCourse(${course.id})"
                        title="Edit Course"
                    >
                        ✏️
                    </button>

                    <button
                        class="action-btn delete"
                        onclick="deleteCourse(${course.id})"
                        title="Delete Course"
                    >
                        🗑️
                    </button>

                </div>
            </td>
        `;

        courseTableBody.appendChild(row);
    });
}


//  UPDATE STATISTICS


function updateStatistics() {

    const coreCount = courses.filter(function(course) {
        return course.type === "Core";
    }).length;

    const electiveCount = courses.filter(function(course) {
        return course.type === "Elective";
    }).length;

    const departments = new Set(
        courses.map(function(course) {
            return course.department;
        })
    );


    totalCourses.textContent = courses.length;

    coreCourses.textContent = coreCount;

    electiveCourses.textContent = electiveCount;

    courseDepartmentCount.textContent = departments.size;
}


//  LOAD DEPARTMENTS


function loadDepartments() {

    const departments = JSON.parse(
        localStorage.getItem(departmentStorageKey)
    ) || [];


    courseDepartment.innerHTML = `
        <option value="">Select Department</option>
    `;


    courseDepartmentFilter.innerHTML = `
        <option value="all">All Departments</option>
    `;


    departments.forEach(function(department) {

        const option = document.createElement("option");

        option.value = department.name;

        option.textContent =
            `${department.code} - ${department.name}`;

        courseDepartment.appendChild(option);


        const filterOption = document.createElement("option");

        filterOption.value = department.name;

        filterOption.textContent = department.name;

        courseDepartmentFilter.appendChild(filterOption);
    });
}


// OPEN ADD COURSE MODAL


function openAddCourseModal() {

    editingCourseId = null;

    courseForm.reset();

    document.querySelector("#courseModal h2").textContent =
        "Add New Course";

    courseModal.classList.remove("hidden");
}


// CLOSE MODAL

function closeCourseModal() {

    courseModal.classList.add("hidden");

    editingCourseId = null;

    courseForm.reset();
}


// EDIT COURSE


function editCourse(id) {

    const course = courses.find(function(course) {
        return course.id === id;
    });


    if (!course) {
        return;
    }


    editingCourseId = id;


    courseCode.value = course.code;
    courseTitle.value = course.title;
    courseDepartment.value = course.department;
    courseFaculty.value = course.faculty;
    courseUnits.value = course.units;
    courseLevel.value = course.level;
    courseSemester.value = course.semester;
    courseType.value = course.type;
    courseStatus.value = course.status;


    document.querySelector("#courseModal h2").textContent =
        "Edit Course";
        
    courseModal.classList.remove("hidden");
}


// DELETE COURSE


function deleteCourse(id) {

    const course = courses.find(function(course) {
        return course.id === id;
    });


    if (!course) {
        return;
    }


    const confirmed = confirm(
        `Are you sure you want to delete ${course.code} - ${course.title}?`
    );


    if (!confirmed) {
        return;
    }


    courses = courses.filter(function(course) {
        return course.id !== id;
    });


    saveCourses();

    renderCourses();

    updateStatistics();
}


// FORM SUBMISSION


courseForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const newCourse = {

        id: editingCourseId || Date.now(),

        code: courseCode.value.trim().toUpperCase(),

        title: courseTitle.value.trim(),

        department: courseDepartment.value,

        faculty: courseFaculty.value.trim(),

        units: Number(courseUnits.value),

        level: courseLevel.value,

        semester: courseSemester.value,

        type: courseType.value,

        status: courseStatus.value
    };


    if (editingCourseId) {

        courses = courses.map(function(course) {

            if (course.id === editingCourseId) {
                return newCourse;
            }

            return course;
        });

    } else {

        courses.push(newCourse);
    }


    saveCourses();

    renderCourses();

    updateStatistics();

    closeCourseModal();
});


//  DEPARTMENT AUTO-FACULTY


courseDepartment.addEventListener("change", function() {

    const departments = JSON.parse(
        localStorage.getItem(departmentStorageKey)
    ) || [];


    const selectedDepartment = departments.find(function(department) {

        return department.name === courseDepartment.value;

    });


    if (selectedDepartment) {

        courseFaculty.value =
            selectedDepartment.faculty;
    }
});


//  SEARCH


searchCourse.addEventListener("input", function() {

    renderCourses();

});


// FILTERS


courseDepartmentFilter.addEventListener("change", function() {

    renderCourses();

});


courseLevelFilter.addEventListener("change", function() {

    renderCourses();

});


// BUTTON EVENTS


addCourseBtn.addEventListener("click", function() {

    openAddCourseModal();

});


emptyAddBtn.addEventListener("click", function() {

    openAddCourseModal();

});


closeModal.addEventListener("click", function() {

    closeCourseModal();

});


cancelBtn.addEventListener("click", function() {

    closeCourseModal();

});


// CLOSE MODAL WHEN CLICKING OUTSIDE


courseModal.addEventListener("click", function(event) {

    if (event.target === courseModal) {

        closeCourseModal();

    }

});


// INITIAL PAGE LOAD


loadDepartments();

renderCourses();

updateStatistics();