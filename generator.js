const generatorDiv = document.querySelector(".generator");
const generateBtn = generatorDiv.querySelector(".generator-form button");
const qrInput = generatorDiv.querySelector(".generator-form input");
const qrImg = generatorDiv.querySelector(".generator-img img");
const downloadBtn = generatorDiv.querySelector(".generator-btn .btn-link");

let imgURL = '';

generateBtn.addEventListener("click", () => {
    let qrValue = qrInput.value.trim();
    if (!qrValue) return;
    generateBtn.innerText = "Generating QR code....";
    imgURL = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${qrValue}`;
    qrImg.src = imgURL;
    generateBtn.innerText = "Generate QR Code";

    qrImg.addEventListener("load" , () => {
        generatorDiv.classList.add("active");
        generateBtn.innerText = "Generate QR code ";
    })
    console.log(imgURL);
});

downloadBtn.addEventListener("click", () => {
    if (!imgURL) return;
    fetchImage(imgURL);
});

function fetchImage(url) {
    fetch(url)
        .then(res => res.blob())
        .then(file => {
            console.log(file);
            let tempFile = URL.createObjectURL(file);
            let file_name = url.split("/").pop().split(".")[0];
            let extension = file.type.split("/")[1];
            download(tempFile, file_name, extension);
        })
        .catch(() => imgURL = '');
}

function download(tempFile, file_name, extension) {
    let a = document.createElement('a');
    a.href = tempFile;
    a.download = `${file_name}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(tempFile);
}

// if the value is empty remove acctive class 

qrInput.addEventListener("input" , () => {
    if(!qrInput.value.trim())
        return generatorDiv.classList.remove("active");
})