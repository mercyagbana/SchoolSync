// SCHOOLSYNC - ATTENDANCE MANAGEMENT


// STORAGE KEYS

const studentStorageKey =
    "schoolSyncStudents";

const courseStorageKey =
    "schoolSyncCourses";

const attendanceStorageKey =
    "schoolSyncAttendance";


// LOAD DATA

const students =
    JSON.parse(
        localStorage.getItem(
            studentStorageKey
        )
    ) || [];


const courses =
    JSON.parse(
        localStorage.getItem(
            courseStorageKey
        )
    ) || [];


let attendanceRecords =
    JSON.parse(
        localStorage.getItem(
            attendanceStorageKey
        )
    ) || [];


// HTML ELEMENTS

const studentSelect =
    document.getElementById(
        "studentSelect"
    );

const courseSelect =
    document.getElementById(
        "courseSelect"
    );

const attendanceDate =
    document.getElementById(
        "attendanceDate"
    );

const attendanceStatus =
    document.getElementById(
        "attendanceStatus"
    );

const saveAttendanceBtn =
    document.getElementById(
        "saveAttendanceBtn"
    );

const attendanceTableBody =
    document.getElementById(
        "attendanceTableBody"
    );

const totalAttendance =
    document.getElementById(
        "totalAttendance"
    );

const presentCount =
    document.getElementById(
        "presentCount"
    );

const absentCount =
    document.getElementById(
        "absentCount"
    );

const attendanceRate =
    document.getElementById(
        "attendanceRate"
    );


// SET TODAY'S DATE


const today =
    new Date();

attendanceDate.value =
    today.toISOString()
        .split("T")[0];


// LOAD STUDENTS

function loadStudents() {

    studentSelect.innerHTML = `
        <option value="">
            Select Student
        </option>
    `;


    students.forEach(function(student) {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            student.id;


        option.textContent =
            `${student.studentId || student.id}
             - ${student.name}`;


        studentSelect.appendChild(
            option
        );

    });

}


// LOAD COURSES

function loadCourses() {

    courseSelect.innerHTML = `
        <option value="">
            Select Course
        </option>
    `;


    courses.forEach(function(course) {

        if (
            course.status !== "Active"
        ) {
            return;
        }


        const option =
            document.createElement(
                "option"
            );


        option.value =
            course.id;


        option.textContent =
            `${course.code} - ${course.title}`;


        courseSelect.appendChild(
            option
        );

    });

}


// SAVE ATTENDANCE


function saveAttendance() {

    localStorage.setItem(
        attendanceStorageKey,
        JSON.stringify(
            attendanceRecords
        )
    );

}


// SAVE ATTENDANCE RECORD


saveAttendanceBtn.addEventListener(
    "click",
    function() {

        const studentId =
            studentSelect.value;

        const courseId =
            Number(
                courseSelect.value
            );

        const date =
            attendanceDate.value;

        const status =
            attendanceStatus.value;


        if (!studentId) {

            alert(
                "Please select a student."
            );

            return;
        }


        if (!courseId) {

            alert(
                "Please select a course."
            );

            return;
        }


        if (!date) {

            alert(
                "Please select a date."
            );

            return;
        }


        if (!status) {

            alert(
                "Please select an attendance status."
            );

            return;
        }


        // CHECK DUPLICATE

        const duplicate =
            attendanceRecords.find(
                function(record) {

                    return (

                        String(
                            record.studentId
                        ) === String(studentId)

                        &&

                        Number(
                            record.courseId
                        ) === courseId

                        &&

                        record.date === date

                    );

                }
            );


        if (duplicate) {

            alert(
                "Attendance has already been recorded for this student, course and date."
            );

            return;
        }


        // FIND STUDENT

        const student =
            students.find(
                function(student) {

                    return String(
                        student.id
                    ) === String(studentId);

                }
            );


        // FIND COURSE

        const course =
            courses.find(
                function(course) {

                    return Number(
                        course.id
                    ) === courseId;

                }
            );


        if (!student || !course) {

            alert(
                "Student or course could not be found."
            );

            return;
        }


        // CREATE RECORD

        const newRecord = {

            id:
                Date.now(),

            studentId:
                student.id,

            studentName:
                student.name,

            courseId:
                course.id,

            courseCode:
                course.code,

            courseTitle:
                course.title,

            date:
                date,

            status:
                status

        };


        attendanceRecords.push(
            newRecord
        );


        saveAttendance();

        renderAttendance();

        updateStatistics();


        // RESET STATUS

        attendanceStatus.value =
            "";


        alert(
            "Attendance recorded successfully."
        );

    }
);


// RENDER ATTENDANCE

function renderAttendance() {

    attendanceTableBody.innerHTML = "";


    if (
        attendanceRecords.length === 0
    ) {

        attendanceTableBody.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-table"
                >

                    No attendance records yet.

                </td>

            </tr>

        `;

        return;
    }


    attendanceRecords.forEach(
        function(record) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    <strong>
                        ${record.studentName}
                    </strong>

                </td>

                <td>

                    <strong>
                        ${record.courseCode}
                    </strong>

                    <br>

                    <small>
                        ${record.courseTitle}
                    </small>

                </td>

                <td>
                    ${record.date}
                </td>

                <td>

                    <span
                        class="status-badge
                        ${getStatusClass(record.status)}"
                    >

                        ${record.status}

                    </span>

                </td>

                <td>

                    <button
                        class="delete-attendance"
                        onclick="deleteAttendance(${record.id})"
                        title="Delete Attendance"
                    >
                        ×
                    </button>

                </td>

            `;


            attendanceTableBody.appendChild(
                row
            );

        }
    );

}

// STATUS CLASS


function getStatusClass(status) {

    if (status === "Present") {

        return "status-present";

    }


    if (status === "Absent") {

        return "status-absent";

    }


    if (status === "Late") {

        return "status-late";

    }


    return "status-excused";

}


// DELETE ATTENDANCE

function deleteAttendance(id) {

    const record =
        attendanceRecords.find(
            function(record) {

                return record.id === id;

            }
        );


    if (!record) {
        return;
    }


    const confirmed =
        confirm(
            `Delete attendance for ${record.studentName} on ${record.date}?`
        );


    if (!confirmed) {
        return;
    }


    attendanceRecords =
        attendanceRecords.filter(
            function(record) {

                return record.id !== id;

            }
        );


    saveAttendance();

    renderAttendance();

    updateStatistics();

}


// UPDATE STATISTICS


function updateStatistics() {

    const total =
        attendanceRecords.length;


    const present =
        attendanceRecords.filter(
            function(record) {

                return (
                    record.status === "Present"
                    ||
                    record.status === "Late"
                );

            }
        ).length;


    const absent =
        attendanceRecords.filter(
            function(record) {

                return (
                    record.status === "Absent"
                );

            }
        ).length;


    let rate = 0;


    if (total > 0) {

        rate =
            Math.round(
                (present / total) * 100
            );

    }


    totalAttendance.textContent =
        total;


    presentCount.textContent =
        present;


    absentCount.textContent =
        absent;


    attendanceRate.textContent =
        `${rate}%`;

}


// INITIAL LOAD

loadStudents();

loadCourses();

renderAttendance();

updateStatistics();