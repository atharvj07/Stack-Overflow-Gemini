from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS  # Import CORS


# Configure the generative model
genai.configure(api_key="AIzaSyBzxEbalZYbh0hftrcwewu8owghcH8oE1c")
model = genai.GenerativeModel("gemini-1.5-flash")

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for the app, allowing requests from the specified Chrome extension origin
CORS(app, resources={r"/query": {"origins": "chrome-extension://ffpmageplhjkieeeahlfbdfegopnepkj"}})

@app.route('/query', methods=['POST'])


def generate_response():
    try:
        data = request.get_json()
        question_text = data.get('query', '')
        

        if not question_text:
            return jsonify({'error': 'Query text is missing.'}), 400

        # Generate response using Gemini API
        response = model.generate_content(question_text)
        return jsonify({'response': (response.text)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000)
