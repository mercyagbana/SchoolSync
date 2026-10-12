// SCHOOLSYNC - REPORTS MANAGEMNET


// STORAGE

const students =
    JSON.parse(
        localStorage.getItem(
            "schoolSyncStudents"
        )
    ) || [];


const lecturers =
    JSON.parse(
        localStorage.getItem(
            "schoolSyncLecturers"
        )
    ) || [];


const departments =
    JSON.parse(
        localStorage.getItem(
            "schoolSyncDepartments"
        )
    ) || [];


const courses =
    JSON.parse(
        localStorage.getItem(
            "schoolSyncCourses"
        )
    ) || [];


const registrations =
    JSON.parse(
        localStorage.getItem(
            "schoolSyncRegistrations"
        )
    ) || [];


const results =
    JSON.parse(
        localStorage.getItem(
            "schoolSyncResults"
        )
    ) || [];


const attendance =
    JSON.parse(
        localStorage.getItem(
            "schoolSyncAttendance"
        )
    ) || [];


// ELEMENTS

const reportType =
    document.getElementById(
        "reportType"
    );


const generateReportBtn =
    document.getElementById(
        "generateReportBtn"
    );


const printReportBtn =
    document.getElementById(
        "printReportBtn"
    );


const reportContent =
    document.getElementById(
        "reportContent"
    );


const reportTitle =
    document.getElementById(
        "reportTitle"
    );


const reportDate =
    document.getElementById(
        "reportDate"
    );


// STATS

document.getElementById(
    "reportStudents"
).textContent = students.length;


document.getElementById(
    "reportLecturers"
).textContent = lecturers.length;


document.getElementById(
    "reportCourses"
).textContent = courses.length;


document.getElementById(
    "reportDepartments"
).textContent = departments.length;


// Current report

const today =
    new Date();


reportDate.textContent =
    today.toLocaleDateString(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );


// Generate report

generateReportBtn.addEventListener(
    "click",
    function() {

        const type =
            reportType.value;


        if (type === "overview") {

            generateOverviewReport();

        }


        if (type === "students") {

            generateStudentReport();

        }


        if (type === "results") {

            generateResultsReport();

        }


        if (type === "attendance") {

            generateAttendanceReport();

        }


        if (type === "registration") {

            generateRegistrationReport();

        }

    }
);


// OVERVIEW REPORT

function generateOverviewReport() {

    reportTitle.textContent =
        "University Overview";


    reportContent.innerHTML = `

        <div class="report-section">

            <h3>
                SchoolSync System Summary
            </h3>

            <table>

                <tr>
                    <th>Category</th>
                    <th>Total</th>
                </tr>

                <tr>
                    <td>Students</td>
                    <td>${students.length}</td>
                </tr>

                <tr>
                    <td>Lecturers</td>
                    <td>${lecturers.length}</td>
                </tr>

                <tr>
                    <td>Departments</td>
                    <td>${departments.length}</td>
                </tr>

                <tr>
                    <td>Courses</td>
                    <td>${courses.length}</td>
                </tr>

                <tr>
                    <td>Course Registrations</td>
                    <td>${registrations.length}</td>
                </tr>

                <tr>
                    <td>Results Recorded</td>
                    <td>${results.length}</td>
                </tr>

                <tr>
                    <td>Attendance Records</td>
                    <td>${attendance.length}</td>
                </tr>

            </table>

        </div>

    `;

}


// STUDENT REPORT

function generateStudentReport() {

    reportTitle.textContent =
        "Student Report";


    if (students.length === 0) {

        reportContent.innerHTML = `

            <div class="report-empty">
                No students have been registered yet.
            </div>

        `;

        return;
    }


    let rows = "";


    students.forEach(
        function(student) {

            rows += `

                <tr>

                    <td>
                        ${student.studentId || "-"}
                    </td>

                    <td>
                        ${student.name || "-"}
                    </td>

                    <td>
                        ${student.department || "-"}
                    </td>

                    <td>
                        ${student.level || "-"}
                    </td>

                </tr>

            `;

        }
    );


    reportContent.innerHTML = `

        <table>

            <thead>

                <tr>

                    <th>
                        Student ID
                    </th>

                    <th>
                        Name
                    </th>

                    <th>
                        Department
                    </th>

                    <th>
                        Level
                    </th>

                </tr>

            </thead>

            <tbody>
                ${rows}
            </tbody>

        </table>

    `;

}


