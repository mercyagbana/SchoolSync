// SCHOOLSYNC - ANNOUNCEMENTS

const announcementStorageKey =
    "schoolSyncAnnouncements";


let announcements =
    JSON.parse(
        localStorage.getItem(
            announcementStorageKey
        )
    ) || [];


const announcementForm =
    document.getElementById(
        "announcementForm"
    );


const announcementList =
    document.getElementById(
        "announcementList"
    );


const announcementCount =
    document.getElementById(
        "announcementCount"
    );


const announcementTitle =
    document.getElementById(
        "announcementTitle"
    );


const announcementAudience =
    document.getElementById(
        "announcementAudience"
    );


const announcementPriority =
    document.getElementById(
        "announcementPriority"
    );


const announcementMessage =
    document.getElementById(
        "announcementMessage"
    );


// SAVE


function saveAnnouncements() {

    localStorage.setItem(
        announcementStorageKey,
        JSON.stringify(announcements)
    );

}


// RENDER

function renderAnnouncements() {

    announcementCount.textContent =
        announcements.length;


    if (announcements.length === 0) {

        announcementList.innerHTML = `

            <div class="empty-announcements">

                <div style="font-size: 30px; margin-bottom: 10px;">
                    📢
                </div>

                <strong>
                    No announcements yet
                </strong>

                <p>
                    Published announcements will appear here.
                </p>

            </div>

        `;

        return;
    }


    announcementList.innerHTML =
        announcements
        .slice()
        .reverse()
        .map(
            function(announcement) {

                let priorityClass =
                    "badge-normal";


                if (
                    announcement.priority ===
                    "Important"
                ) {

                    priorityClass =
                        "badge-important";

                }


                if (
                    announcement.priority ===
                    "Urgent"
                ) {

                    priorityClass =
                        "badge-urgent";

                }


                return `

                    <div class="announcement-item">

                        <div class="announcement-top">

                            <div>

                                <h3>
                                    ${announcement.title}
                                </h3>

                            </div>

                            <button
                                class="delete-announcement"
                                onclick="deleteAnnouncement(${announcement.id})"
                                title="Delete announcement"
                            >
                                ×
                            </button>

                        </div>


                        <p class="announcement-message">
                            ${announcement.message}
                        </p>


                        <div class="announcement-meta">

                            <span>
                                👥 ${announcement.audience}
                            </span>

                            <span>•</span>

                            <span>
                                ${announcement.createdAt}
                            </span>

                            <span
                                class="badge ${priorityClass}"
                            >
                                ${announcement.priority}
                            </span>

                        </div>

                    </div>

                `;

            }
        )
        .join("");

}


// CREATE ANNOUNCEMENT

announcementForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const title =
            announcementTitle.value.trim();


        const audience =
            announcementAudience.value;


        const priority =
            announcementPriority.value;


        const message =
            announcementMessage.value.trim();


        if (!title || !message) {

            alert(
                "Please enter the announcement title and message."
            );

            return;
        }


        const announcement = {

            id: Date.now(),

            title: title,

            audience: audience,

            priority: priority,

            message: message,

            createdAt:
                new Date().toLocaleString(
                    "en-US",
                    {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit"
                    }
                )

        };


        announcements.push(
            announcement
        );


        saveAnnouncements();

        renderAnnouncements();

        announcementForm.reset();


        alert(
            "Announcement published successfully."
        );

    }
);



// DELETE


function deleteAnnouncement(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this announcement?"
        );


    if (!confirmed) {
        return;
    }


    announcements =
        announcements.filter(
            function(announcement) {

                return announcement.id !== id;

            }
        );


    saveAnnouncements();

    renderAnnouncements();

}


// INITIAL LOAD

renderAnnouncements();