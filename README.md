## Credo 2.0 - AI-Powered Media Literacy Co-pilot

Credo is an AI-powered browser extension that acts as a personal media literacy co-pilot. It was developed as a submission for the UNESCO Global Media and Information Literacy Week Youth Hackathon 2025.

Credo analyzes online articles with a single click, providing an instant credibility report, a neutral summary, and a breakdown of potential manipulative language. It empowers users, especially young people, to think critically and navigate the digital world with confidence.

![Credo 2 0](https://github.com/user-attachments/assets/c6b4a587-4fb2-458b-a74f-429143b3e134)

# Features
1. **One-Click Analysis**: Simple and intuitive UI requires no prior experience.
2. **AI Credibility Score**: Provides a quick 1-10 measure of an article's trustworthiness.
3. **Neutral Summarization**: Instantly grasps the core message of any article.
4. **Potential Flag Detection**: Automatically identifies red flags like emotional language, generalizations, and lack of sources.
5. **Alternative Perspectives**: Uses AI to find and suggest related articles from different credible sources to combat filter bubbles.
6. **Seamless Integration**: Works as a lightweight browser extension, integrating directly into a user's browsing habits.

# Technology Stack
- **Frontend (Extension)**: Vanilla JavaScript, HTML5, CSS3
- **Backend (Server)**: Node.js, Express.js
- **AI**: Google Gemini API for natural language processing and content analysis.

# Setup and Installation
Follow these steps to run the project locally.

**Pre-requisites**
- Node.js installed (which includes npm).
- A modern web browser that supports extensions (e.g., Google Chrome).
- A Google AI API Key.

1. Clone the Repository
```bash
git clone [https://github.com/AndrewTwiz05/credo-project.git](https://github.com/AndrewTwiz05/credo-mil-hackathon)
cd credo-project
```

2. Set Up the Backend Server
- The server handles the communication with the Google Gemini API.
```bash
# Navigate to the server directory
cd server

# Install the necessary dependencies
npm install

# Create the environment file for your API key
touch .env
```
- Now, open the .env file and add your Google AI API key:
```
API_KEY="YOUR_GOOGLE_AI_API_KEY_HERE"
```
- Finally, start the server:
  This will start the server on **http://localhost:3000**
```bash
npm start
```
- Leave this terminal window running.

3. Load the Browser Extension
- Open your browser and navigate to the extensions management page (e.g., chrome://extensions).
- Enable "Developer mode".
- Click on "Load unpacked".
- Select the extension folder from this project directory.
- The Credo 2.0 icon should now appear in your browser's toolbar!

# Usage
- Navigate to any online news article or blog post.
- Click the Credo icon in your browser's toolbar.
- Click the "Analyze Page" button.
- A modal will appear with the complete credibility report.

# Hackathon Context
- This project was built for the UNESCO Global Media and Information Literacy Week Youth Hackathon 2025.
- Theme: Youth Leading the Way - Building MIL Solutions for Impact
- Challenge Track(s): AI and MIL, MIL Education, Community Impact

Credo directly addresses the challenge of misinformation by providing a practical, educational tool that empowers youth to become more discerning consumers of online information.


