// SchoolSync - Settings

const universityForm =
    document.getElementById("universityForm");

const profileForm =
    document.getElementById("profileForm");

const clearDataBtn =
    document.getElementById("clearDataBtn");


// Load Saved Settings

const savedUniversity =
    JSON.parse(
        localStorage.getItem("schoolSyncUniversity")
    ) || {};

const savedProfile =
    JSON.parse(
        localStorage.getItem("schoolSyncAdminProfile")
    ) || {};

const savedPreferences =
    JSON.parse(
        localStorage.getItem("schoolSyncPreferences")
    ) || {};


// UNIVERSITY

if (savedUniversity.name) {
    document.getElementById("universityName").value =
        savedUniversity.name;
}

if (savedUniversity.code) {
    document.getElementById("universityCode").value =
        savedUniversity.code;
}

if (savedUniversity.session) {
    document.getElementById("academicSession").value =
        savedUniversity.session;
}

if (savedUniversity.semester) {
    document.getElementById("currentSemester").value =
        savedUniversity.semester;
}


// PROFILE

if (savedProfile.name) {
    document.getElementById("adminName").value =
        savedProfile.name;
}

if (savedProfile.role) {
    document.getElementById("adminRole").value =
        savedProfile.role;
}

if (savedProfile.email) {
    document.getElementById("adminEmail").value =
        savedProfile.email;
}


// PREFERENCES

if (
    savedPreferences.emailNotifications !== undefined
) {
    document.getElementById("emailNotifications").checked =
        savedPreferences.emailNotifications;
}

if (
    savedPreferences.attendanceAlerts !== undefined
) {
    document.getElementById("attendanceAlerts").checked =
        savedPreferences.attendanceAlerts;
}

if (
    savedPreferences.autoSave !== undefined
) {
    document.getElementById("autoSave").checked =
        savedPreferences.autoSave;
}


// University Profile

universityForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const university = {

            name:
                document.getElementById(
                    "universityName"
                ).value.trim(),

            code:
                document.getElementById(
                    "universityCode"
                ).value.trim(),

            session:
                document.getElementById(
                    "academicSession"
                ).value,

            semester:
                document.getElementById(
                    "currentSemester"
                ).value

        };


        localStorage.setItem(
            "schoolSyncUniversity",
            JSON.stringify(university)
        );


        alert(
            "University settings saved successfully."
        );

    }
);


// Admin Profile

profileForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const profile = {

            name:
                document.getElementById(
                    "adminName"
                ).value.trim(),

            role:
                document.getElementById(
                    "adminRole"
                ).value.trim(),

            email:
                document.getElementById(
                    "adminEmail"
                ).value.trim()

        };


        localStorage.setItem(
            "schoolSyncAdminProfile",
            JSON.stringify(profile)
        );


        alert(
            "Administrator profile saved successfully."
        );

    }
);


// Preferences

const preferenceInputs = [
    "emailNotifications",
    "attendanceAlerts",
    "autoSave"
];


preferenceInputs.forEach(
    function(id) {

        document
            .getElementById(id)
            .addEventListener(
                "change",
                savePreferences
            );

    }
);


function savePreferences() {

    const preferences = {

        emailNotifications:
            document.getElementById(
                "emailNotifications"
            ).checked,

        attendanceAlerts:
            document.getElementById(
                "attendanceAlerts"
            ).checked,

        autoSave:
            document.getElementById(
                "autoSave"
            ).checked

    };


    localStorage.setItem(
        "schoolSyncPreferences",
        JSON.stringify(preferences)
    );

}


// Clear Data

clearDataBtn.addEventListener(
    "click",
    function() {

        const confirmed =
            confirm(
                "This will permanently remove your SchoolSync records from this browser. Continue?"
            );


        if (!confirmed) {
            return;
        }


        const secondConfirmation =
            confirm(
                "Are you really sure? Students, courses, results, attendance, registrations and announcements will be deleted."
            );


        if (!secondConfirmation) {
            return;
        }


        const dataKeys = [

            "schoolSyncStudents",

            "schoolSyncLecturers",

            "schoolSyncDepartments",

            "schoolSyncCourses",

            "schoolSyncRegistrations",

            "schoolSyncResults",

            "schoolSyncAttendance",

            "schoolSyncAnnouncements"

        ];


        dataKeys.forEach(
            function(key) {

                localStorage.removeItem(key);

            }
        );


        alert(
            "SchoolSync system data has been cleared."
        );


        location.reload();

    }
);