document.addEventListener("deviceready", function () {
  const permissions = cordova.plugins.permissions;

  permissions.hasPermission(permissions.READ_CONTACTS, function (status) {
    if (!status.hasPermission) {
      permissions.requestPermission(
        permissions.READ_CONTACTS,
        function (status) {
          if (status.hasPermission) {
            console.log("Permission granted!");
          } else {
            alert("Permission to access contacts was denied.");
          }
        },
        function (error) {
          console.error("Permission request failed:", error);
        }
      );
    } else {
      console.log("Already has contacts permission.");
    }
  });
});

// Load contacts from localStorage or initialize as empty
let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
let currentEditId = null;
let pendingPhoneNumber = null;
let pendingEditPhoneNumber = null;


// Save contacts to localStorage
function saveContacts() {
  localStorage.setItem("contacts", JSON.stringify(contacts));
}

// Returns an emoji for a given category
function getEmoji(category) {
  switch (category) {
    case "Family": return "👪";
    case "Friend": return "😃";
    case "Business": return "💼";
    case "Romantic": return "❤️";
    default: return "";
  }
}


// Add a new contact
function addContact(name, durationMillis, category) {
  if (!name || durationMillis <= 0) {
    alert("Please enter a valid name and duration.");
    return;
  }

  const newContact = {
    id: Date.now(),
    name: name,
    duration: parseInt(durationMillis, 10),
    category: category,
    lastReset: Date.now(),
    pressHistory: [],
    phone: pendingPhoneNumber || null
  };

  console.log("Adding contact:", name, durationMillis, category, newContact.phone);

  contacts.push(newContact);
  scheduleNotifications(newContact);
  saveContacts();
  renderContacts();

  pendingPhoneNumber = null;
  document.getElementById("linkedPhoneDisplay").textContent = "";
}

// Reset the timer for a contact
function resetTimer(id) {
  const contact = contacts.find(c => c.id === id);
  if (contact) {
    if (
      typeof cordova !== "undefined" &&
      cordova.plugins &&
      cordova.plugins.notification &&
      cordova.plugins.notification.local
    ) {
      cordova.plugins.notification.local.cancel([contact.id, contact.id + 1, contact.id + 2]);
    }

    contact.lastReset = Date.now();
    contact.pressHistory.push(Date.now());
    scheduleNotifications(contact);
    saveContacts();
    renderContacts();
  }
}

// Show press history for a contact
function showDetails(id) {
  const contact = contacts.find(c => c.id === id);
  if (contact) {
    if (contact.pressHistory.length === 0) {
      alert("No press history available for " + contact.name);
    } else {
      let details = "Press History for " + contact.name + ":\n";
      contact.pressHistory.forEach((timestamp, index) => {
        const date = new Date(timestamp);
        details += (index + 1) + ". " + date.toLocaleString() + "\n";
      });
      alert(details);
    }
  }
}

// Open the edit modal
function editContact(id) {
  const contact = contacts.find(c => c.id === id);
  if (contact) {
    currentEditId = id;
    pendingEditPhoneNumber = contact.phone || null;
    document.getElementById("editName").value = contact.name;
    document.getElementById("editDuration").value = contact.duration;
    document.getElementById("editCategory").value = contact.category;
    document.getElementById("editModal").style.display = "flex";
    document.getElementById("editLinkedPhoneDisplay").textContent = pendingEditPhoneNumber || "";
  }
}

// Save the edited contact
document.getElementById("saveEditButton").addEventListener("click", () => {
  const contact = contacts.find(c => c.id === currentEditId);
  if (contact) {
    contact.name = document.getElementById("editName").value;
    contact.duration = parseInt(document.getElementById("editDuration").value, 10);
    contact.category = document.getElementById("editCategory").value;
    contact.phone = pendingEditPhoneNumber;
    pendingEditPhoneNumber = null;
    document.getElementById("editLinkedPhoneDisplay").textContent = "";
    saveContacts();
    renderContacts();
  }
  document.getElementById("editModal").style.display = "none";
  currentEditId = null;
});

