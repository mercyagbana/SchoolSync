// SCHOOLS YNC UNIVERSITY DASHBOARD

document.addEventListener("DOMContentLoaded", function () {
    "use strict";



    function readStorage(key, fallback = []) {
        try {
            const value = localStorage.getItem(key);

            if (!value) return fallback;

            const parsed = JSON.parse(value);

            return parsed;
        } catch (error) {
            console.warn("Could not read storage:", key, error);
            return fallback;
        }
    }

    function readArray(key) {
        const value = readStorage(key, []);

        // Support either a direct array or an object containing records.
        if (Array.isArray(value)) return value;

        if (value && typeof value === "object") {
            for (const property of [
                "students",
                "lecturers",
                "departments",
                "courses",
                "attendance",
                "records",
                "activities",
                "data"
            ]) {
                if (Array.isArray(value[property])) {
                    return value[property];
                }
            }
        }

        return [];
    }

    function findFirstArray(keys) {
        for (const key of keys) {
            const value = readArray(key);

            if (value.length > 0) return value;
        }

        return [];
    }

    function setText(id, value) {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
        }
    }

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, function (character) {
            const replacements = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };

            return replacements[character];
        });
    }

    function showToast(message) {
        const toast = document.getElementById("dashboardToast");

        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        // The CSS transition hides the toast when this class is removed.
        if (toast._hideTimeout) {
            clearTimeout(toast._hideTimeout);
        }

        toast._hideTimeout = setTimeout(function () {
            toast.classList.remove("show");
        }, 3000);
    }

    // DATE AND TIME
 

    function updateDateTime() {
        const now = new Date();

        setText(
            "currentDay",
            new Intl.DateTimeFormat("en-NG", {
                weekday: "long"
            }).format(now)
        );

        setText(
            "currentDate",
            new Intl.DateTimeFormat("en-NG", {
                day: "numeric",
                month: "short",
                year: "numeric"
            }).format(now)
        );

        setText(
            "currentTime",
            new Intl.DateTimeFormat("en-NG", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            }).format(now)
        );

        setText("footerYear", now.getFullYear());
    }

    updateDateTime();

    // Keep the clock current without refreshing the whole page.
    setInterval(updateDateTime, 30000);

    // ADMINISTRATOR PROFILE
