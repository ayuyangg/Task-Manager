// React and React Native Core Imports
import React, { useState, useEffect, useCallback } from "react"; // useEffect, useCallback currently not used but good to keep if planning async operations
import {
  SafeAreaView,   // Ensures content is within device's safe display areas
  View,             // Basic container component
  Text,             // For displaying text
  TextInput,        // For user text input
  TouchableOpacity, // A View that responds to touches with an opacity change
  StyleSheet,       // For creating optimized style objects
  ScrollView,       // A generic scrollable container
  FlatList,         // For rendering scrollable lists of data efficiently
  Dimensions,       // For getting screen/window dimensions for responsive design
  Appearance,       // Can be used to detect system color scheme (light/dark mode) - not directly used for theme switching here
  Platform,         // For platform-specific code (iOS, Android, Web)
  UIManager,        // Provides access to native UI manager (used here for LayoutAnimation)
  LayoutAnimation,  // For simple animated transitions on layout changes
} from "react-native";

// Third-Party Library Imports
import { // Icons from lucide-react-native library
  Trash2,
  CheckCircle,
  Circle,
  Calendar,
  AlertTriangle,
  BarChart2,
  Clock,
  List,
  CheckSquare,
  Moon,
  Sun,
  Menu as MenuIcon, // Hamburger menu icon
  X as XIcon        // Close (X) icon
} from "lucide-react-native";

// --- Platform Specific Setup ---
// Enable experimental LayoutAnimation for Android for smoother UI transitions.
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Application Color Theme Definitions ---
// Defines color palettes for light and dark modes.
// Semantic keys are used to allow easy theme switching throughout the application.
const AppColors = {
  light: {
    // Base Colors
    background: "#F9FAFB", // Overall app background color
    text: "#1F2937",       // Default text color
    card: "#FFFFFF",       // Background for card-like elements (sidebar, form, items)
    border: "#E5E7EB",     // Default border color
    // Accent & Interaction Colors
    primary: "#6D28D9",    // Main accent color for buttons, progress bars, etc.
    primaryLight: "#EDE9FE",// Lighter shade of primary
    primaryText: "#5B21B6", // Text color for use on primaryLight backgrounds
    icon: "#4B5563",       // Default color for icons
    mutedText: "#6B7280",  // For less important text, placeholders
    error: "#DC2626",      // For error messages and indicators
    buttonText: "#FFFFFF", // Text color for primary action buttons
    completedIcon: "#16A34A", // Specific green for completed task checkmarks
    // Priority Specific Colors (used for badges and visual cues)
    lowBg: "#D1FAE5",       // Background for 'Low' priority
    textLow: "#065F46",     // Text/accent color for 'Low' priority
    borderLow: "#A7F3D0",   // Border for 'Low' priority
    mediumBg: "#FFF7ED",    // Background for 'Medium' priority
    textMedium: "#D97706",  // Text/accent color for 'Medium' priority
    borderMedium: "#FED7AA",// Border for 'Medium' priority
    highBg: "#FEE2E2",      // Background for 'High' priority
    textHigh: "#B91C1C",    // Text/accent color for 'High' priority
    borderHigh: "#FECACA",  // Border for 'High' priority
    // Contextual Colors
    countBadgeGreenBg: "#D1FAE5",  // Background for 'completed' count badge in sidebar
    countBadgeGreenText: "#065F46",// Text for 'completed' count badge
    dueSoonCardBg: "#FFF3E0",     // Background for "Tasks Due Soon" card
    dueSoonText: "#C2410C",       // Text/accent color for "Tasks Due Soon"
    dueSoonBorder: "#FFE0B2",    // Border for "Tasks Due Soon" card
    yellow300: '#FDE047',         // Used for the Sun icon (theme toggle)
    // Semantic Mappings for Stylesheet (ensures consistent application of theme)
    sidebarBackground: "#FFFFFF",          // Sidebar background (uses card color)
    sidebarBorder: "#E5E7EB",            // Sidebar border (uses default border)
    headerBackground: "#F9FAFB",          // Main content header background (matches app background)
    headerBorder: "#E5E7EB",             // Main content header border
    activeTabBackground: "#EDE9FE",      // Background for active navigation tab (uses primaryLight)
    navItemTextColor: "#374151",         // Text color for inactive navigation items (gray-700 equivalent)
    activeNavItemTextColor: "#5B21B6",   // Text color for active navigation items (uses primaryText)
    inputBackground: "#FFFFFF",           // Background for TextInput fields (uses card color)
    inputBorder: "#D1D4DB",              // Border for TextInput fields (gray-300 equivalent)
    unselectedPriorityButtonBackground: "#FFFFFF", // Background for unselected priority buttons
    unselectedPriorityButtonBorder: "#D1D4DB",   // Border for unselected priority buttons
    darkModeToggleBackground: "#E5E7EB",       // Background for dark mode toggle button (gray-200 equivalent)
    progressBarContainerBackground: "#E5E7EB", // Background of the progress bar container
    formContainerBackground: "#FFFFFF",        // Background for the task input form (uses card color)
    taskListItemBackground: "#FFFFFF",       // Default background for task items (uses card color)
  },
  dark: { // Dark mode color definitions, mirroring the light mode structure
    background: "#111827", 
    text: "#F3F4F6", 
    card: "#1F2937", 
    border: "#374151", 
    primary: "#8B5CF6", 
    primaryLight: "#4C1D95", 
    primaryText: "#DDD6FE", 
    icon: "#9CA3AF", 
    mutedText: "#9CA3AF", 
    error: "#F87171", 
    buttonText: "#FFFFFF",
    completedIcon: "#22C55E", 
    lowBg: "#064E3B",    
    textLow: "#6EE7B7",  
    borderLow: "#052e16", 
    mediumBg: "#7C2D12", 
    textMedium: "#FDBA74", 
    borderMedium: "#9A3412",
    highBg: "#7F1D1D", 
    textHigh: "#F87171", 
    borderHigh: "#991B1B", 
    countBadgeGreenBg: "#064E3B", 
    countBadgeGreenText: "#6EE7B7",
    dueSoonCardBg: "#65280D", 
    dueSoonText: "#FDBA74",
    dueSoonBorder: "#7C2D12",
    yellow300: '#FDE047',
    sidebarBackground: "#111827",       // Sidebar uses main background color for a more integrated dark feel
    sidebarBorder: "#374151",
    headerBackground: "#111827",          // Main content header also uses main background
    headerBorder: "#374151",
    activeTabBackground: "#4C1D95",
    navItemTextColor: "#D1D4DB",
    activeNavItemTextColor: "#DDD6FE",
    inputBackground: "#1F2937",          // Inputs use card color
    inputBorder: "#374151",
    unselectedPriorityButtonBackground: "#1F2937",
    unselectedPriorityButtonBorder: "#374151",
    darkModeToggleBackground: "#1F2937",
    progressBarContainerBackground: "#374151", // Darker background for progress bar container
    formContainerBackground: "#1F2937",      // Form container uses card color
    taskListItemBackground: "#1F2937",     // Task items use card color
  },
};