document.getElementById("cancelEditButton").addEventListener("click", () => {
  document.getElementById("editModal").style.display = "none";
  currentEditId = null;
});

// Format milliseconds into readable time
function formatTime(ms) {
  if (ms < 0) return "Time's up!";
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  return `${days}d, ${hours}h, ${minutes}m, ${seconds}s`;
}

// Render the contact list
function renderContacts() {
  const container = document.getElementById("contactsContainer");
  container.innerHTML = "";
  contacts.forEach(contact => {
    const div = document.createElement("div");
    div.className = "contact";

    const h3 = document.createElement("h3");
    h3.textContent = getEmoji(contact.category) + " " + contact.name;
    div.appendChild(h3);

    const timerDiv = document.createElement("div");
    timerDiv.id = "timer-" + contact.id;
    div.appendChild(timerDiv);

    const logButton = document.createElement("button");
    logButton.textContent = "Log";
    logButton.onclick = () => showDetails(contact.id);
    div.appendChild(logButton);

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = () => editContact(contact.id);
    div.appendChild(editButton);

    const resetButton = document.createElement("button");
    resetButton.textContent = "Contacted";
    resetButton.onclick = () => resetTimer(contact.id);
    div.appendChild(resetButton);

    // Call & Text buttons if phone is linked
    if (contact.phone) {
      const callBtn = document.createElement("button");
      callBtn.textContent = "Call";
      callBtn.onclick = () => window.open("tel:" + contact.phone, "_system");
      div.appendChild(callBtn);

      const textBtn = document.createElement("button");
      textBtn.textContent = "Text";
      textBtn.onclick = () => window.open("sms:" + contact.phone + "?body=Hey, just checking in!", "_system");
      div.appendChild(textBtn);
    }

    container.appendChild(div);
  });
}

// Timer updater
setInterval(() => {
  contacts.forEach(contact => {
    const timerDiv = document.getElementById("timer-" + contact.id);
    if (timerDiv) {
      const endTime = contact.lastReset + contact.duration;
      const timeLeft = endTime - Date.now();
      timerDiv.textContent = "Time left: " + formatTime(timeLeft);
      timerDiv.style.color = (timeLeft > 0 && timeLeft < 60000) ? "red" : "var(--text-color)";
    }
  });
}, 1000);

// Add button listener
document.getElementById("addButton").addEventListener("click", () => {
  const name = document.getElementById("nameInput").value;
  const durationMillis = document.getElementById("durationSelect").value;
  const category = document.getElementById("categorySelect").value;
  addContact(name, durationMillis, category);
  document.getElementById("nameInput").value = "";
});

// Link phone button listener
document.getElementById("linkPhoneButton").addEventListener("click", () => {
  const permissions = cordova.plugins.permissions;

  permissions.hasPermission(permissions.READ_CONTACTS, (status) => {
    if (status.hasPermission) {
      // We already have permission, go straight to search
      searchAndLinkContact();
    } else {
      // Ask for permission, then search if granted
      permissions.requestPermission(
        permissions.READ_CONTACTS,
        (result) => {
          if (result.hasPermission) {
            searchAndLinkContact();
          } else {
            alert("Permission to access contacts was denied.");
          }
        },
        (err) => {
          console.error("Permission request failed:", err);
          alert("Permission request failed.");
        }
      );
    }
  });
});

document.getElementById("editLinkPhoneButton").addEventListener("click", () => {
  const query = prompt("Enter a name or part of a name:");

  if (!navigator.contacts || !navigator.contacts.find) {
    alert("Contact access not available.");
    return;
  }

  const options = new ContactFindOptions();
  options.filter = query;
  options.multiple = true;

  const fields = ["displayName", "name", "phoneNumbers"];

  navigator.contacts.find(fields, function(foundContacts) {
    const withPhone = foundContacts.find(c => c.phoneNumbers && c.phoneNumbers.length > 0);
    if (withPhone) {
      pendingEditPhoneNumber = withPhone.phoneNumbers[0].value;
      document.getElementById("editLinkedPhoneDisplay").textContent = pendingEditPhoneNumber;
    } else {
      alert("No contact with phone number found.");
    }
  }, function(err) {
    console.error("Contact search failed:", err);
    alert("Contact search failed.");
  }, options);
});

