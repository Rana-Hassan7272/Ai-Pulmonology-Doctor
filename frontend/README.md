# PulmoAI Frontend

React + TypeScript frontend for the PulmoAI Doctor Assistant system.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create `.env` file (copy from `.env.example`):
```env
VITE_API_BASE_URL=http://localhost:8000
```

3. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   ├── chat/              # Chat interface components
│   │   ├── common/            # Common/reusable components
│   │   ├── layout/           # Layout components
│   │   ├── patient/          # Patient-related components
│   │   ├── report/           # Report components
│   │   ├── tests/            # Test input/display components
│   │   ├── treatment/        # Treatment plan components
│   │   └── workflow/         # Workflow progress components
│   ├── contexts/             # React Context providers
│   ├── pages/                # Page components
│   ├── services/             # API services and types
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── public/                  # Static assets
├── package.json
└── vite.config.ts
```

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **Context API** - State management
- **Tailwind CSS** - Styling
- **React Hot Toast** - Notifications
- **React Dropzone** - File uploads

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run linter

## 🔗 Backend Integration

Make sure the backend is running on `http://localhost:8000` (or update `.env` file).

## ✨ Features

### Authentication
- User signup with automatic patient_id assignment
- User login with JWT tokens
- Protected routes
- Auto-login on page reload

### Diagnostic Workflow
- Real-time chat interface
- Patient intake with data extraction
- Patient data confirmation (HITL)
- Test upload (X-ray images)
- Test input forms (Spirometry, CBC)
- Test results display
- Treatment plan display
- Treatment approval (HITL)
- Dosage calculation display
- Final report generation
- Progress indicator

### Patient History
- View previous visits
- Visit details
- Diagnosis and treatment history

## 🎨 UI Components

- **Chat Interface**: Real-time messaging with file upload
- **Patient Confirmation**: Modal for confirming extracted data
- **Treatment Approval**: Modal for reviewing and approving treatment
- **Test Forms**: Input forms for Spirometry and CBC
- **Test Results**: Visual display of test results with confidence scores
- **Progress Indicator**: Visual workflow progress tracker
- **Final Report**: Comprehensive report with download option

## 📄 License

See main project README.
