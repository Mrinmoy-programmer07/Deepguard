# DeepGuard - AI-Generated Image Detection

DeepGuard is a web application that uses advanced AI to detect manipulated media, particularly AI-generated images. It helps combat misinformation by identifying deepfakes, synthetic images, and other artificially generated content.

![DeepGuard Logo](public/placeholder-logo.svg)

## Features

- **AI-Generated Image Detection**: Uses Hive AI's content moderation API to identify AI-generated or manipulated images
- **User-friendly Interface**: Modern, responsive UI with clear visual indicators of detection results
- **URL and File Upload Support**: Analyze images from URLs or by uploading files
- **Detailed Analysis Results**: Provides clear explanations of why an image is classified as real or AI-generated
- **User Authentication**: Firebase authentication for user management
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **API Integration**: Hive AI Content Moderation API
- **Authentication**: Firebase Authentication
- **Deployment**: Vercel/Firebase Hosting

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/Mrinmoy-programmer07/Fake-Image-Detection-DeepGuard.git
   cd DeepGuard
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   pnpm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-firebase-auth-domain"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-firebase-project-id"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-firebase-storage-bucket"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-firebase-messaging-sender-id"
   NEXT_PUBLIC_FIREBASE_APP_ID="your-firebase-app-id"

   # Hive AI API Key
   NEXT_PUBLIC_HIVE_API_KEY="your-hive-api-key"
   ```

4. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Navigate to the DeepGuard website
2. Scroll to the "Upload Media for Analysis" section
3. Upload an image file or enter a URL of an image
4. Click "Scan" to analyze the media
5. View the results showing whether the image is authentic or AI-generated

## Project Structure

- `/app`: Next.js app router files
- `/components`: React components including UI library
- `/contexts`: React context providers
- `/lib`: Utility functions and API integration
- `/public`: Static assets
- `/styles`: Global styles

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Contact

Mrinmoy - [GitHub Profile](https://github.com/Mrinmoy-programmer07)

Project Link: [https://github.com/Mrinmoy-programmer07/Fake-Image-Detection-DeepGuard](https://github.com/Mrinmoy-programmer07/Fake-Image-Detection-DeepGuard) 