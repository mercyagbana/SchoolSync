//  SCHOOLSYNC - COURSE REGISTRATION



// STORAGE KEYS

const courseStorageKey = "schoolSyncCourses";
const studentStorageKey = "schoolSyncStudents";
const registrationStorageKey = "schoolSyncRegistrations";


// LOAD DATA

const courses =
    JSON.parse(
        localStorage.getItem(courseStorageKey)
    ) || [];

const students =
    JSON.parse(
        localStorage.getItem(studentStorageKey)
    ) || [];

let registrations =
    JSON.parse(
        localStorage.getItem(registrationStorageKey)
    ) || [];


// SELECTED COURSES

let selectedCourses = [];


// HTML ELEMENTS

const studentSelect =
    document.getElementById("studentSelect");

const sessionSelect =
    document.getElementById("sessionSelect");

const semesterSelect =
    document.getElementById("semesterSelect");

const levelSelect =
    document.getElementById("levelSelect");

const courseList =
    document.getElementById("courseList");

const registrationTableBody =
    document.getElementById("registrationTableBody");

const totalUnits =
    document.getElementById("totalUnits");

const summaryUnits =
    document.getElementById("summaryUnits");

const registerBtn =
    document.getElementById("registerBtn");


// LOAD STUDENTS


function loadStudents() {

    studentSelect.innerHTML = `
        <option value="">
            Select Student
        </option>
    `;

    students.forEach(function(student) {

        const option =
            document.createElement("option");

        option.value = student.id;

        option.textContent =
            `${student.studentId || student.id} - ${student.name}`;

        studentSelect.appendChild(option);
    });
}


// LOAD COURSES


function loadCourses() {

    courseList.innerHTML = "";

    const selectedSemester =
        semesterSelect.value;

    const selectedLevel =
        levelSelect.value.replace(" Level", "");


    // Only show ACTIVE courses

    let availableCourses =
        courses.filter(function(course) {

            return course.status === "Active";

        });


    // Filter by semester

    if (selectedSemester) {

        availableCourses =
            availableCourses.filter(function(course) {

                return course.semester === selectedSemester;

            });
    }


    // Filter by level

    if (selectedLevel) {

        availableCourses =
            availableCourses.filter(function(course) {

                return course.level === selectedLevel;

            });
    }


    // No courses found

    if (availableCourses.length === 0) {

        courseList.innerHTML = `
            <div class="no-courses">

                No courses are available
                for the selected level and semester.

            </div>
        `;

        return;
    }


    // DISPLAY COURSES

    availableCourses.forEach(function(course) {

        const courseItem =
            document.createElement("div");

        courseItem.className =
            "course-item";


        const isSelected =
            selectedCourses.includes(
                Number(course.id)
            );


        courseItem.innerHTML = `

            <input
                type="checkbox"
                class="course-checkbox"
                data-id="${course.id}"
                ${isSelected ? "checked" : ""}
            >

            <div class="course-info">

                <div class="course-code">
                    ${course.code}
                </div>

                <div class="course-name">
                    ${course.title}
                </div>

                <div class="course-meta">

                    <span>
                        ${course.department}
                    </span>

                    <span class="course-units">
                        ${course.units} Units
                    </span>

                </div>

            </div>

        `;


        courseList.appendChild(courseItem);

    });
}


// COURSE CHECKBOXES


courseList.addEventListener(
    "change",
    function(event) {

        if (
            !event.target.classList.contains(
                "course-checkbox"
            )
        ) {
            return;
        }


        const courseId =
            Number(
                event.target.dataset.id
            );


        if (event.target.checked) {

            if (
                !selectedCourses.includes(
                    courseId
                )
            ) {

                selectedCourses.push(
                    courseId
                );
            }

        } else {

            selectedCourses =
                selectedCourses.filter(
                    function(id) {

                        return id !== courseId;

                    }
                );
        }


        updateRegistrationSummary();
    }
);


// UPDATE REGISTRATION SUMMARY


function updateRegistrationSummary() {

    const selected =
        courses.filter(function(course) {

            return selectedCourses.includes(
                Number(course.id)
            );

        });


    const units =
        selected.reduce(
            function(total, course) {

                return total +
                    Number(course.units || 0);

            },
            0
        );


    totalUnits.textContent =
        units;

    summaryUnits.textContent =
        `${units} Units`;


    renderSelectedCourses(selected);
}