// --- Main Application Component ---
export default function TaskManager() {
  // --- State Variables ---
  const [tasks, setTasks] = useState([]); // Array to store all task objects
  const [newTask, setNewTask] = useState({ title: "", description: "", date: "", priority: "Low" }); // Object for form inputs when creating a new task
  const [activeTab, setActiveTab] = useState("dashboard"); // Currently active navigation tab (e.g., "dashboard")
  const [dateError, setDateError] = useState(""); // Error message for date input validation
  const [titleError, setTitleError] = useState(""); // Error message for title input validation
  const [darkMode, setDarkMode] = useState(false); // Boolean state for toggling dark/light theme
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Boolean state for managing mobile drawer visibility

  // --- Derived Values (Theme & Responsive Calculations) ---
  const theme = darkMode ? AppColors.dark : AppColors.light; // Current theme object based on darkMode state
  const colorMode = darkMode ? "dark" : "light"; // String representation ('dark'/'light') for functions needing this format
  const windowWidth = Dimensions.get('window').width; // Get current window width for responsiveness
  const WEB_SIDEBAR_WIDTH = 280; // Standard width for the sidebar on web/larger screens
  const MOBILE_DRAWER_WIDTH = windowWidth * 0.8; // Mobile drawer takes 80% of screen width
  // Determines if the layout should be mobile-optimized (drawer) or web-optimized (fixed sidebar)
  const isMobile = Platform.OS !== 'web' || windowWidth < 768; // True if on native mobile OR if web window width is below 768px

  // --- Core Logic & Helper Functions ---

  /**
   * Returns styling object {backgroundColor, color, borderColor} for a given priority.
   * @param {string} priority - The priority level ("Low", "Medium", "High").
   * @param {string} mode - The current color mode ("light" or "dark").
   */
  const priorityStyleLookup = (priority, mode) => { 
    const pColors = AppColors[mode];
    switch (priority) {
      case "Low": return { backgroundColor: pColors.lowBg, color: pColors.textLow, borderColor: pColors.borderLow };
      case "Medium": return { backgroundColor: pColors.mediumBg, color: pColors.textMedium, borderColor: pColors.borderMedium };
      case "High": return { backgroundColor: pColors.highBg, color: pColors.textHigh, borderColor: pColors.borderHigh };
      default: return { backgroundColor: pColors.lowBg, color: pColors.textLow, borderColor: pColors.borderLow }; // Default to Low style
    }
  };

  /**
   * Adds a new task to the `tasks` state after validation.
   * Resets the form and clears errors upon successful addition.
   */
  const addTask = () => { 
    if (newTask.title.trim() === "") { setTitleError("Title is required"); return; }
    if (newTask.date && !isValidDate(newTask.date)) { setDateError("Please enter a valid date in MM/DD/YYYY format"); return; }
    const task = { id: Date.now().toString(), ...newTask, priority: newTask.priority || "Low", completed: false, createdAt: new Date() };
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Animate the list update
    setTasks(prev => [task, ...prev]); // Add new task to the beginning of the list
    setNewTask({ title: "", description: "", date: "", priority: "Low" }); // Reset form
    setTitleError(""); setDateError(""); // Clear errors
  };

  /**
   * Validates a date string for MM/DD/YYYY format and realistic date values.
   * @param {string} dateStr - The date string to validate.
   * @returns {boolean} True if valid or empty, false otherwise.
   */
  const isValidDate = (dateStr) => { 
    if (!dateStr) return true; // Optional field
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (!regex.test(dateStr)) return false;
    const [month, day, year] = dateStr.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    return date.getMonth() === month - 1 && date.getDate() === day && date.getFullYear() === year;
  };

  /**
   * Formats text input into MM/DD/YYYY as the user types.
   * @param {string} value - The raw input string.
   * @returns {string} The formatted date string.
   */
  const formatDateInput = (value) => { 
    const digits = value.replace(/\D/g, "").substring(0, 8);
    let formatted = "";
    if (digits.length > 0) {formatted += digits.substring(0, 2); if (digits.length > 2) {formatted += "/" + digits.substring(2, 4); if (digits.length > 4) {formatted += "/" + digits.substring(4, 8);}}}
    return formatted;
  };

  /**
   * Toggles the 'completed' status of a task identified by its ID.
   * @param {string} id - The ID of the task to update.
   */
  const toggleTaskCompletion = (id) => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task)); };

  /**
   * Deletes a task identified by its ID from the list.
   * @param {string} id - The ID of the task to delete.
   */
  const deleteTask = (id) => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setTasks(tasks.filter(task => task.id !== id)); };

  // Filters tasks based on the currently active tab
  const filteredTasks = tasks.filter(task => { if (activeTab === "pending") return !task.completed; if (activeTab === "completed") return task.completed; return true; });

  // Calculates various statistics based on the current task list
  const stats = { 
    total: tasks.length, completed: tasks.filter(task => task.completed).length, pending: tasks.filter(task => !task.completed).length,
    low: tasks.filter(task => task.priority === "Low").length, medium: tasks.filter(task => task.priority === "Medium").length, high: tasks.filter(task => task.priority === "High").length,
    completionRate: tasks.length > 0 ? Math.round((stats.completed / tasks.length) * 100) : 0 // Use calculated stats.completed for efficiency
  };

  /**
   * Retrieves tasks that are due within the next 3 days and are not yet completed.
   * Normalizes dates to avoid time-of-day issues in comparison.
   * @returns {Array} An array of due soon task objects.
   */
  const getDueSoonTasks = () => { 
    const today = new Date(); today.setHours(0,0,0,0); // Start of today
    const threeDaysLater = new Date(); threeDaysLater.setDate(today.getDate() + 3); threeDaysLater.setHours(23,59,59,999); // End of 3 days from now
    return tasks.filter(task => {
      if (!task.date || task.completed) return false;
      const [month, day, year] = task.date.split("/").map(Number);
      const taskDate = new Date(year, month - 1, day); taskDate.setHours(0,0,0,0); // Normalize task date
      return taskDate >= today && taskDate <= threeDaysLater;
    });
  };
  const dueSoonTasks = getDueSoonTasks(); // Get the list of due soon tasks

  // Sorts the filtered tasks for display using a multi-level sorting logic
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // 1. Incomplete tasks first
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    // 2. By priority (High, Medium, Low)
    const priorityOrder = { "High": 0, "Medium": 1, "Low": 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) { return priorityOrder[a.priority] - priorityOrder[b.priority]; }
    // 3. By due date (earlier dates first)
    if (a.date && b.date) {
      // Parsing MM/DD/YYYY for correct Date object comparison
      const dateA = new Date(a.date.split("/")[2], parseInt(a.date.split("/")[0],10)-1, a.date.split("/")[1]);
      const dateB = new Date(b.date.split("/")[2], parseInt(b.date.split("/")[0],10)-1, b.date.split("/")[1]);
      if (dateA.getTime() !== dateB.getTime()) return dateA - dateB;
    } else if (a.date) { return -1; } // Tasks with dates come before those without
    else if (b.date) { return 1;}   // Tasks without dates come after those with
    // 4. By creation date (newest first if all other criteria are equal)
    return b.createdAt - a.createdAt; 
  });

  /**
   * Toggles the dark mode theme on/off.
   */
  const toggleDarkMode = () => setDarkMode(!darkMode);

  /**
   * Toggles the mobile drawer open/closed, only if `isMobile` is true.
   * Uses LayoutAnimation for a simple transition effect.
   */
  const toggleDrawer = () => {
    if (isMobile) { 
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsDrawerOpen(!isDrawerOpen);
    }
  };

  // --- Stylesheet Definition ---
  // Styles are defined inside the component to access `theme`, `isMobile`, `isDrawerOpen`, and `windowWidth`.
  const styles = StyleSheet.create({
    // Base screen container, fills the entire screen and applies themed background
    screenContainer: { flex: 1, backgroundColor: theme.background },
    // Main flex row for sidebar/main content layout, ensures it fills vertical space
    flexRow: { flexDirection: "row", flex: 1 },
    
    // Hamburger menu button for toggling the drawer on mobile
    menuButton: { 
      ...(isMobile && { // Styles apply only if `isMobile` is true
        position: 'absolute', // Positioned absolutely to float over content
        top: Platform.OS === 'ios' ? 50 : 20, // Account for status bar height
        left: 15,
        zIndex: 1010, // High zIndex to ensure it's on top of overlay and drawer
        padding: 8,   // Make it easier to tap
      })
    },
    // Sidebar (or Drawer on mobile) styles
    sidebar: {
      // Common styles for both web sidebar and mobile drawer
      paddingHorizontal: 8, 
      paddingVertical: 16,
      backgroundColor: theme.sidebarBackground,
      borderColor: theme.sidebarBorder,

      // Web-specific fixed layout styles (when not in mobile mode)
      ...(!isMobile && {
        width: WEB_SIDEBAR_WIDTH, // Fixed width
        borderRightWidth: 1,      // Visible right border
        flexGrow: 0,              // Does not grow to fill extra space
        flexShrink: 0,            // Does not shrink if space is limited
      }),

      // Mobile-specific drawer styles (when in mobile mode)
      ...(isMobile && {
        position: 'absolute',     // Positioned absolutely to overlay content
        top: 0,
        bottom: 0,
        left: isDrawerOpen ? 0 : -MOBILE_DRAWER_WIDTH, // Slides in from left based on `isDrawerOpen`
        width: MOBILE_DRAWER_WIDTH,                   // Takes up a percentage of screen width
        height: '100%',                               // Full screen height
        zIndex: 1000,                                 // Sits on top of most other content
        borderRightWidth: isDrawerOpen ? 1 : 0,       // Border only visible when drawer is open
        // Shadow for a subtle elevation effect (more noticeable on iOS)
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: isDrawerOpen ? 0.25 : 0, // Shadow only when open
        shadowRadius: 3.84,
        elevation: isDrawerOpen ? 5 : 0,        // Android elevation
      })
    },
    // Main content area styles
    mainContent: {
      flex: 1, // Takes up remaining space next to sidebar (on web) or full width (on mobile)
      backgroundColor: theme.background,
    },
    // Overlay for dismissing the mobile drawer when tapped
    overlay: { 
      ...(isMobile && isDrawerOpen && { // Styles apply only if mobile and drawer is open
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent black
        zIndex: 999, // Sits below the drawer but above main content
      })
    },
    // Header within the sidebar/drawer
    sidebarHeader: { 
      flexDirection: "row", 
      justifyContent: isMobile ? "center" : "space-between", // Title centered on mobile, space-between on web
      alignItems: "center", 
      marginBottom: 24, 
      paddingHorizontal: 8,
      marginTop: isMobile ? (Platform.OS === 'ios' ? 25 : 10) : 0, // Top margin for drawer title to clear status bar/menu icon
    },
    // Invisible placeholder view used on mobile to help center title in sidebarHeader if Menu/X icon was inline
    menuButtonPlaceholder: {
        display: isMobile ? 'flex' : 'none', // Only for mobile layout
        width: 40, // Arbitrary width to balance an icon on the other side
    },
    // Title text within the sidebar ("Task Manager")
    sidebarTitle: { 
        fontSize: ((isMobile && isDrawerOpen) || !isMobile) ? 18 : 16, // Font size adapts if drawer is open or on web
        fontWeight: "bold", 
        color: theme.text,
        textAlign: isMobile ? 'center' : 'left', // Centered text for mobile drawer header
    },
    // Dark mode toggle button (typically shown on web sidebar header)
    darkModeToggle: { 
        padding: 8, 
        borderRadius: 999, 
        backgroundColor: theme.darkModeToggleBackground,
        display: isMobile ? 'none' : 'flex', // Hidden in mobile sidebar header (moved to drawer items)
    },
    // Dark mode toggle button style if placed inside the mobile drawer items
    darkModeToggleInDrawer: { 
        display: isMobile ? 'flex' : 'none', // Only shown on mobile
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, marginBottom: 4,
    },
    // Individual navigation item (Dashboard, Pending, Completed)
    navItem: { flexDirection: "row", alignItems: "center", width: "100%", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, marginBottom: 4, },
    navItemActive: { backgroundColor: theme.activeTabBackground }, // Style for the active navigation item
    navItemText: { color: theme.navItemTextColor, marginLeft: ((isMobile && isDrawerOpen) || !isMobile) ? 10 : 8, fontSize: ((isMobile && isDrawerOpen) || !isMobile) ? 14 : 13, },
    navItemTextActive: { color: theme.activeNavItemTextColor, fontWeight: "500" }, // Text style for active navigation item
    badge: { marginLeft: "auto", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, fontSize: 12, backgroundColor: theme.primaryLight, color: theme.primaryText, overflow: 'hidden'},
    badgeCompleted: { backgroundColor: theme.countBadgeGreenBg, color: theme.countBadgeGreenText }, // Specific style for 'completed' count badge
    
    // Container for statistics section in sidebar
    statsContainer: { 
      display: (isMobile && !isDrawerOpen) ? 'none' : 'flex', // Hidden on mobile if drawer is closed
      marginTop: 24, paddingTop: 16, borderTopWidth: 1, 
      borderColor: theme.border, paddingHorizontal: 8 
    },
    statsTitle: { fontSize: 11, fontWeight: "500", color: theme.mutedText, marginBottom: 12, textTransform: 'uppercase'},
    statCard: { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
    statRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
    statLabel: { fontSize: 13, color: theme.mutedText },
    statValue: { fontSize: 13, fontWeight: "500", color: theme.text },
    progressBarContainer: { width: "100%", backgroundColor: theme.progressBarContainerBackground, borderRadius: 999, height: 8 },
    progressBar: { backgroundColor: theme.primary, height: 8, borderRadius: 999 },
    statGrid: { flexDirection: "row", justifyContent: "space-between", gap: 8 }, 
    statGridItem: { flex: 1, backgroundColor: theme.card, borderWidth:1, borderColor: theme.border, borderRadius: 8, padding: 10 },
    statGridLabel: { fontSize: 11, color: theme.mutedText, marginBottom: 2 },
    statGridValue: { fontSize: 20, fontWeight: "600", color: theme.text }, 
    priorityBreakdownTitle: { fontSize: 11, color: theme.mutedText, marginBottom: 8, textTransform: 'uppercase', fontWeight: '500'},
    priorityBreakdown: { flexDirection: "row", justifyContent: "space-around", alignItems: "center" },
    priorityItem: { flexDirection: "row", alignItems: "center", gap: 4 },
    priorityDot: { width: 10, height: 10, borderRadius: 5, borderWidth: 1 }, // Background color set dynamically
    priorityItemText: { color: theme.text, fontSize: 11 },
    
    // Header for the main content area (shows current view title e.g., "All Tasks")
    header: { 
      backgroundColor: theme.headerBackground, 
      borderBottomWidth: 1, 
      borderColor: theme.headerBorder, 
      paddingHorizontal: isMobile ? 50 : 20, // Increased padding on mobile to not overlap absolute menu button
      paddingVertical: 16,
      flexDirection: 'row', 
      alignItems: 'center',
      justifyContent: isMobile ? 'center' : 'flex-start', // Title centered on mobile
    },
    headerTitle: { 
        fontSize: 20, 
        fontWeight: "600", 
        color: theme.text,
    },
    // Invisible placeholder, not strictly needed if menu button is absolutely positioned globally
    headerMenuPlaceholder: { /* display: isMobile ? 'flex' : 'none', width: 40, */ },

    contentAreaScrollView: { padding: 20 }, // Padding for ScrollView variant of main content area
    contentAreaFlatList: { padding: 20 },   // Padding for FlatList variant of main content area (used by main FlatList)
    formContainer: { backgroundColor: theme.formContainerBackground, borderColor: theme.border, borderWidth:1, borderRadius: 8, padding: 20, marginBottom: 20 },
    formTitle: { fontSize: 18, fontWeight: "500", color: theme.text, marginBottom: 16 },
    formGroup: { marginBottom: 16 }, // Group for label + input
    label: { fontSize: 14, fontWeight: "500", color: theme.mutedText, marginBottom: 6 },
    input: { width: "100%", paddingHorizontal: 12, paddingVertical: Platform.OS === 'ios' ? 12 : 10, borderWidth: 1, borderRadius: 6, backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text, fontSize: 14},
    inputError: { borderColor: theme.error }, // Style for input validation error
    textArea: { minHeight: 60, textAlignVertical: "top" }, // For description input
    errorText: { marginTop: 4, fontSize: 12, color: theme.error },
    formRow: { flexDirection: "row", justifyContent: "space-between", gap: 16 }, // For date and priority side-by-side
    formRowItem: { flex: 1 },
    priorityButtonsContainer: { flexDirection: "row", gap: 8 }, 
    priorityButton: { flex: 1, paddingVertical: 10, paddingHorizontal: 6, borderRadius: 6, borderWidth: 1, alignItems: 'center'},
    priorityButtonText: { fontSize: 14, fontWeight: "500" }, // Color set dynamically
    addTaskButton: { backgroundColor: theme.primary, width: "100%", paddingVertical: 12, borderRadius: 6, alignItems: "center", marginTop: 8 },
    addTaskButtonText: { color: theme.buttonText, fontSize: 14, fontWeight: "500" },
    // "Tasks Due Soon" section styles
    dueSoonSection: { marginBottom: 20 },
    dueSoonHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
    dueSoonTitle: { fontSize: 14, fontWeight: "500", color: theme.dueSoonText, marginLeft: 8 },
    dueSoonCard: { backgroundColor: theme.dueSoonCardBg, borderColor: theme.dueSoonBorder, borderWidth: 1, borderRadius: 8, overflow: "hidden" },
    // Individual task item in a list
    taskItemContainer: { flexDirection: "row", alignItems: "flex-start", padding: 16, borderBottomWidth: 1}, // BorderColor set dynamically
    taskItemContent: { flex: 1, minWidth: 0, marginLeft: 12 }, // Content (title, desc, meta) of the task
    taskTitle: { fontSize: 14, fontWeight: "500", color: theme.text },
    taskTitleCompleted: { textDecorationLine: "line-through", color: theme.mutedText },
    taskDescription: { marginTop: 4, fontSize: 12, color: theme.mutedText },
    taskDescriptionCompleted: { color: theme.mutedText },
    taskMeta: { marginTop: 8, flexDirection: "row", flexWrap: 'wrap', alignItems: "center", gap: 6 }, // For date and priority badge
    taskMetaTextContainer: { flexDirection: 'row', alignItems: 'center', gap: 4}, // Wraps icon and text (e.g. Calendar icon + date)
    taskMetaText: { fontSize: 12, color: theme.mutedText },
    priorityBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1}, // Colors set dynamically
    priorityBadgeText: {fontSize: 11, fontWeight: "500"}, // Color set dynamically
    taskActions: { marginLeft: 8, paddingTop:2 }, // For delete icon
    // Styles for when a list is empty
    emptyStateContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 48 },
    emptyStateIcon: { marginBottom: 12, color: theme.mutedText }, 
    emptyStateText: { marginTop: 8, fontSize: 14, fontWeight: "500", color: theme.text },
    emptyStateSubText: { marginTop: 4, fontSize: 14, color: theme.mutedText, textAlign: 'center', paddingHorizontal: 20 },
    emptyStateButton: { marginTop: 24, backgroundColor: theme.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 6},
    emptyStateButtonText: { color: theme.buttonText, fontSize: 14, fontWeight: "500" },
  });

  // --- Component for Rendering Individual Task Items ---
  /**
   * Renders a single task item, adapting its style if it's a "due soon" task.
   * @param {object} props - The properties for the task item.
   * @param {object} props.item - The task data object.
   * @param {boolean} [props.isDueSoon=false] - True if the task is in the "due soon" list.
   */
  const renderTaskItem = ({ item: task, isDueSoon = false }) => { 
    const priorityStyles = priorityStyleLookup(task.priority, colorMode); // Get {bgColor, textColor, borderColor} for priority
    const isCompleted = task.completed;

    // Determine colors based on context (due soon, completed, normal)
    const itemBorderColor = isDueSoon ? theme.dueSoonBorder : theme.border;              
    const itemIconColorUncompleted = isDueSoon ? theme.dueSoonText : theme.mutedText;         
    const titleTextColor = (isDueSoon && !isCompleted) ? theme.dueSoonText : (isCompleted ? theme.mutedText : theme.text);
    const descriptionTextColor = (isDueSoon && !isCompleted) ? (darkMode ? theme.dueSoonText : theme.mutedText ) : theme.mutedText;
    const metaIconAndTextColor = (isDueSoon && !isCompleted) ? theme.dueSoonText : theme.mutedText;
    // Determine background for the task item container
    let itemContainerBackground = isDueSoon ? theme.dueSoonCardBg : theme.taskListItemBackground;
    if (isCompleted) { // Completed tasks have a specific background variant
        itemContainerBackground = darkMode ? theme.card : theme.background; // Uses card (dark) or main bg (light)
    }


    return (
      // Main container for a single task item
      <View style={[styles.taskItemContainer, { borderColor: itemBorderColor, backgroundColor: itemContainerBackground }]}>
        {/* Touchable area for toggling completion status */}
        <TouchableOpacity onPress={() => toggleTaskCompletion(task.id)} style={{ marginTop: 2 }}>
          {isCompleted ? <CheckCircle size={20} color={theme.completedIcon} /> : <Circle size={20} color={itemIconColorUncompleted} />}
        </TouchableOpacity>
        {/* Content of the task: title, description, meta */}
        <View style={styles.taskItemContent}>
          <Text style={[styles.taskTitle, isCompleted && styles.taskTitleCompleted, {color: titleTextColor} ]}>{task.title}</Text>
          {task.description && (<Text style={[styles.taskDescription, isCompleted && styles.taskDescriptionCompleted, {color: descriptionTextColor}]}>{task.description}</Text>)}
          {/* Meta information (date, priority) */}
          <View style={styles.taskMeta}>
            {task.date && (
            <>
                <View style={styles.taskMetaTextContainer}><Calendar size={12} color={metaIconAndTextColor} /><Text style={[styles.taskMetaText, {color: metaIconAndTextColor}]}>{task.date}</Text></View>
                <Text style={[styles.taskMetaText, {marginHorizontal: 4, color: metaIconAndTextColor}]}>•</Text>
            </>)}
            <View style={[styles.priorityBadge, { backgroundColor: priorityStyles.backgroundColor, borderColor: priorityStyles.borderColor }]}><Text style={[styles.priorityBadgeText, { color: priorityStyles.color }]}>{task.priority}</Text></View>
          </View>
        </View>
        {/* Delete button for the task */}
        <TouchableOpacity onPress={() => deleteTask(task.id)} style={styles.taskActions}><Trash2 size={16} color={theme.mutedText} /></TouchableOpacity>
      </View>
    );
  };

  // --- Main JSX Structure of the Application ---
  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* Hamburger/Close Menu Button - Displayed only on mobile, toggles the drawer */}
      {isMobile && (
        <TouchableOpacity style={styles.menuButton} onPress={toggleDrawer}>
          {isDrawerOpen ? <XIcon color={theme.icon} size={28} /> : <MenuIcon color={theme.icon} size={28} />}
        </TouchableOpacity>
      )}

      {/* Main layout row: contains Sidebar/Drawer and Main Content */}
      <View style={styles.flexRow}>
        
        {/* Sidebar (Web) / Drawer (Mobile) */}
        {/* This ScrollView is always in the JSX tree. Its style (width, left, position) determines its appearance. */}
        <ScrollView 
            style={styles.sidebar} 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={{paddingBottom: 20}} // Prevents last item from being cut off
        >
            {/* Header section of the Sidebar/Drawer */}
            <View style={styles.sidebarHeader}>
                {/* Placeholder to help center title when menu button might affect layout (only on mobile) */}
                {isMobile && <View style={styles.menuButtonPlaceholder} /> } 
                <Text style={styles.sidebarTitle}>Task Manager</Text>
                {/* Dark mode toggle: shown on web, moved to drawer items for mobile */}
                {!isMobile && (
                     <TouchableOpacity onPress={toggleDarkMode} style={styles.darkModeToggle}>
                        {darkMode ? <Sun size={18} color={theme.yellow300} /> : <Moon size={18} color={theme.icon} />} 
                    </TouchableOpacity>
                )}
                {/* Another placeholder for true centering with an opposite-side element */}
                {isMobile && <View style={styles.menuButtonPlaceholder} /> }
            </View>
            
            {/* Navigation Items Wrapper */}
            <View> 
                <TouchableOpacity onPress={() => { setActiveTab("dashboard"); if (isMobile) toggleDrawer(); }} style={[styles.navItem, activeTab === "dashboard" && styles.navItemActive]}>
                    <BarChart2 size={18} color={activeTab === "dashboard" ? theme.activeNavItemTextColor : theme.navItemTextColor} />
                    <Text style={[styles.navItemText, activeTab === "dashboard" && styles.navItemTextActive]}>Dashboard</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setActiveTab("pending"); if (isMobile) toggleDrawer(); }} style={[styles.navItem, activeTab === "pending" && styles.navItemActive]}>
                    <Clock size={18} color={activeTab === "pending" ? theme.activeNavItemTextColor : theme.navItemTextColor} />
                    <Text style={[styles.navItemText, activeTab === "pending" && styles.navItemTextActive]}>Pending</Text>
                    {stats.pending > 0 && (<Text style={styles.badge}>{stats.pending}</Text>)}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setActiveTab("completed"); if (isMobile) toggleDrawer(); }} style={[styles.navItem, activeTab === "completed" && styles.navItemActive]}>
                    <CheckSquare size={18} color={activeTab === "completed" ? theme.activeNavItemTextColor : theme.navItemTextColor} />
                    <Text style={[styles.navItemText, activeTab === "completed" && styles.navItemTextActive]}>Completed</Text>
                    {stats.completed > 0 && (<Text style={[styles.badge, styles.badgeCompleted]}>{stats.completed}</Text>)}
                </TouchableOpacity>
                 {/* Dark mode toggle rendered as a nav-like item within the mobile drawer */}
                 {isMobile && (
                    <TouchableOpacity onPress={() => { toggleDarkMode(); /* if (isMobile) toggleDrawer(); */ }} style={styles.darkModeToggleInDrawer}>
                        <Text style={[styles.navItemText, {color: theme.text, marginLeft: 0 /* Reset margin if no icon */ }]}>{darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}</Text>
                        {darkMode ? <Sun size={18} color={theme.yellow300} /> : <Moon size={18} color={theme.icon} />}
                    </TouchableOpacity>
                 )}
            </View>
            {/* Statistics Container - Conditionally displayed on mobile if drawer is open */}
            <View style={styles.statsContainer}>
                <Text style={styles.statsTitle}>Statistics</Text>
                {/* Completion Rate */}
                <View style={styles.statCard}>
                    <View style={styles.statRow}><Text style={styles.statLabel}>Completion</Text><Text style={styles.statValue}>{stats.completionRate}%</Text></View>
                    <View style={styles.progressBarContainer}><View style={[styles.progressBar, { width: `${stats.completionRate}%` }]} /></View>
                </View>
                {/* Total/Pending Counts */}
                <View style={styles.statGrid}>
                    <View style={styles.statGridItem}><Text style={styles.statGridLabel}>Total</Text><Text style={styles.statGridValue}>{stats.total}</Text></View>
                    <View style={styles.statGridItem}><Text style={styles.statGridLabel}>Pending</Text><Text style={styles.statGridValue}>{stats.pending}</Text></View>
                </View>
                {/* Priority Breakdown */}
                <View style={[styles.statCard, {marginTop:12}]}> 
                    <Text style={styles.priorityBreakdownTitle}>Priorities</Text>
                    <View style={styles.priorityBreakdown}>
                        <View style={styles.priorityItem}><View style={[ styles.priorityDot, { backgroundColor: theme.textLow, borderColor: theme.borderLow } ]} /><Text style={styles.priorityItemText}>Low: {stats.low}</Text></View>
                        <View style={styles.priorityItem}><View style={[ styles.priorityDot, { backgroundColor: theme.textMedium, borderColor: theme.borderMedium } ]} /><Text style={styles.priorityItemText}>Med: {stats.medium}</Text></View>
                        <View style={styles.priorityItem}><View style={[ styles.priorityDot, { backgroundColor: theme.textHigh, borderColor: theme.borderHigh } ]} /><Text style={styles.priorityItemText}>High: {stats.high}</Text></View>
                    </View>
                </View>
            </View>
        </ScrollView>
        
        {/* Main Content Area */}
        <View style={styles.mainContent}>
          {/* Header of the Main Content area (displays current view title e.g., "All Tasks") */}
          <View style={styles.header}>
              {/* Placeholder for mobile layout, balances centered title against menu button (which is absolute) */}
              {isMobile && <View style={styles.headerMenuPlaceholder} />} 
              <Text style={styles.headerTitle}>
                {activeTab === "dashboard" ? "All Tasks" : activeTab === "pending" ? "Pending Tasks" : "Completed Tasks"}
              </Text>
              {/* Another placeholder for perfect centering */}
              {isMobile && <View style={styles.headerMenuPlaceholder} />}
          </View>
          {/* Main list of tasks, uses FlatList for efficient scrolling */}
          <FlatList
            // Header component of the FlatList (renders Form and Due Soon tasks)
            ListHeaderComponent={<>
                {/* "Add New Task" Form (only visible on Dashboard tab) */}
                {activeTab === "dashboard" && (
                  <View style={styles.formContainer}>
                    <Text style={styles.formTitle}>Add New Task</Text>
                    {/* Title Input */}
                    <View style={styles.formGroup}><Text style={styles.label}>Title *</Text><TextInput style={[styles.input, titleError && styles.inputError]} value={newTask.title} onChangeText={(text) => { setNewTask({...newTask, title: text}); if (text.trim()) setTitleError(""); }} placeholder="What needs to be done?" placeholderTextColor={theme.mutedText} />{titleError && <Text style={styles.errorText}>{titleError}</Text>}</View>
                    {/* Description Input */}
                    <View style={styles.formGroup}><Text style={styles.label}>Description</Text><TextInput style={[styles.input, styles.textArea]} value={newTask.description} onChangeText={(text) => setNewTask({...newTask, description: text})} placeholder="Add details..." placeholderTextColor={theme.mutedText} multiline /></View>
                    {/* Due Date and Priority Inputs Row */}
                    <View style={styles.formRow}>
                        <View style={[styles.formGroup, styles.formRowItem]}><Text style={styles.label}>Due Date</Text><TextInput style={[styles.input, dateError && styles.inputError]} value={newTask.date} onChangeText={(text) => { const formatted = formatDateInput(text); setNewTask({...newTask, date: formatted}); if (isValidDate(formatted) || formatted === "") setDateError(""); }} placeholder="MM/DD/YYYY" placeholderTextColor={theme.mutedText} keyboardType="numeric" />{dateError && <Text style={styles.errorText}>{dateError}</Text>}</View>
                        <View style={[styles.formGroup, styles.formRowItem]}><Text style={styles.label}>Priority</Text><View style={styles.priorityButtonsContainer}>
                          {["Low", "Medium", "High"].map((priority) => {
                            const priorityBtnStyle = priorityStyleLookup(priority, colorMode); 
                            const isSelected = newTask.priority === priority;
                            // Determine background for selected priority button
                            let selectedButtonBackgroundColor = isSelected 
                                ? (darkMode ? priorityBtnStyle.backgroundColor : theme[`text${priority.charAt(0).toUpperCase() + priority.slice(1)}`]) // Darker text color used as BG in light mode for selected
                                : theme.unselectedPriorityButtonBackground; // Semantic key for unselected
                            // Determine border for selected priority button
                            let selectedButtonBorderColor = isSelected 
                                ? selectedButtonBackgroundColor // Match border to the background for selected
                                : theme.unselectedPriorityButtonBorder; // Semantic key for unselected
                            
                            return (<TouchableOpacity key={priority} style={[ styles.priorityButton, { backgroundColor: selectedButtonBackgroundColor, borderColor: selectedButtonBorderColor }]} onPress={() => setNewTask({...newTask, priority})}><Text style={[ styles.priorityButtonText, { color: isSelected ? theme.buttonText : theme.text } ]}>{priority}</Text></TouchableOpacity>);
                          })}
                        </View></View>
                    </View>
                    {/* Submit button to add the task */}
                    <TouchableOpacity style={styles.addTaskButton} onPress={addTask}><Text style={styles.addTaskButtonText}>Add Task</Text></TouchableOpacity>
                  </View>
                )}
                {/* "Tasks Due Soon" Section (visible if tasks exist and not on "Completed" tab) */}
                {dueSoonTasks.length > 0 && activeTab !== "completed" && (
                  <View style={styles.dueSoonSection}>
                      <View style={styles.dueSoonHeader}><AlertTriangle size={16} color={theme.dueSoonText} /><Text style={styles.dueSoonTitle}>Tasks Due Soon</Text></View>
                      <View style={styles.dueSoonCard}>{dueSoonTasks.map(task => renderTaskItem({ item: task, isDueSoon: true, key: `due-${task.id}` }))}</View>
                  </View>
                )}
              </>}
            data={sortedTasks} // Data for the main task list
            renderItem={({item}) => renderTaskItem({item, isDueSoon: false})} // How to render each item
            keyExtractor={item => item.id} // Unique key for items
            // Component to display when the task list is empty
            ListEmptyComponent={ 
              (!(activeTab === "dashboard" && (newTask.title || dueSoonTasks.length > 0))) ? ( // Complex condition to avoid showing empty when form/due soon might be present
                <View style={styles.emptyStateContainer}>
                    <List size={48} color={theme.mutedText} style={styles.emptyStateIcon} />
                    <Text style={styles.emptyStateText}>{activeTab === "completed" ? "No Completed Tasks Yet" : "No Tasks"}</Text>
                    <Text style={styles.emptyStateSubText}>{activeTab === "dashboard" ? "Get started by adding a new task." : activeTab === "pending" ? "All caught up! No pending tasks." : "Mark tasks as completed to see them here."}</Text>
                    {activeTab !== "dashboard" && (<TouchableOpacity style={styles.emptyStateButton} onPress={() => setActiveTab("dashboard")}><Text style={styles.emptyStateButtonText}>Go to Dashboard</Text></TouchableOpacity>)}
                </View>
              ) : null 
            }
            contentContainerStyle={{ flexGrow: 1, padding: styles.contentAreaFlatList.padding }} // Styling for FlatList content container
            showsVerticalScrollIndicator={false} // Hide the scrollbar
          />
        </View>

        {/* Overlay for dismissing mobile drawer (only rendered and active if mobile and drawer is open) */}
        {isMobile && isDrawerOpen && ( 
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1} // Ensure it's fully opaque and doesn't show press feedback
                onPress={toggleDrawer} // Closes drawer when tapped
            />
        )}
      </View>
    </SafeAreaView>
  );
}