// Schoolsync university
// Student management


// page element
const addStudentBtn =
    document.getElementById("addStudentBtn");

const emptyAddBtn =
    document.getElementById("emptyAddBtn");

const studentModal =
    document.getElementById("studentModal");

const closeModal =
    document.getElementById("closeModal");

const cancelBtn =
    document.getElementById("cancelBtn");

const studentForm =
    document.getElementById("studentForm");

const studentTableBody =
    document.getElementById("studentTableBody");

const emptyState =
    document.getElementById("emptyState");

const searchStudent =
    document.getElementById("searchStudent");

const levelFilter =
    document.getElementById("levelFilter");


// Statistics
const totalStudents =
    document.getElementById("totalStudents");

const activeStudents =
    document.getElementById("activeStudents");

const undergraduateStudents =
    document.getElementById(
        "undergraduateStudents"
    );

const postgraduateStudents =
    document.getElementById(
        "postgraduateStudents"
    );


// form inputs
const studentId =
    document.getElementById("studentId");

const studentName =
    document.getElementById("studentName");

const studentGender =
    document.getElementById("studentGender");

const studentLevel =
    document.getElementById("studentLevel");

const studentFaculty =
    document.getElementById("studentFaculty");

const studentDepartment =
    document.getElementById("studentDepartment");

const studentProgramme =
    document.getElementById("studentProgramme");

const studentSession =
    document.getElementById("studentSession");

const studentPhone =
    document.getElementById("studentPhone");

const studentEmail =
    document.getElementById("studentEmail");

const studentStatus =
    document.getElementById("studentStatus");

const modalTitle =
    document.getElementById("modalTitle");


// Student mode
let students =
    JSON.parse(
        localStorage.getItem(
            "schoolSyncStudents"
        )
    ) || [];


// Edit mode
let editingStudentId = null;


// Open modal
function openModal() {

    studentModal.classList.add("show");

}


//Close modal
function closeStudentModal() {

    studentModal.classList.remove("show");

    studentForm.reset();

    editingStudentId = null;

    modalTitle.textContent =
        "Add New Student";

}


// Button event

addStudentBtn.addEventListener(
    "click",
    openModal
);

emptyAddBtn.addEventListener(
    "click",
    openModal
);

closeModal.addEventListener(
    "click",
    closeStudentModal
);

cancelBtn.addEventListener(
    "click",
    closeStudentModal
);


// Save student

studentForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const student = {

            id:
                studentId.value
                    .trim(),

            name:
                studentName.value
                    .trim(),

            gender:
                studentGender.value,

            level:
                studentLevel.value,

            faculty:
                studentFaculty.value
                    .trim(),

            department:
                studentDepartment.value
                    .trim(),

            programme:
                studentProgramme.value
                    .trim(),

            session:
                studentSession.value,

            phone:
                studentPhone.value
                    .trim(),

            email:
                studentEmail.value
                    .trim(),

            status:
                studentStatus.value

        };


        // Update
        if (
            editingStudentId !== null
        ) {

            students =
                students.map(
                    function (existingStudent) {

                        if (
                            existingStudent.id ===
                            editingStudentId
                        ) {

                            return student;

                        }

                        return existingStudent;

                    }
                );

        }


        //  Add
        else {

            students.push(student);

        }


       // Save
        localStorage.setItem(
            "schoolSyncStudents",
            JSON.stringify(students)
        );


        // Refresh

        displayStudents();

        closeStudentModal();

    }
);


//Display student

function displayStudents() {

    studentTableBody.innerHTML = "";


    const searchValue =
        searchStudent.value
            .toLowerCase()
            .trim();


    const selectedLevel =
        levelFilter.value;


    const filteredStudents =
        students.filter(
            function (student) {

                const matchesSearch =

                    student.name
                        .toLowerCase()
                        .includes(searchValue)

                    ||

                    student.id
                        .toLowerCase()
                        .includes(searchValue);


                const matchesLevel =

                    selectedLevel === "all"

                    ||

                    student.level ===
                    selectedLevel;


                return (
                    matchesSearch &&
                    matchesLevel
                );

            }
        );


//  Empty
    if (
        filteredStudents.length === 0
    ) {

        emptyState.style.display =
            "block";

        updateStatistics();

        return;

    }


    emptyState.style.display =
        "none";

// Table row

    filteredStudents.forEach(
        function (student) {

            const row =
                document.createElement("tr");


            const initials =
                student.name
                    .split(" ")
                    .map(
                        word =>
                            word[0]
                    )
                    .join("")
                    .substring(0, 2)
                    .toUpperCase();


            row.innerHTML = `

                <td>

                    <div class="student-cell">

                        <div class="student-avatar">

                            ${initials}

                        </div>


                        <div>

                            <span class="student-name">

                                ${student.name}

                            </span>


                            <span class="student-email">

                                ${
                                    student.email ||
                                    "No email provided"
                                }

                            </span>

                        </div>

                    </div>

                </td>


                <td>

                    ${student.id}

                </td>


                <td>

                    ${student.gender}

                </td>


                <td>

                    ${student.level}

                </td>


                <td>

                    ${student.department}

                </td>


                <td>

                    <span
                        class="status ${student.status
                            .toLowerCase()
                            .replace(" ", "-")}"
                    >

                        ${student.status}

                    </span>

                </td>


                <td>

                    <div class="action-buttons">


                        <button
                            class="action-btn edit"
                            onclick="editStudent('${student.id}')"
                            title="Edit student"
                        >
                            ✎
                        </button>


                        <button
                            class="action-btn delete"
                            onclick="deleteStudent('${student.id}')"
                            title="Delete student"
                        >
                            🗑
                        </button>


                    </div>

                </td>

            `;


            studentTableBody.appendChild(row);

        }
    );


    updateStatistics();

}
// Statistics

function updateStatistics() {

    totalStudents.textContent =
        students.length;


    activeStudents.textContent =

        students.filter(
            student =>
                student.status ===
                "Active"
        ).length;


    undergraduateStudents.textContent =

        students.filter(
            student =>

                student.level !==
                "Postgraduate"

        ).length;


    postgraduateStudents.textContent =

        students.filter(
            student =>

                student.level ===
                "Postgraduate"

        ).length;

}


// Edit student

function editStudent(id) {

    const student =
        students.find(
            student =>
                student.id === id
        );


    if (!student) {

        return;

    }


    studentId.value =
        student.id;

    studentName.value =
        student.name;

    studentGender.value =
        student.gender;

    studentLevel.value =
        student.level;

    studentFaculty.value =
        student.faculty;

    studentDepartment.value =
        student.department;

    studentProgramme.value =
        student.programme;

    studentSession.value =
        student.session;

    studentPhone.value =
        student.phone;

    studentEmail.value =
        student.email;

    studentStatus.value =
        student.status;


    editingStudentId =
        id;


    modalTitle.textContent =
        "Edit Student";


    openModal();

}


// Delete student

function deleteStudent(id) {

    const student =
        students.find(
            student =>
                student.id === id
        );


    if (!student) {

        return;

    }


    const confirmed =
        confirm(
            `Delete ${student.name} from the student records?`
        );


    if (!confirmed) {

        return;

    }


    students =
        students.filter(
            student =>
                student.id !== id
        );


    localStorage.setItem(
        "schoolSyncStudents",
        JSON.stringify(students)
    );


    displayStudents();

}


// Search

searchStudent.addEventListener(
    "input",
    displayStudents
);


// Level filter

levelFilter.addEventListener(
    "change",
    displayStudents
);


// Initial load

displayStudents();