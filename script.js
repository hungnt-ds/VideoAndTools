// Lấy tham chiếu đến video có khả năng thay đổi kích thước
const video = document.getElementById("resizableVideo");
// Lấy tham chiếu đến phần hiển thị phụ đề
const subtitleDisplay = document.getElementById("subtitleDisplay");
// Lấy tham chiếu đến phần xử lý thay đổi kích thước video
const handle = document.getElementById("resizableHandle");
// Biến kiểm tra xem việc thay đổi kích thước video đang diễn ra hay không
let isResizing = false;
// Các biến lưu trữ kích thước và vị trí khi bắt đầu thay đổi kích thước video
let startWidth, startHeight, startX, startY;
// Lắng nghe sự kiện mousedown để bắt đầu thay đổi kích thước video
handle.addEventListener("mousedown", startResize);

// Hàm bắt đầu THAY ĐỔI KÍCH THƯỚC VIDEO
function startResize(e) {
    e.preventDefault();
    isResizing = true;
    startWidth = video.offsetWidth;
    startHeight = video.offsetHeight;
    startX = e.clientX;
    startY = e.clientY;
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
}

// Hàm thực hiện thay đổi kích thước video
function resize(e) {
    if (isResizing) {
        const newWidth = startWidth + (e.clientX - startX);
        const newHeight = startHeight + (e.clientY - startY);
        video.style.width = `${newWidth}px`;
        video.style.height = `${newHeight}px`;
    }
}

// Hàm dừng việc thay đổi kích thước video
function stopResize() {
    isResizing = false;
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResize);
}

// Lắng nghe sự kiện khi người dùng chọn file video
const videoFileInput = document.getElementById("videoFile");
// Lắng nghe sự kiện khi người dùng chọn file phụ đề
const subtitlesFileInput = document.getElementById("subtitlesFile");

videoFileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        video.src = URL.createObjectURL(file);
    }
});

subtitlesFileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const track = document.createElement("track");
        track.label = "Subtitles";
        track.kind = "subtitles";
        track.srclang = "en";

        // Check file extension
        if (file.name.endsWith('.vtt')) {
            track.src = URL.createObjectURL(file);
        } else if (file.name.endsWith('.srt')) {
            // Handle SRT file
            // You need to implement a function to convert SRT to VTT
            // For simplicity, I'll just display the raw SRT content here
            track.src = `data:text/vtt;charset=utf-8,WEBVTT\n${convertSRTtoVTT(file)}`;
        }

        track.default = true;
        video.appendChild(track);
    }
});

function convertSRTtoVTT(srtFile) {
    // Implement your logic to convert SRT to VTT here
    // This is a simple example that just returns the content as is
    return srtFile;
}

video.addEventListener("timeupdate", function () {
    const currentTime = video.currentTime;
    const cues = video.textTracks[0].cues;

    for (let i = 0; i < cues.length; i++) {
        const cue = cues[i];
        if (currentTime >= cue.startTime && currentTime <= cue.endTime) {
            const words = cue.text.split(' ');
            subtitleDisplay.innerHTML = '';

            words.forEach(word => {
                const pElement = document.createElement('p');
                pElement.innerText = word + ' ';
                subtitleDisplay.appendChild(pElement);

                pElement.addEventListener("mouseenter", () => {
                    //video.pause();
                    const popup = document.getElementById("popup");
                    popup.textContent = pElement.innerText;
                    popup.style.display = "block";
                });

                pElement.addEventListener("mouseleave", () => {
                    const popup = document.getElementById("popup");
                    popup.style.display = "none";
                    //video.play();
                });
            });
            break;
        }
    }
});

function toggleColorScheme() {
    var body = document.body;
    var currentColor = window.getComputedStyle(body).getPropertyValue('color');
    var currentBgColor = window.getComputedStyle(body).getPropertyValue('background-color');

    // Nếu màu chữ là trắng và màu nền là đen
    if (currentColor === 'rgb(178, 190, 203)' && currentBgColor === 'rgb(29, 33, 37)') {
        body.style.color = 'rgb(29, 33, 37)'; // Chuyển sang chữ màu đen
        body.style.backgroundColor = 'rgb(178, 190, 203)'; // Chuyển sang nền màu trắng
    } else {
        body.style.color = 'rgb(178, 190, 203)'; // Chuyển sang chữ màu trắng
        body.style.backgroundColor = 'rgb(29, 33, 37)'; // Chuyển sang nền màu đen
    }
}
function redirectToOtherPage() {
    window.location.href = "count-time-mp4.html";
}

// thu gon
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
}

function changeSpeed(speed) {
    var video = document.getElementById('resizableVideo');
    video.playbackRate = speed;
}

function clearFileInputs() {
    // Lấy các trường input file
    var videoFileInput = document.getElementById("videoFile");
    var subtitlesFileInput = document.getElementById("subtitlesFile");

    // Xóa giá trị của các trường input file
    videoFileInput.value = "";
    subtitlesFileInput.value = "";
}

// video = document.getElementById("resizableVideo");
// Hàm xử lý sự kiện khi nhấn phím
function handleKeyPress(event) {
    // Kiểm tra xem phím đã nhấn có phải là mũi tên không
    if (event.keyCode >= 37 && event.keyCode <= 40) {
        // Nếu là mũi tên, tua video 5 giây tương ứng với hướng của mũi tên
        if (event.keyCode === 37) { // Mũi tên sang trái
            video.currentTime -= 5; // Tua lại 5 giây
        } else if (event.keyCode === 39) { // Mũi tên sang phải
            video.currentTime += 5; // Tua tiến 5 giây
        }
        // Ngăn chặn hành vi mặc định của trình duyệt khi nhấn mũi tên (di chuyển trang hoặc thanh cuộn)
        event.preventDefault();
    }
}

// Bắt sự kiện khi người dùng nhấn phím trên bàn phím và gọi hàm xử lý tương ứng
document.addEventListener("keydown", handleKeyPress);



function convertSRTtoVTT(srtContent) {
    // Tách các dòng SRT thành các dòng riêng biệt
    const srtLines = srtContent.split('\n');

    // Loại bỏ dòng đầu tiên (số thứ tự)
    srtLines.shift();

    // Tạo định dạng VTT bằng cách thêm dòng đầu tiên là 'WEBVTT'
    let vttContent = 'WEBVTT\n\n';

    // Duyệt qua từng dòng trong file SRT
    for (let i = 0; i < srtLines.length; i += 4) {
        // Lấy thời gian bắt đầu và kết thúc của phụ đề
        const times = srtLines[i + 1].split(' --> ');
        const startTime = times[0].replace(',', '.').trim();
        const endTime = times[1].replace(',', '.').trim();

        // Lấy nội dung của phụ đề
        const subtitleText = srtLines[i + 2].trim();

        // Thêm vào định dạng VTT
        vttContent += `${startTime} --> ${endTime}\n${subtitleText}\n\n`;
    }

    return vttContent;
}

// Lấy nội dung của file SRT (đã đọc từ file)
const srtContent = `Nội dung file SRT ở đây...`;

// Chuyển đổi từ SRT sang VTT
const vttContent = convertSRTtoVTT(srtContent);

// Tạo file VTT
const vttBlob = new Blob([vttContent], { type: 'text/vtt' });

// Tạo URL cho file VTT
const vttURL = URL.createObjectURL(vttBlob);

// Gán phụ đề cho video
video = document.getElementById('resizableVideo');
const track = document.createElement('track');
track.src = vttURL;
track.kind = 'subtitles';
track.srclang = 'en';
track.label = 'English';
video.appendChild(track);