// RESULTS REPORT

function generateResultsReport() {

    reportTitle.textContent =
        "Results Report";


    if (results.length === 0) {

        reportContent.innerHTML = `

            <div class="report-empty">
                No academic results have been recorded.
            </div>

        `;

        return;
    }


    let rows = "";


    results.forEach(
        function(result) {

            rows += `

                <tr>

                    <td>
                        ${result.studentName}
                    </td>

                    <td>
                        ${result.courseCode}
                    </td>

                    <td>
                        ${result.score}
                    </td>

                    <td>
                        ${result.grade}
                    </td>

                    <td>
                        ${result.gradePoint}
                    </td>

                    <td>
                        ${result.semester}
                    </td>

                </tr>

            `;

        }
    );


    reportContent.innerHTML = `

        <table>

            <thead>

                <tr>

                    <th>
                        Student
                    </th>

                    <th>
                        Course
                    </th>

                    <th>
                        Score
                    </th>

                    <th>
                        Grade
                    </th>

                    <th>
                        Point
                    </th>

                    <th>
                        Semester
                    </th>

                </tr>

            </thead>

            <tbody>
                ${rows}
            </tbody>

        </table>

    `;

}


// ATTENDANCE REPORT

function generateAttendanceReport() {

    reportTitle.textContent =
        "Attendance Report";


    if (attendance.length === 0) {

        reportContent.innerHTML = `

            <div class="report-empty">
                No attendance records have been recorded.
            </div>

        `;

        return;
    }


    let rows = "";


    attendance.forEach(
        function(record) {

            rows += `

                <tr>

                    <td>
                        ${record.studentName}
                    </td>

                    <td>
                        ${record.courseCode}
                    </td>

                    <td>
                        ${record.date}
                    </td>

                    <td>
                        ${record.status}
                    </td>

                </tr>

            `;

        }
    );


    reportContent.innerHTML = `

        <table>

            <thead>

                <tr>

                    <th>
                        Student
                    </th>

                    <th>
                        Course
                    </th>

                    <th>
                        Date
                    </th>

                    <th>
                        Status
                    </th>

                </tr>

            </thead>

            <tbody>
                ${rows}
            </tbody>

        </table>

    `;

}



function generateRegistrationReport() {

    reportTitle.textContent =
        "Course Registration Report";


    if (registrations.length === 0) {

        reportContent.innerHTML = `

            <div class="report-empty">
                No course registrations have been recorded.
            </div>

        `;

        return;
    }


    let rows = "";


    registrations.forEach(
        function(registration) {

            const student =
                students.find(
                    function(student) {

                        return String(
                            student.id
                        ) === String(
                            registration.studentId
                        );

                    }
                );


            rows += `

                <tr>

                    <td>
                        ${
                            student
                                ? student.name
                                : registration.studentId
                        }
                    </td>

                    <td>
                        ${registration.session}
                    </td>

                    <td>
                        ${registration.semester}
                    </td>

                    <td>
                        ${registration.level}
                    </td>

                    <td>
                        ${
                            registration.courseIds
                                ? registration.courseIds.length
                                : 0
                        }
                    </td>

                    <td>
                        ${
                            registration.totalUnits || "-"
                        }
                    </td>

                </tr>

            `;

        }
    );


    reportContent.innerHTML = `

        <table>

            <thead>

                <tr>

                    <th>
                        Student
                    </th>

                    <th>
                        Session
                    </th>

                    <th>
                        Semester
                    </th>

                    <th>
                        Level
                    </th>

                    <th>
                        Courses
                    </th>

                    <th>
                        Units
                    </th>

                </tr>

            </thead>

            <tbody>
                ${rows}
            </tbody>

        </table>

    `;

}


// PRINT REPORT


printReportBtn.addEventListener(
    "click",
    function() {

        window.print();

    }
);


// INITIAL REPORT
generateOverviewReport();