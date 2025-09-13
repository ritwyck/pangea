class CameraManager {
    constructor() {
        this.video = document.getElementById('videoElement');
        this.canvas = document.getElementById('captureCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.stream = null;
        this.isActive = false;
    }

    async startCamera() {
        try {
            console.log('Requesting camera access...');
            
            const constraints = {
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'environment' // Try back camera first, fall back to front
                },
                audio: false
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.video.srcObject = this.stream;
            this.isActive = true;

            // Update UI
            document.getElementById('startCameraBtn').textContent = 'Camera Active';
            document.getElementById('startCameraBtn').disabled = true;
            document.getElementById('captureBtn').disabled = false;

            console.log('Camera started successfully');
            return true;

        } catch (error) {
            console.error('Error accessing camera:', error);
            
            // Try with less restrictive constraints
            try {
                const fallbackConstraints = {
                    video: true,
                    audio: false
                };
                
                this.stream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
                this.video.srcObject = this.stream;
                this.isActive = true;

                document.getElementById('startCameraBtn').textContent = 'Camera Active';
                document.getElementById('startCameraBtn').disabled = true;
                document.getElementById('captureBtn').disabled = false;

                console.log('Camera started with fallback constraints');
                return true;

            } catch (fallbackError) {
                console.error('Fallback camera access failed:', fallbackError);
                alert('Unable to access camera. Please ensure you have granted camera permissions.');
                return false;
            }
        }
    }

    capturePhoto() {
        if (!this.isActive || !this.stream) {
            console.error('Camera is not active');
            return null;
        }

        // Set canvas dimensions to match video
        this.canvas.width = this.video.videoWidth;
        this.canvas.height = this.video.videoHeight;

        // Draw current video frame to canvas
        this.ctx.drawImage(this.video, 0, 0);

        // Convert to base64 image data
        const imageData = this.canvas.toDataURL('image/jpeg', 0.8);
        
        console.log('Photo captured successfully');
        return imageData;
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        this.isActive = false;
        this.video.srcObject = null;
        
        // Update UI
        document.getElementById('startCameraBtn').textContent = 'Start Camera';
        document.getElementById('startCameraBtn').disabled = false;
        document.getElementById('captureBtn').disabled = true;
        
        console.log('Camera stopped');
    }

    isReady() {
        return this.isActive && this.stream && this.video.readyState === 4;
    }
}
