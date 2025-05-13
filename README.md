# Task Manager (React Native App)

A feature-rich task management application built with React Native and Expo. It allows users to efficiently add, track, manage, and organize daily tasks with an intuitive interface, dark mode support, prioritization, due dates, and more. This version supports web browser access and mobile access via Expo Go (using LAN or Tunnel).

## Key Features

- **Task Management:** Add (title, description, due date, priority), mark complete/incomplete, delete tasks.
- **Organization:** Prioritize (Low, Medium, High), filter (All, Pending, Completed), sort tasks.
- **UI & UX:**
  - **Web:** Two-panel layout (Sidebar + Main Content).
  - **Mobile:** Drawer navigation for sidebar content, main content takes full screen.
  - Dark Mode, "Tasks Due Soon" alerts, statistics, smooth layout animations.
- **Input Validation:** For task titles and date formats.

## 🚀 Setup & Running

### Prerequisites

- **Node.js** (LTS version, e.g., 18.x or 20.x) & **npm** (or Yarn)
- **Web Browser** (for web version)
- **Expo Go App** (on your iOS/Android device for mobile testing)
- **Git** (optional, for cloning repository)

### Installation

1.  **Get the Code:**
    - If cloning: `git clone [Your Repository URL] && cd [Project Folder]`
    - Otherwise: Navigate to your project root directory: `cd path/to/TaskManagerApp`
2.  **Install Dependencies:**
    ```bash
    npm install
    ```

### Running the App

You have multiple ways to run the app:

**1. For Web Browser (Expo Web):**

- This will bundle the app for web and open it in your default browser.
  ```bash
  npm run web
  ```
  _(Alternatively, check `package.json` for `expo start --web` or a similar script, and run that, e.g., `npx expo start --web`)_

**2. For Mobile via Expo Go (LAN Connection - Recommended if your network allows):**

- This is the standard way to run on a physical device if your computer and phone are on the **same local Wi-Fi network** and can communicate directly.
  ```bash
  npm start
  ```
- After Metro Bundler starts, scan the QR code with the **Expo Go app** on your phone.
- _Troubleshooting LAN: Ensure your computer's firewall allows Node.js/Metro ports (e.g., 19000-19002, 8081) and your Wi-Fi network doesn't have "Client Isolation."_

**3. For Mobile via Expo Go (Tunnel Connection - Use on Restricted Networks like University Wi-Fi):**

- This routes traffic through Expo's servers, bypassing most local network restrictions. It can be slower.
  ```bash
  npm start --tunnel
  # OR
  npx expo start --tunnel
  ```
- After Metro Bundler starts, scan the **tunnel-specific QR code** with the **Expo Go app**.

## 📝 Usage Notes

- **Add Tasks:** Available on the "Dashboard" view/tab.
- **Dark Mode:** Toggle via the icon in the sidebar (web) or drawer (mobile).
- **Mobile Drawer:** Tap the Menu (☰) icon on mobile to open/close the navigation drawer. Tap the overlay or a navigation item to close it.
- **Date Format:** Use MM/DD/YYYY for due dates.

## 📦 Third-Party Libraries

- **React Native & React Native Web:** Core framework for UI and logic.
- **`lucide-react-native`** (_check `package.json` for version, e.g., `0.510.0`_): Provides icons.

---

Enjoy managing your tasks!
