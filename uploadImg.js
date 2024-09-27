const fs = require("fs");
const path = require("path");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

// Khởi tạo mảng imgUrls
let imgUrls = [];

if (fs.existsSync("./img.json")) {
  try {
    const data = fs.readFileSync("./img.json", "utf8");
    if (data) {
      imgUrls = JSON.parse(data);
      
      // Kiểm tra imgUrls có phải là mảng không
      if (!Array.isArray(imgUrls)) {
        console.error("Data in img.json is not an array. Initializing as empty array.");
        imgUrls = [];
      }
    }
  } catch (err) {
    console.error("Error reading or parsing img.json:", err);
    imgUrls = []; // Khởi tạo lại mảng nếu có lỗi
  }
}

for (var i = 1; i <  5; i++) {
  const filePath = path.resolve(__dirname, `./asset/${i}.jpg`);

  // Kiểm tra file tồn tại trước khi upload
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    continue;
  }

  cloudinary.uploader
    .upload(filePath, { resource_type: "image" })
    .then((result) => {
      const url = result.secure_url;
      
      // Kiểm tra lại mảng trước khi thêm vào
      if (Array.isArray(imgUrls)) {
        imgUrls.push(url);
        console.log("Added URL:", url);
      } else {
        console.error("imgUrls is not an array. Skipping this entry.");
      }

      // Ghi lại mảng imgUrls vào file img.json
      try {
        fs.writeFileSync("./img.json", JSON.stringify(imgUrls, null, 2));
        console.log("File updated successfully.");
      } catch (err) {
        console.error("Error writing to img.json:", err);
      }

      console.log("Success:", JSON.stringify(result, null, 2));
    })
    .catch((error) => {
      console.error("Upload error:", error.message || error);
    });
}
