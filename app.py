from flask import Flask, jsonify, request
import exifread
import rawpy
import os

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def process_raw_image(file_path):
    with rawpy.imread(file_path) as raw:
        rgb = raw.postprocess()
    return rgb.tobytes()

def extract_exif_data(file_path):
    with open(file_path, 'rb') as f:
        tags = exifread.process_file(f)
        return tags

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if file:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)

        processed_image = process_raw_image(file_path)
        exif_data = extract_exif_data(file_path)

        return jsonify({'image': processed_image, 'exif': str(exif_data)})

if __name__ == '__main__':
    app.run(debug=True)