document.getElementById("editClearPhoneButton").addEventListener("click", () => {
  pendingEditPhoneNumber = null;
  document.getElementById("editLinkedPhoneDisplay").textContent = "";
});


// Contact search using cordova-plugin-contacts
function searchAndLinkContact() {
  const query = prompt("Enter a name or part of a name:");

  if (!navigator.contacts || !navigator.contacts.find) {
    alert("Contact access not available.");
    return;
  }

  const options = new ContactFindOptions();
  options.filter = query;
  options.multiple = true;

  const fields = ["displayName", "name", "phoneNumbers"];

  navigator.contacts.find(fields, function(foundContacts) {
    const withPhone = foundContacts.find(c => c.phoneNumbers && c.phoneNumbers.length > 0);
    if (withPhone) {
      pendingPhoneNumber = withPhone.phoneNumbers[0].value;
      document.getElementById("linkedPhoneDisplay").textContent = pendingPhoneNumber;
    } else {
      alert("No contact with phone number found.");
    }
  }, function(err) {
    console.error("Contact search failed:", err);
    alert("Contact search failed.");
  }, options);
}


function ensureNotificationPermission(callback) {
  const permissions = cordova.plugins.permissions;
  const permission = permissions.POST_NOTIFICATIONS;

  permissions.hasPermission(permission, function (status) {
    if (status.hasPermission) {
      callback(); // Permission granted, continue
    } else {
      permissions.requestPermission(permission, function (status) {
        if (status.hasPermission) {
          callback(); // Permission just granted
        } else {
          alert("Notification permission is required to send reminders.");
        }
      }, function (err) {
        console.error("Notification permission request failed", err);
        alert("Failed to request notification permission.");
      });
    }
  });
}

// Schedule notifications
function scheduleNotifications(contact) {
  ensureNotificationPermission(() => {
    if (
      typeof cordova === "undefined" ||
      !cordova.plugins ||
      !cordova.plugins.notification ||
      !cordova.plugins.notification.local
    ) {
      console.warn("Notifications not available or Cordova not ready.");
      return;
    }

    const idBase = contact.id;
    const triggerTimes = [
      { offset: 4 * 60 * 60 * 1000, label: "4 hours" },
      { offset: 2 * 60 * 60 * 1000, label: "2 hours" },
      { offset: 15 * 60 * 1000, label: "15 minutes" }
    ];

    triggerTimes.forEach((reminder, i) => {
      const triggerAt = new Date(contact.lastReset + contact.duration - reminder.offset);
      if (triggerAt.getTime() > Date.now()) {
        cordova.plugins.notification.local.schedule({
          id: idBase + i,
          title: `Reach out to ${contact.name}`,
          text: `Timer expires in ${reminder.label}.`,
          foreground: true,
          trigger: { at: triggerAt }
        });
      }
    });
  });
}


  const idBase = contact.id;
  const triggerTimes = [
    { offset: 4 * 60 * 60 * 1000, label: "4 hours" },
    { offset: 2 * 60 * 60 * 1000, label: "2 hours" },
    { offset: 15 * 60 * 1000, label: "15 minutes" }
  ];

  triggerTimes.forEach((reminder, i) => {
    const triggerAt = new Date(contact.lastReset + contact.duration - reminder.offset);
    if (triggerAt.getTime() > Date.now()) {
      cordova.plugins.notification.local.schedule({
        id: idBase + i,
        title: `Reach out to ${contact.name}`,
        text: `Timer expires in ${reminder.label}.`,
        foreground: true,
        trigger: { at: triggerAt }
      });
    }
  });
}

// Load contacts on startup
renderContacts();
