const API = "/api/donors";


// REGISTER DONOR

const donorForm = document.getElementById("donorForm");

if (donorForm) {
    donorForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const donor = {
            name: document.getElementById("name").value.trim(),
            age: document.getElementById("age").value,
            gender: document.getElementById("gender").value,
            bloodGroup: document.getElementById("bloodGroup").value,
            phone: document.getElementById("phone").value.trim(),
            city: document.getElementById("city").value.trim()
        };

        try {

            const response = await fetch(API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(donor)
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("Donor registered successfully!");

            donorForm.reset();

            window.location.href = "donors.html";

        } catch (error) {

            console.error(error);

            alert("Unable to connect to the server.");
        }
    });
}


// LOAD DONORS

async function loadDonors() {

    const donorList = document.getElementById("donorList");

    if (!donorList) return;

    try {

        const response = await fetch(API);

        const data = await response.json();

        displayDonors(data.donors);

    } catch (error) {

        console.error(error);

        donorList.innerHTML =
            "<p>Unable to load donors.</p>";
    }
}


// SEARCH DONORS

async function searchDonors() {

    const bloodGroup =
        document.getElementById("searchBloodGroup").value;

    if (!bloodGroup) {
        loadDonors();
        return;
    }

    try {

        const response = await fetch(
            `${API}/search?bloodGroup=${encodeURIComponent(bloodGroup)}`
        );

        const data = await response.json();

        displayDonors(data.donors);

    } catch (error) {

        console.error(error);

        alert("Search failed.");
    }
}


// DISPLAY DONORS

function displayDonors(donors) {

    const donorList =
        document.getElementById("donorList");

    if (!donorList) return;

    donorList.innerHTML = "";

    if (!donors || donors.length === 0) {

        donorList.innerHTML = `
            <div class="donor-card">
                <h3>No donors found</h3>
                <p>Try another blood group.</p>
            </div>
        `;

        return;
    }

    donors.forEach(donor => {

        donorList.innerHTML += `
            <div class="donor-card">

                <span class="blood-group">
                    ${donor.bloodGroup}
                </span>

                <h3>${donor.name}</h3>

                <p>Age: ${donor.age}</p>

                <p>Gender: ${donor.gender}</p>

                <p>📞 ${donor.phone}</p>

                <p>📍 ${donor.city}</p>

                <button
                    class="delete-btn"
                    onclick="deleteDonor('${donor.id}')">
                    Delete
                </button>

            </div>
        `;
    });
}


// DELETE DONOR

async function deleteDonor(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this donor?");

    if (!confirmDelete) return;

    try {

        const response =
            await fetch(`${API}/${id}`, {
                method: "DELETE"
            });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert("Donor deleted successfully.");

        loadDonors();

    } catch (error) {

        console.error(error);

        alert("Unable to delete donor.");
    }
}


// Automatically load donors on donors page

if (document.getElementById("donorList")) {
    loadDonors();
}