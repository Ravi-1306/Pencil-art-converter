# SketchAI - Photo to Sketch Converter

A web-based application that transforms your photos into stunning pencil sketches instantly. Built with Flask and OpenCV, this tool uses advanced computer vision algorithms to convert ordinary images into artistic pencil drawings with just a few clicks.

## About the Project

This application applies sophisticated image processing techniques to simulate the effect of hand-drawn pencil sketches. The conversion process involves grayscale conversion, image inversion, Gaussian blur, and pixel blending to create realistic sketch effects. Users can choose between a classic black-and-white pencil sketch or a colored artistic version, all processed in real-time through an intuitive web interface.

## Example

![Example](assets/example.png)

## Features

- 🎨 **Classic Pencil Sketch** - Traditional black & white sketch effect
- 🌈 **Colored Sketch** - Artistic colored pencil drawing style
- ⚡ **Lightning Fast** - Process images in seconds
- 📱 **Modern Web UI** - Beautiful, responsive interface
- 🔒 **Privacy First** - Images processed locally, not stored

## Quick Start

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Application**
   ```bash
   python app.py
   ```

3. **Open in Browser**
   ```
   http://127.0.0.1:5000
   ```

## How to Use

1. Click "Choose Image" or drag & drop your photo
2. Select your preferred style (Classic or Colored)
3. Watch the magic happen!
4. Download your sketch

## Technology Stack

- **Flask** - Web framework
- **OpenCV** - Image processing
- **NumPy** - Numerical operations
- **Pillow** - Image manipulation

## Supported Formats

PNG, JPG, JPEG, BMP, TIFF, WEBP

## Requirements

- Python 3.8+
- Modern web browser
- 16MB max file size

---

**Made with ❤️ using OpenCV & Flask**
