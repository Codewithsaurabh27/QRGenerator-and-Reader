const scannerDiv = document.querySelector(".scanner");

const camera = scannerDiv.querySelector("h1 .fa-camera");
const stopCam = scannerDiv.querySelector("h1 .fa-circle-stop");

const form = scannerDiv.querySelector(".scanner-form");
const fileInput = form.querySelector("input");
const p = form.querySelector("p");
const img = form.querySelector("img");
const video = form.querySelector("video");
const content = form.querySelector(".content");

const textarea = scannerDiv.querySelector(".scanner-details textarea");
const copyBtn = scannerDiv.querySelector(".scanner-details .copy");
const closeBtn = scannerDiv.querySelector(".scanner-details .close");

const scanSound = document.getElementById("scanSound"); // Get the audio element

form.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    fetchRequest(file);
});

async function fetchRequest(file) {
    const formData = new FormData();
    formData.append("file", file);

    p.innerText = "Scanning QR code...";

    try {
        const response = await fetch(`https://api.qrserver.com/v1/read-qr-code/`, {
            method: "POST",
            body: formData
        });
        const result = await response.json();
        const text = result[0].symbol[0].data;

        if (!text) {
            p.innerText = "Couldn't scan QR code.";
            return;
        }

        scannerDiv.classList.add("active");
        form.classList.add("active-img");
        img.src = URL.createObjectURL(file);
        textarea.innerText = text;

    } catch (error) {
        p.innerText = "An error occurred while scanning the QR code.";
        console.error(error);
    }
}

// scan QR code using camera 

let scanner;
camera.addEventListener("click", () => {
    camera.style.display = "none";
    p.innerText = "Scanning QR code...";

    scanner = new Instascan.Scanner({ video: video });
    Instascan.Camera.getCameras()
        .then(cameras => {
            if (cameras.length > 0) {
                scanner.start(cameras[0]).then(() => {
                    form.classList.add("active-video");
                    stopCam.style.display = "inline-block";
                });
            } else {
                console.log("No cameras found.");
                p.innerText = "No cameras found.";
                camera.style.display = "inline-block";
            }
        })
        .catch(err => {
            console.error(err);
            p.innerText = "Error accessing camera.";
            camera.style.display = "inline-block";
        });

    scanner.addListener("scan", content => {
        scannerDiv.classList.add("active");
        form.classList.remove("active-video");
        stopCam.style.display = "none";
        textarea.innerText = content;
        p.innerText = "QR code scanned successfully!";
        scanSound.play(); // Play the audio

        // Remove the line that stops the scanner here
    });
});

// Event listener to stop the camera
stopCam.addEventListener("click", () => {
    p.innerText = "";
    stopCam.style.display = "none";
    camera.style.display = "inline-block";
    if (scanner) {
        scanner.stop();
    }
});

copyBtn.addEventListener("click", () => {
    let text = textarea.textContent;
    navigator.clipboard.writeText(text); // corrected 'Text' to 'text'
});

closeBtn.addEventListener("click", () => stopScan());

function stopScan() {
    p.innerText = "Upload QR Code to scan";

    scannerDiv.classList.remove("active");
    form.classList.remove("active-img");
    form.classList.remove("active-video"); // added to hide video form
    video.srcObject = null; // added to reset the video source

    if (scanner) {
        scanner.stop();
    }
}
