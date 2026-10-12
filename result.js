// SchoolSync | Result Management

// STORAGE KEYS

const studentStorageKey =
    "schoolSyncStudents";

const courseStorageKey =
    "schoolSyncCourses";

const resultStorageKey =
    "schoolSyncResults";


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


let results =
    JSON.parse(
        localStorage.getItem(
            resultStorageKey
        )
    ) || [];


// HTML ELEMENTS

const studentSelect =
    document.getElementById(
        "studentSelect"
    );


const sessionSelect =
    document.getElementById(
        "sessionSelect"
    );


const semesterSelect =
    document.getElementById(
        "semesterSelect"
    );


const courseSelect =
    document.getElementById(
        "courseSelect"
    );


const scoreInput =
    document.getElementById(
        "scoreInput"
    );


const saveResultBtn =
    document.getElementById(
        "saveResultBtn"
    );


const resultTableBody =
    document.getElementById(
        "resultTableBody"
    );


const totalResults =
    document.getElementById(
        "totalResults"
    );


const aGrades =
    document.getElementById(
        "aGrades"
    );


const bGrades =
    document.getElementById(
        "bGrades"
    );


const failedResults =
    document.getElementById(
        "failedResults"
    );


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


    const semester =
        semesterSelect.value;


    courses.forEach(function(course) {

        if (
            course.status !== "Active"
        ) {
            return;
        }


        if (
            semester &&
            course.semester !== semester
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


// CALCULATE GRADE


function getGrade(score) {

    if (score >= 70) {

        return "A";

    }

    if (score >= 60) {

        return "B";

    }

    if (score >= 50) {

        return "C";

    }

    if (score >= 45) {

        return "D";

    }

    if (score >= 40) {

        return "E";

    }

    return "F";

}


// GRADE POINT

function getGradePoint(score) {

    if (score >= 70) {

        return 5;

    }

    if (score >= 60) {

        return 4;

    }

    if (score >= 50) {

        return 3;

    }

    if (score >= 45) {

        return 2;

    }

    if (score >= 40) {

        return 1;

    }

    return 0;

}


// GRADE CSS CLASS

function getGradeClass(grade) {

    if (grade === "A") {

        return "grade-a";

    }

    if (grade === "B") {

        return "grade-b";

    }

    if (grade === "C") {

        return "grade-c";

    }

    if (grade === "D") {

        return "grade-d";

    }

    return "grade-f";

}


// SAVE RESULTS

function saveResults() {

    localStorage.setItem(
        resultStorageKey,
        JSON.stringify(results)
    );

}


// SAVE RESULT


saveResultBtn.addEventListener(
    "click",
    function() {


        const studentId =
            studentSelect.value;


        const session =
            sessionSelect.value;


        const semester =
            semesterSelect.value;


        const courseId =
            Number(
                courseSelect.value
            );


        const score =
            Number(
                scoreInput.value
            );


        // VALIDATION

        if (!studentId) {

            alert(
                "Please select a student."
            );

            return;
        }


        if (!session) {

            alert(
                "Please select an academic session."
            );

            return;
        }


        if (!semester) {

            alert(
                "Please select a semester."
            );

            return;
        }


        if (!courseId) {

            alert(
                "Please select a course."
            );

            return;
        }


        if (
            scoreInput.value === "" ||
            score < 0 ||
            score > 100
        ) {

            alert(
                "Please enter a score between 0 and 100."
            );

            return;
        }


        // CHECK DUPLICATE

        const duplicate =
            results.find(
                function(result) {

                    return (

                        String(
                            result.studentId
                        ) === String(studentId)

                        &&

                        Number(
                            result.courseId
                        ) === courseId

                        &&

                        result.session === session

                        &&

                        result.semester === semester

                    );

                }
            );


        if (duplicate) {

            alert(
                "A result for this student and course already exists."
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


        // CALCULATE GRADE

        const grade =
            getGrade(score);


        const gradePoint =
            getGradePoint(score);


        // CREATE RESULT

        const newResult = {

            id: Date.now(),

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

            units:
                course.units,

            session:
                session,

            semester:
                semester,

            score:
                score,

            grade:
                grade,

            gradePoint:
                gradePoint,

            recordedAt:
                new Date().toISOString()

        };


        results.push(
            newResult
        );


        saveResults();

        renderResults();

        updateStatistics();


        // RESET

        scoreInput.value = "";

        courseSelect.value = "";


        alert(
            "Result saved successfully."
        );

    }
);


// RENDER RESULTS

function renderResults() {

    resultTableBody.innerHTML = "";


    if (results.length === 0) {

        resultTableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    class="empty-table"
                >

                    No results recorded yet.

                </td>

            </tr>

        `;

        return;
    }


    results.forEach(function(result) {

        const row =
            document.createElement(
                "tr"
            );


        row.innerHTML = `

            <td>
                <strong>
                    ${result.studentName}
                </strong>
            </td>

            <td>

                <strong>
                    ${result.courseCode}
                </strong>

                <br>

                <small>
                    ${result.courseTitle}
                </small>

            </td>

            <td>
                ${result.session}
            </td>

            <td>
                ${result.semester}
            </td>

            <td>
                ${result.score}
            </td>

            <td>

                <span
                    class="grade-badge
                    ${getGradeClass(result.grade)}"
                >

                    ${result.grade}

                </span>

            </td>

            <td>
                ${result.gradePoint}
            </td>

            <td>

                <button
                    class="delete-result"
                    onclick="deleteResult(${result.id})"
                    title="Delete Result"
                >
                    ×
                </button>

            </td>

        `;


        resultTableBody.appendChild(
            row
        );

    });

}

// DELETE RESULT


function deleteResult(id) {

    const result =
        results.find(
            function(result) {

                return result.id === id;

            }
        );


    if (!result) {
        return;
    }


    const confirmed =
        confirm(
            `Delete the result for ${result.studentName} - ${result.courseCode}?`
        );


    if (!confirmed) {
        return;
    }


    results =
        results.filter(
            function(result) {

                return result.id !== id;

            }
        );


    saveResults();

    renderResults();

    updateStatistics();

}


// Update Stats

function updateStatistics() {

    const aCount =
        results.filter(
            function(result) {

                return result.grade === "A";

            }
        ).length;


    const bCount =
        results.filter(
            function(result) {

                return result.grade === "B";

            }
        ).length;


    const failedCount =
        results.filter(
            function(result) {

                return result.grade === "F";

            }
        ).length;


    totalResults.textContent =
        results.length;


    aGrades.textContent =
        aCount;


    bGrades.textContent =
        bCount;


    failedResults.textContent =
        failedCount;

}

// Semester change

semesterSelect.addEventListener(
    "change",
    function() {

        loadCourses();

    }
);


// Initial Load

loadStudents();

loadCourses();

renderResults();

updateStatistics();