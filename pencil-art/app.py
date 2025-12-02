from flask import Flask, render_template, request, jsonify, send_file
import cv2
import numpy as np
from PIL import Image
import io
import base64
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'bmp', 'tiff', 'webp'}

# Create uploads folder if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def convert_to_sketch(img):
    """Convert image to pencil sketch"""
    gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    inverted_img = cv2.bitwise_not(gray_img)
    blurred_img = cv2.GaussianBlur(inverted_img, (21, 21), sigmaX=0, sigmaY=0)
    inverted_blur_img = cv2.bitwise_not(blurred_img)
    sketch_img = cv2.divide(gray_img, inverted_blur_img, scale=256.0)
    return sketch_img

def convert_to_colored_sketch(img):
    """Convert image to colored pencil sketch"""
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Invert the grayscale image
    inverted = cv2.bitwise_not(gray)
    
    # Apply Gaussian blur
    blurred = cv2.GaussianBlur(inverted, (21, 21), 0)
    
    # Invert the blurred image
    inverted_blurred = cv2.bitwise_not(blurred)
    
    # Create the sketch
    sketch = cv2.divide(gray, inverted_blurred, scale=256.0)
    
    # Convert sketch to 3 channels
    sketch_color = cv2.cvtColor(sketch, cv2.COLOR_GRAY2BGR)
    
    # Blend with original image for colored effect
    colored_sketch = cv2.addWeighted(img, 0.5, sketch_color, 0.5, 0)
    
    return colored_sketch

def image_to_base64(img):
    """Convert OpenCV image to base64 string"""
    _, buffer = cv2.imencode('.png', img)
    img_base64 = base64.b64encode(buffer).decode('utf-8')
    return f"data:image/png;base64,{img_base64}"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_image():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image uploaded'}), 400
        
        file = request.files['image']
        
        if file.filename == '':
            return jsonify({'error': 'No image selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Please upload an image.'}), 400
        
        # Read image
        img_bytes = file.read()
        nparr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return jsonify({'error': 'Failed to process image'}), 400
        
        # Get style from request
        style = request.form.get('style', 'classic')
        
        # Convert to sketch based on style
        if style == 'colored':
            sketch_img = convert_to_colored_sketch(img)
        else:
            sketch_img = convert_to_sketch(img)
            sketch_img = cv2.cvtColor(sketch_img, cv2.COLOR_GRAY2BGR)
        
        # Convert images to base64
        original_base64 = image_to_base64(img)
        sketch_base64 = image_to_base64(sketch_img)
        
        return jsonify({
            'original': original_base64,
            'sketch': sketch_base64,
            'success': True
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/download/<image_type>')
def download_image(image_type):
    # This would be implemented to download the sketch
    pass

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