// RENDER SELECTED COURSES


function renderSelectedCourses(selected) {

    registrationTableBody.innerHTML = "";


    if (selected.length === 0) {

        registrationTableBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="empty-table"
                >

                    No courses selected yet.

                </td>

            </tr>

        `;

        return;
    }


    selected.forEach(function(course) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>
                    ${course.code}
                </strong>
            </td>

            <td>
                ${course.title}
            </td>

            <td>
                ${course.department}
            </td>

            <td>
                ${course.units}
            </td>

            <td>
                ${course.type}
            </td>

            <td>

                <button
                    class="remove-course"
                    data-id="${course.id}"
                    title="Remove course"
                >
                    ×
                </button>

            </td>

        `;


        registrationTableBody.appendChild(row);

    });
}


// REMOVE COURSE FROM REGISTRATION


registrationTableBody.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                ".remove-course"
            );


        if (!button) {
            return;
        }


        const courseId =
            Number(
                button.dataset.id
            );


        selectedCourses =
            selectedCourses.filter(
                function(id) {

                    return id !== courseId;

                }
            );


        loadCourses();

        updateRegistrationSummary();

    }
);


// WHEN LEVEL CHANGES


levelSelect.addEventListener(
    "change",
    function() {

        selectedCourses = [];

        loadCourses();

        updateRegistrationSummary();

    }
);


// WHEN SEMESTER CHANGES


semesterSelect.addEventListener(
    "change",
    function() {

        selectedCourses = [];

        loadCourses();

        updateRegistrationSummary();

    }
);


// COMPLETE REGISTRATION


registerBtn.addEventListener(
    "click",
    function() {

        const studentId =
            studentSelect.value;

        const session =
            sessionSelect.value;

        const semester =
            semesterSelect.value;

        const level =
            levelSelect.value;


        // CHECK STUDENT

        if (!studentId) {

            alert(
                "Please select a student."
            );

            return;
        }


        // CHECK SESSION

        if (!session) {

            alert(
                "Please select an academic session."
            );

            return;
        }


        // CHECK SEMESTER

        if (!semester) {

            alert(
                "Please select a semester."
            );

            return;
        }


        // CHECK LEVEL

        if (!level) {

            alert(
                "Please select the student's level."
            );

            return;
        }


        // CHECK COURSES

        if (selectedCourses.length === 0) {

            alert(
                "Please select at least one course."
            );

            return;
        }


        // CHECK DUPLICATE REGISTRATION

        const existingRegistration =
            registrations.find(
                function(registration) {

                    return (

                        String(
                            registration.studentId
                        ) === String(studentId)

                        &&

                        registration.session ===
                        session

                        &&

                        registration.semester ===
                        semester

                    );

                }
            );


        if (existingRegistration) {

            alert(
                "This student already has a course registration for this semester."
            );

            return;
        }


        // CALCULATE TOTAL UNITS

        const selected =
            courses.filter(function(course) {

                return selectedCourses.includes(
                    Number(course.id)
                );

            });


        const total =
            selected.reduce(
                function(sum, course) {

                    return sum +
                        Number(course.units || 0);

                },
                0
            );


        // CREATE REGISTRATION

        const newRegistration = {

            id: Date.now(),

            studentId:
                studentId,

            session:
                session,

            semester:
                semester,

            level:
                level,

            courseIds:
                [...selectedCourses],

            totalUnits:
                total,

            registeredAt:
                new Date().toISOString()

        };


        // SAVE

        registrations.push(
            newRegistration
        );


        localStorage.setItem(
            registrationStorageKey,
            JSON.stringify(
                registrations
            )
        );


        // SUCCESS

        alert(
            "Course registration completed successfully."
        );


        // RESET

        resetRegistration();

    }
);


// RESET REGISTRATION


function resetRegistration() {

    studentSelect.value = "";

    sessionSelect.value = "";

    semesterSelect.value = "";

    levelSelect.value = "";

    selectedCourses = [];


    loadCourses();

    updateRegistrationSummary();

}


//  INITIAL PAGE LOAD


loadStudents();

loadCourses();

updateRegistrationSummary();