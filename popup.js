let mediaStream = null;
let mediaRecorder = null;
let chunks = [];

document.getElementById('startRecordingButton').addEventListener('click', startRecordingButton);
document.getElementById('stopRecordingButton').addEventListener('click', stopRecordingButton);

async function startRecordingButton() {
    try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        mediaStream = stream;
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start();


        document.getElementById('startRecordingButton').disabled = true;
        document.getElementById('stopRecordingButton').disabled = false;
    } catch (error) {
        console.error('Error starting recording:', error);
    }
}

function handleDataAvailable(event) {
    if (event.data.size > 0) {
        chunks.push(event.data);
    }
}

function stopRecordingButton() {
    if (mediaRecorder) {
        mediaRecorder.stop();
        mediaStream.getTracks().forEach(track => track.stop());
        const blob = new Blob(chunks, { type: 'video/webm' });

        // Create a temporary download link for the user to save the recording
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'screen_recording.webm';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        chunks = [];
        document.getElementById('startRecordingButton').disabled = false;
        document.getElementById('stopRecordingButton').disabled = true;
    }
}