-

    function updateAdminProfile() {
        const possibleNames = [
            "schoolSyncAdmin",
            "schoolSyncCurrentUser",
            "currentAdmin",
            "loggedInUser"
        ];

        let adminName = "Administrator";

        for (const key of possibleNames) {
            const stored = readStorage(key, null);

            if (typeof stored === "string" && stored.trim()) {
                adminName = stored.trim();
                break;
            }

            if (stored && typeof stored === "object") {
                const name =
                    stored.name ||
                    stored.fullName ||
                    stored.username ||
                    stored.email;

                if (name) {
                    adminName = String(name);
                    break;
                }
            }
        }

        setText("sidebarAdminName", adminName);
        setText("topAdminName", adminName);
        setText("welcomeAdminName", adminName);

        const initial = adminName.charAt(0).toUpperCase() || "A";

        document.querySelectorAll(".profile-avatar, .top-avatar")
            .forEach(function (avatar) {
                avatar.textContent = initial;
            });
    }

    // LOAD UNIVERSITY RECORDS
  

    function getStudents() {
        return findFirstArray([
            "schoolSyncStudents",
            "schoolSyncStudent",
            "students"
        ]);
    }

    function getLecturers() {
        return findFirstArray([
            "schoolSyncLecturers",
            "schoolSyncLecturer",
            "lecturers"
        ]);
    }

    function getDepartments() {
        return findFirstArray([
            "schoolSyncDepartments",
            "schoolSyncDepartment",
            "departments"
        ]);
    }

    function getCourses() {
        return findFirstArray([
            "schoolSyncCourses",
            "schoolSyncCourse",
            "courses"
        ]);
    }

    function isActiveRecord(record) {
        if (!record || typeof record !== "object") {
            return true;
        }

        const status = String(
            record.status ?? record.state ?? ""
        ).trim().toLowerCase();

        if (
            ["inactive", "disabled", "deleted", "archived", "cancelled"]
                .includes(status)
        ) {
            return false;
        }

        if (
            record.isActive === false ||
            record.active === false
        ) {
            return false;
        }

        return true;
    }

    function updateStatistics() {
        const students = getStudents();
        const lecturers = getLecturers();
        const courses = getCourses();

        setText("dashboardStudentCount", students.length);

        setText(
            "dashboardLecturerCount",
            lecturers.length
        );

        setText(
            "dashboardCourseCount",
            courses.filter(isActiveRecord).length
        );

        updateTodayAttendance();
    }

    // ATTENDANCE RECORDS


    function getAttendanceRecords() {
        return findFirstArray([
            "schoolSyncAttendance",
            "schoolSyncAttendances",
            "schoolSyncAttendanceRecords",
            "schoolSyncAttendanceData",
            "attendanceRecords",
            "attendance",
            "attendances"
        ]);
    }

    function getRecordDate(record) {
        if (!record || typeof record !== "object") {
            return null;
        }

        const possibleFields = [
            "date",
            "attendanceDate",
            "recordDate",
            "createdAt",
            "timestamp"
        ];

        for (const field of possibleFields) {
            if (record[field] === undefined || record[field] === null) {
                continue;
            }

            const raw = record[field];

            // Avoid accidentally treating an arbitrary number as a date.
            if (typeof raw === "number" && raw < 100000000) {
                continue;
            }

            const date = new Date(raw);

            if (!Number.isNaN(date.getTime())) {
                return date;
            }
        }

        return null;
    }

    function getAttendanceStatus(record) {
        if (!record || typeof record !== "object") {
            return "";
        }

        return String(
            record.status ??
            record.attendanceStatus ??
            record.attendance ??
            ""
        ).trim().toLowerCase();
    }

    function isPresent(record) {
        const status = getAttendanceStatus(record);

        return [
            "present",
            "late",
            "on time"
        ].includes(status);
    }

    function getDateKey(date) {
        return [
            date.getFullYear(),
            String(date.getMonth() + 1).padStart(2, "0"),
            String(date.getDate()).padStart(2, "0")
        ].join("-");
    }

    function calculateAttendance(records) {
        const validRecords = records.filter(function (record) {
            return Boolean(getRecordDate(record)) &&
                Boolean(getAttendanceStatus(record));
        });

        if (validRecords.length === 0) {
            return {
                rate: 0,
                total: 0,
                present: 0
            };
        }

        const presentCount = validRecords.filter(isPresent).length;

        return {
            rate: Math.round(
                (presentCount / validRecords.length) * 100
            ),
            total: validRecords.length,
            present: presentCount
        };
    }

    function updateTodayAttendance() {
        const todayKey = getDateKey(new Date());

        const todaysRecords = getAttendanceRecords().filter(
            function (record) {
                const date = getRecordDate(record);

                return date && getDateKey(date) === todayKey;
            }
        );

        const result = calculateAttendance(todaysRecords);

        setText(
            "dashboardAttendanceRate",
            result.total ? result.rate + "%" : "0%"
        );

        setText(
            "attendanceStatNote",
            result.total
                ? result.present + " of " + result.total + " records present"
                : "No records for today"
        );
    }

    // ATTENDANCE CHART
  

    const attendancePeriod = document.getElementById("attendancePeriod");
    const attendanceChart = document.getElementById("attendanceChart");

    function getPeriodRange(period) {
        const now = new Date();
        const start = new Date(now);
        const end = new Date(now);

        if (period === "week") {
            // Monday through Sunday.
            const day = now.getDay();
            const daysSinceMonday = (day + 6) % 7;

            start.setDate(now.getDate() - daysSinceMonday);
            start.setHours(0, 0, 0, 0);

            end.setDate(start.getDate() + 6);
            end.setHours(23, 59, 59, 999);
        } else if (period === "month") {
            start.setDate(1);
            start.setHours(0, 0, 0, 0);

            end.setMonth(now.getMonth() + 1, 0);
            end.setHours(23, 59, 59, 999);
        } else {
            start.setMonth(0, 1);
            start.setHours(0, 0, 0, 0);

            end.setMonth(11, 31);
            end.setHours(23, 59, 59, 999);
        }

        return { start, end, now };
    }

    function getChartBuckets(period) {
        const range = getPeriodRange(period);
        const buckets = [];

        if (period === "week") {
            const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

            for (let i = 0; i < 7; i++) {
                const date = new Date(range.start);
                date.setDate(range.start.getDate() + i);

                buckets.push({
                    label: dayNames[i],
                    dateKey: getDateKey(date),
                    date: date
                });
            }
        } else if (period === "month") {
            const dayCount = new Date(
                range.now.getFullYear(),
                range.now.getMonth() + 1,
                0
            ).getDate();

            for (let day = 1; day <= dayCount; day++) {
                const date = new Date(
                    range.now.getFullYear(),
                    range.now.getMonth(),
                    day
                );

                buckets.push({
                    label: String(day),
                    dateKey: getDateKey(date),
                    date: date
                });
            }
        } else {
            const monthNames = [
                "Jan", "Feb", "Mar", "Apr",
                "May", "Jun", "Jul", "Aug",
                "Sep", "Oct", "Nov", "Dec"
            ];

            for (let month = 0; month < 12; month++) {
                const date = new Date(range.now.getFullYear(), month, 1);

                buckets.push({
                    label: monthNames[month],
                    month: month,
                    year: range.now.getFullYear(),
                    date: date
                });
            }
        }

        return buckets;
    }

    function getRecordsForBucket(records, bucket, period) {
        return records.filter(function (record) {
            const date = getRecordDate(record);

            if (!date) return false;

            if (period === "year") {
                return date.getFullYear() === bucket.year &&
                    date.getMonth() === bucket.month;
            }

            return getDateKey(date) === bucket.dateKey;
        });
    }

    function renderAttendanceChart() {
        if (!attendanceChart) return;

        const period = attendancePeriod
            ? attendancePeriod.value
            : "week";

        const records = getAttendanceRecords();
        const buckets = getChartBuckets(period);

        const chartData = buckets.map(function (bucket) {
            const matchedRecords = getRecordsForBucket(
                records,
                bucket,
                period
            );

            const result = calculateAttendance(matchedRecords);

            return {
                label: bucket.label,
                rate: result.rate,
                total: result.total,
                present: result.present
            };
        });

        const recordedBuckets = chartData.filter(function (item) {
            return item.total > 0;
        });

        const average = recordedBuckets.length
            ? Math.round(
                recordedBuckets.reduce(function (sum, item) {
                    return sum + item.rate;
                }, 0) / recordedBuckets.length
            )
            : 0;

        setText("chartAverage", average + "%");

        const subtitle = {
            week: "Daily attendance for this week",
            month: "Daily attendance for this month",
            year: "Monthly attendance for this year"
        };

        setText(
            "attendanceSubtitle",
            subtitle[period] || subtitle.week
        );

        setText(
            "chartFootnote",
            recordedBuckets.length
                ? "Average calculated from " + recordedBuckets.length +
                  " period(s) with attendance records."
                : "No attendance records are available for this period yet."
        );

        attendanceChart.setAttribute(
            "aria-label",
            "Attendance rate chart. Average " + average + " percent."
        );

        attendanceChart.innerHTML = chartData.map(function (item) {
            const height = item.total > 0 ? item.rate : 0;

            const description = item.total > 0
                ? item.rate + "% attendance, " +
                  item.present + " present out of " + item.total + " records"
                : "No attendance records";

            return `
                <div class="chart-column"
                     role="group"
                     aria-label="${escapeHTML(item.label)}: ${escapeHTML(description)}">
                    <div class="chart-track">
                        <span class="chart-bar"
                              style="height: ${height}%;"
                              title="${escapeHTML(description)}"></span>
                    </div>
                    <small>${escapeHTML(item.label)}</small>
                </div>
            `;
        }).join("");
    }

    if (attendancePeriod) {
        attendancePeriod.addEventListener(
            "change",
            renderAttendanceChart
        );
    }

    // RECENT ACTIVITY
    

    function getActivities() {
        return findFirstArray([
            "schoolSyncActivities",
            "schoolSyncActivity",
            "schoolSyncRecentActivity",
            "schoolSyncLogs",
            "systemActivities"
        ]);
    }

    function getActivityTitle(activity) {
        return activity.title ||
            activity.action ||
            activity.description ||
            activity.message ||
            "System activity";
    }

    function getActivityDate(activity) {
        const raw = activity.timestamp ||
            activity.createdAt ||
            activity.date ||
            activity.time;

        if (!raw) return null;

        const date = new Date(raw);

        return Number.isNaN(date.getTime()) ? null : date;
    }

    function getRelativeTime(date) {
        if (!date) return "Date unavailable";

        const seconds = Math.max(
            0,
            Math.floor((Date.now() - date.getTime()) / 1000)
        );

        if (seconds < 60) return "Just now";

        const minutes = Math.floor(seconds / 60);

        if (minutes < 60) {
            return minutes + (minutes === 1 ? " min ago" : " mins ago");
        }

        const hours = Math.floor(minutes / 60);

        if (hours < 24) {
            return hours + (hours === 1 ? " hour ago" : " hours ago");
        }

        const days = Math.floor(hours / 24);

        if (days < 7) {
            return days + (days === 1 ? " day ago" : " days ago");
        }

        return new Intl.DateTimeFormat("en-NG", {
            day: "numeric",
            month: "short"
        }).format(date);
    }

    function getActivityCategory(activity) {
        const text = (
            getActivityTitle(activity) + " " +
            (activity.category || activity.type || "")
        ).toLowerCase();

        if (text.includes("student")) {
            return { symbol: "+", color: "blue", label: "Student records" };
        }

        if (text.includes("attendance")) {
            return { symbol: "✓", color: "green", label: "Attendance" };
        }

        if (text.includes("result") || text.includes("grade")) {
            return { symbol: "◈", color: "purple", label: "Academic results" };
        }

        if (text.includes("announcement")) {
            return { symbol: "!", color: "orange", label: "Announcements" };
        }

        if (text.includes("course")) {
            return { symbol: "▤", color: "purple", label: "Course records" };
        }

        if (text.includes("lecturer")) {
            return { symbol: "♟", color: "blue", label: "Lecturer records" };
        }

        return {
            symbol: "•",
            color: "blue",
            label: activity.category || activity.type || "System activity"
        };
    }

    function renderActivities() {
        const container = document.getElementById("recentActivityList");

        if (!container) return;

        const activities = getActivities()
            .filter(function (activity) {
                return activity && typeof activity === "object";
            })
            .sort(function (a, b) {
                const dateA = getActivityDate(a);
                const dateB = getActivityDate(b);

                return (dateB ? dateB.getTime() : 0) -
                    (dateA ? dateA.getTime() : 0);
            })
            .slice(0, 5);

        if (activities.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span>◷</span>
                    <p>No recorded activity yet.</p>
                    <small>New activity will appear here when available.</small>
                </div>
            `;

            return;
        }

        container.innerHTML = activities.map(function (activity) {
            const category = getActivityCategory(activity);
            const date = getActivityDate(activity);
            const title = getActivityTitle(activity);

            const detail = activity.details ||
                activity.category ||
                activity.type ||
                category.label;

            return `
                <div class="activity-item">
                    <div class="activity-icon ${category.color}">
                        ${escapeHTML(category.symbol)}
                    </div>
                    <div class="activity-details">
                        <strong>${escapeHTML(title)}</strong>
                        <span>${escapeHTML(detail)}</span>
                    </div>
                    <small class="activity-time">
                        ${escapeHTML(getRelativeTime(date))}
                    </small>
                </div>
            `;
        }).join("");
    }


    const menuButton = document.getElementById("dashboardMenuBtn");
    const dropdown = document.getElementById("dashboardDropdown");

    function closeDropdown() {
        if (!menuButton || !dropdown) return;

        dropdown.classList.add("hidden");
        menuButton.setAttribute("aria-expanded", "false");
    }

    if (menuButton && dropdown) {
        menuButton.addEventListener("click", function (event) {
            event.stopPropagation();

            const isOpen = !dropdown.classList.contains("hidden");

            dropdown.classList.toggle("hidden", isOpen);
            menuButton.setAttribute("aria-expanded", String(!isOpen));
        });

        dropdown.addEventListener("click", function (event) {
            event.stopPropagation();
        });

        document.addEventListener("click", function (event) {
            if (!event.target.closest(".dashboard-menu")) {
                closeDropdown();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeDropdown();
            }
        });
    }


    const refreshButton = document.getElementById("refreshDashboard");

    function refreshDashboard() {
        updateAdminProfile();
        updateStatistics();
        renderAttendanceChart();
        renderActivities();
        updateDateTime();

        closeDropdown();
        showToast("Dashboard refreshed successfully.");
    }

    if (refreshButton) {
        refreshButton.addEventListener("click", refreshDashboard);
    }


    const mobileMenuButton = document.getElementById("mobileMenuBtn");
    const sidebar = document.getElementById("sidebar");

    function closeMobileSidebar() {
        if (!sidebar || !mobileMenuButton) return;

        sidebar.classList.remove("open");
        mobileMenuButton.setAttribute("aria-expanded", "false");
    }

    if (mobileMenuButton && sidebar) {
        mobileMenuButton.addEventListener("click", function () {
            const isOpen = sidebar.classList.toggle("open");

            mobileMenuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });

        document.addEventListener("click", function (event) {
            if (
                window.innerWidth <= 760 &&
                sidebar.classList.contains("open") &&
                !sidebar.contains(event.target) &&
                !mobileMenuButton.contains(event.target)
            ) {
                closeMobileSidebar();
            }
        });

        sidebar.querySelectorAll(".nav-item").forEach(function (link) {
            link.addEventListener("click", closeMobileSidebar);
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > 760) {
                closeMobileSidebar();
            }
        });
    }

    // NOTIFICATION AND ACTIVITY BUTTONS
  

    const notificationButton = document.getElementById("notificationBtn");

    if (notificationButton) {
        notificationButton.addEventListener("click", function () {
            const activities = getActivities();

            if (activities.length === 0) {
                showToast("You have no recorded system notifications.");
            } else {
                showToast(
                    "There are " + activities.length +
                    " recorded activities. Check Recent Activity."
                );
            }
        });
    }

    const viewAllButton = document.getElementById("viewAllActivity");

    if (viewAllButton) {
        viewAllButton.addEventListener("click", function () {
            window.location.href = "report.html";
        });
    }
    // INITIALISE THE DASHBOARD


    updateAdminProfile();
    updateStatistics();
    renderAttendanceChart();
    renderActivities();

    // Refresh data when the user returns to this browser tab.
    document.addEventListener("visibilitychange", function () {
        if (!document.hidden) {
            updateDateTime();
            updateStatistics();
            renderAttendanceChart();
            renderActivities();
        }
    });
});
