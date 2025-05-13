import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions,
  Appearance, // For potential system color scheme detection
  Platform,
  UIManager,
  LayoutAnimation,
} from "react-native";
import {
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
} from "lucide-react-native"; // Icon library

// Enable LayoutAnimation for Android for smoother UI transitions on list updates, etc.
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Object defining color palettes for light and dark modes.
// These values are used throughout the application for consistent theming.
const AppColors = {
  light: {
    background: "#F9FAFB", // gray-50 - Overall app background
    text: "#1F2937", // gray-800 - Default text color
    card: "#FFFFFF", // white - Background for card-like elements
    border: "#E5E7EB", // gray-200 - Default border color for elements
    primary: "#6D28D9", // violet-700 - Main accent color
    primaryLight: "#EDE9FE", // violet-50 - Lighter shade of primary (e.g., active tab background)
    primaryText: "#5B21B6", // violet-700 - Text color for elements with primaryLight background
    icon: "#4B5563", // gray-600 - Default icon color
    mutedText: "#6B7280", // gray-500 - Softer text color for less prominent information
    error: "#DC2626", // red-600 - Color for error messages and indicators
    buttonText: "#FFFFFF", // For text on colored buttons, ensuring contrast
    completedIcon: "#16A34A", // Green color for the 'completed' checkmark icon

    // Priority specific colors - for badges, buttons, and visual indicators
    lowBg: "#D1FAE5",    // Light green background for 'Low' priority items
    textLow: "#065F46",  // Dark green text, or main color for 'Low' priority buttons/dots
    borderLow: "#A7F3D0",// Light green border for 'Low' priority items
    
    mediumBg: "#FFF7ED", // Light orange background for 'Medium' priority items
    textMedium: "#D97706", // Dark orange text, or main color for 'Medium' priority buttons/dots
    borderMedium: "#FED7AA",// Light orange border for 'Medium' priority items
    
    highBg: "#FEE2E2", // red-100 - Light red background for 'High' priority items
    textHigh: "#B91C1C", // red-800 - Dark red text, or main color for 'High' priority buttons/dots
    borderHigh: "#FECACA", // red-200 - Light red border for 'High' priority items

    // Other specific contextual colors
    countBadgeGreenBg: "#D1FAE5", // Background for the completed tasks count badge in the sidebar
    countBadgeGreenText: "#065F46",// Text color for the completed tasks count badge
    dueSoonCardBg: "#FFF3E0", // Background for the "Tasks Due Soon" card
    dueSoonText: "#C2410C",  // Text color specifically for "Due Soon" elements
    dueSoonBorder: "#FFE0B2",// Border color for the "Due Soon" card
    
    // Direct color mappings for convenience if specific shades are needed directly
    gray800: '#1F2937',
    gray900: '#111827',
    gray700: '#374151',
    gray400: '#9CA3AF',
    gray300: '#D1D4DB',
    gray200: '#E5E7EB',
    yellow300: '#FDE047', // Used for the Moon/Sun icon color in the theme toggle
    violet600: '#7C3AED',
    violet100: '#EDE9FE',
    violet800: '#5B21B6',
    violet900: '#4C1D95',
    green800: '#065F46',
    green200: '#A7F3D0',
    orange300: '#FDBA74', // Used for the AlertTriangle icon in the "Due Soon" header
    red600: '#DC2626',
    red400: '#F87171',
    red300: '#FCA5A5',
    red700: '#B91C1C',
  },
  dark: { // Dark mode equivalents for the colors defined above
    background: "#111827", 
    text: "#F3F4F6", 
    card: "#1F2937", 
    border: "#374151", 
    primary: "#8B5CF6", 
    primaryLight: "#4C1D95", // Darker violet for active tab bg in dark mode
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

    gray800: '#1F2937',
    gray900: '#111827',
    gray700: '#374151',
    gray400: '#9CA3AF',
    gray300: '#D1D4DB',
    gray200: '#E5E7EB',
    yellow300: '#FDE047', // Color for the Sun icon in dark mode
    violet600: '#7C3AED',
    violet100: '#EDE9FE',
    violet800: '#5B21B6',
    violet900: '#4C1D95',
    green800: '#065F46',
    green200: '#A7F3D0',
    orange300: '#FDBA74', // Color for AlertTriangle icon in dark mode "Due Soon"
    red600: '#DC2626',
    red400: '#F87171',
    red300: '#FCA5A5',
    red700: '#B91C1C',
  },
};

// Main component for the Task Manager application
export default function TaskManager() {
  // --- State Variables ---
  const [tasks, setTasks] = useState([]); // Array storing all task objects
  const [newTask, setNewTask] = useState({ // Object to manage input fields for adding a new task
    title: "",
    description: "",
    date: "",
    priority: "Low" // Default priority for a new task
  });
  const [activeTab, setActiveTab] = useState("dashboard"); // Tracks the currently selected tab (e.g., "dashboard", "pending")
  const [dateError, setDateError] = useState(""); // Stores error message for date input validation
  const [titleError, setTitleError] = useState(""); // Stores error message for title input validation
  // const [animation, setAnimation] = useState(""); // Previously used for animation, now LayoutAnimation is used directly
  const [darkMode, setDarkMode] = useState(false); // Boolean state to toggle dark mode theme

  // Selects the appropriate color palette (light/dark) based on the darkMode state
  const theme = darkMode ? AppColors.dark : AppColors.light;

  // Helper function to determine styles for priority elements (badges, buttons)
  // Takes priority level and current color mode ('light' or 'dark') as input
  const priorityStyleLookup = (priority, mode) => {
    const pColors = AppColors[mode]; // Get colors for the current mode
    switch (priority) {
      case "Low": return { backgroundColor: pColors.lowBg, color: pColors.textLow, borderColor: pColors.borderLow };
      case "Medium": return { backgroundColor: pColors.mediumBg, color: pColors.textMedium, borderColor: pColors.borderMedium };
      case "High": return { backgroundColor: pColors.highBg, color: pColors.textHigh, borderColor: pColors.borderHigh };
      default: return { backgroundColor: pColors.lowBg, color: pColors.textLow, borderColor: pColors.borderLow }; // Default to 'Low' priority style
    }
  };
  // String representation of the current color mode, derived from darkMode state
  const colorMode = darkMode ? "dark" : "light";

  // Function to handle adding a new task
  const addTask = () => {
    // Validate that the title field is not empty
    if (newTask.title.trim() === "") {
      setTitleError("Title is required");
      return; // Stop execution if title is invalid
    }
    // Validate the date format if a date is provided
    if (newTask.date && !isValidDate(newTask.date)) {
      setDateError("Please enter a valid date in MM/DD/YYYY format");
      return; // Stop execution if date is invalid
    }

    // Construct the new task object
    const task = {
      id: Date.now().toString(), // Generate a unique ID based on the current timestamp
      title: newTask.title,
      description: newTask.description,
      date: newTask.date,
      priority: newTask.priority || "Low", // Default to "Low" if no priority is set
      completed: false, // New tasks are initially not completed
      createdAt: new Date() // Record creation timestamp for sorting
    };
    
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Configure animation for the next UI update
    setTasks(prev => [...prev, task]); // Add the new task to the tasks array
    // Reset the new task input fields and any error messages
    setNewTask({ title: "", description: "", date: "", priority: "Low" });
    setTitleError("");
    setDateError("");
  };

  // Function to validate the date string format (MM/DD/YYYY) and reality (e.g., not 02/30/2000)
  const isValidDate = (dateStr) => {
    if (!dateStr) return true; // An empty date is considered valid (optional field)
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/; // Regex for MM/DD/YYYY format
    if (!regex.test(dateStr)) return false; // Test against the regex
    
    // Further check if the date is a real calendar date
    const [month, day, year] = dateStr.split("/").map(Number);
    const date = new Date(year, month - 1, day); // Month is 0-indexed in Date constructor
    return date.getMonth() === month - 1 && 
           date.getDate() === day && 
           date.getFullYear() === year;
  };

  // Function to format the date input field as the user types (MM/DD/YYYY)
  const formatDateInput = (value) => {
    const digits = value.replace(/\D/g, "").substring(0, 8); // Remove all non-digit characters and limit length
    let formatted = "";
    if (digits.length > 0) {
      formatted += digits.substring(0, 2); // Month part
      if (digits.length > 2) {
        formatted += "/" + digits.substring(2, 4); // Day part, add slash
        if (digits.length > 4) {
          formatted += "/" + digits.substring(4, 8); // Year part, add slash
        }
      }
    }
    return formatted; // Return the auto-formatted string
  };

  // Function to toggle the 'completed' status of a task
  const toggleTaskCompletion = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Animate the change
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task // Find task by ID and flip its 'completed' boolean
    ));
  };

  // Function to delete a task from the list
  const deleteTask = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Animate the removal
    setTasks(tasks.filter(task => task.id !== id)); // Filter out the task with the given ID
  };

  // Filters the `tasks` array based on the `activeTab` state
  const filteredTasks = tasks.filter(task => {
    if (activeTab === "pending") return !task.completed; // Show only incomplete tasks
    if (activeTab === "completed") return task.completed; // Show only completed tasks
    return true; // "dashboard" or other tabs show all tasks
  });

  // Object to hold calculated statistics about the tasks
  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    pending: tasks.filter(task => !task.completed).length,
    low: tasks.filter(task => task.priority === "Low").length,
    medium: tasks.filter(task => task.priority === "Medium").length,
    high: tasks.filter(task => task.priority === "High").length,
    completionRate: tasks.length > 0 
      ? Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100) // Calculate percentage
      : 0 // Avoid division by zero
  };

  // Function to get tasks that are due within the next 3 days and are not completed
  const getDueSoonTasks = () => {
    const today = new Date(); // Current date
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3); // Date 3 days from now

    return tasks.filter(task => {
      if (!task.date || task.completed) return false; // Skip if no date or already completed
      // Parse the task's date string (MM/DD/YYYY) into a Date object
      const [month, day, year] = task.date.split("/").map(Number);
      const taskDate = new Date(year, month - 1, day); // Month is 0-indexed
      return taskDate >= today && taskDate <= threeDaysLater; // Check if task date is within the range
    });
  };
  // Execute the function to get the current list of due soon tasks
  const dueSoonTasks = getDueSoonTasks();

  // Sorts the `filteredTasks` array for display
  // Order: completion status, priority, due date, creation date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // 1. Sort by completion status: incomplete tasks first
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    // 2. Sort by priority: High > Medium > Low
    const priorityOrder = { "High": 0, "Medium": 1, "Low": 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    // 3. Sort by due date: earlier dates first
    if (a.date && b.date) {
      // Assuming date is MM/DD/YYYY, reverse for YYYY-MM-DD to make it sortable as strings, or parse to Date objects
      const dateA = new Date(a.date.split("/").reverse().join("-")); 
      const dateB = new Date(b.date.split("/").reverse().join("-"));
      if (dateA.getTime() !== dateB.getTime()) return dateA - dateB;
    } else if (a.date) { // Tasks with dates come before tasks without dates
        return -1; 
    } else if (b.date) {
        return 1;
    }
    // 4. Sort by creation date: earlier created tasks first (older first)
    return a.createdAt - b.createdAt; 
  });

  // Function to toggle the dark mode theme
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // StyleSheet for the component, using the `theme` object for dynamic colors
  const styles = StyleSheet.create({
    // Global container for the entire screen, respects safe areas
    screenContainer: { flex: 1, backgroundColor: theme.background },
    // Flex row container for sidebar and main content
    flexRow: { flexDirection: "row" },
    // Utility style for an element to take all available flex space
    flex1: { flex: 1 },
    
    // Sidebar Styles
    sidebar: {
      width: 280,         // Fixed width for the sidebar
      flexGrow: 0,        // Prevent sidebar from growing larger than its specified width
      flexShrink: 0,      // Prevent sidebar from shrinking smaller than its specified width
      paddingHorizontal: 8, 
      paddingVertical: 16,
      backgroundColor: darkMode ? theme.gray900 : theme.card, // Background color adapts to theme
      borderRightWidth: 1,
      borderColor: darkMode ? theme.gray800 : theme.border, // Border color adapts to theme
    },
    // Styles for the header section of the main content area
    mainContent: {
      flex: 1, // Main content takes the remaining horizontal space
      backgroundColor: theme.background,
    },
    // Header of the sidebar (app title and dark mode toggle)
    sidebarHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
    sidebarTitle: { fontSize: 20, fontWeight: "bold", color: theme.text },
    darkModeToggle: { // Touchable area for the dark mode toggle icon
      padding: 8, 
      borderRadius: 999, // Fully rounded
      backgroundColor: darkMode ? theme.gray800 : theme.gray200,
    },
    // Individual navigation item in the sidebar (e.g., Dashboard, Pending)
    navItem: {
      flexDirection: "row", alignItems: "center", width: "100%", 
      paddingHorizontal: 16, paddingVertical: 10, 
      borderRadius: 8, 
      marginBottom: 4, 
    },
    // Style for the currently active navigation item
    navItemActive: {
      backgroundColor: darkMode ? theme.violet900 : theme.violet100, // Uses primary theme colors
    },
    // Text style for navigation items
    navItemText: { color: darkMode ? theme.gray300 : theme.gray700, marginLeft: 12 }, // Space for icon
    // Text style for the active navigation item
    navItemTextActive: { color: darkMode ? theme.violet100 : theme.violet800, fontWeight: "500" },
    // Badge style for displaying counts (e.g., pending tasks)
    badge: {
      marginLeft: "auto", paddingHorizontal: 8, paddingVertical: 2, 
      borderRadius: 999, fontSize: 12,
      backgroundColor: darkMode ? theme.violet800 : theme.violet100, // Uses theme-aware violet
      color: darkMode ? theme.violet200 : theme.violet800,
      overflow: 'hidden', // Ensures text clipping within badge on iOS
    },
    // Specific badge style for the count of completed tasks
    badgeCompleted: { 
      backgroundColor: darkMode ? theme.green800 : theme.green200, // Uses green theme colors
      color: darkMode ? theme.green200 : theme.green800,
    },
    // Container for the statistics section in the sidebar
    statsContainer: { marginTop: 32, paddingTop: 24, borderTopWidth: 1, borderColor: darkMode ? theme.gray800: theme.gray700 },
    statsTitle: { fontSize: 12, fontWeight: "500", color: darkMode ? theme.gray400 : theme.gray400, marginBottom: 16 },
    // Card style for individual statistic displays (e.g., completion rate)
    statCard: {
        backgroundColor: darkMode ? theme.gray900 : theme.card, // Card background adapts to theme
        borderColor: darkMode ? theme.gray800 : theme.border,   // Card border adapts to theme
        borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12
    },
    // Row layout for label and value within a stat card
    statRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
    statLabel: { fontSize: 14, color: darkMode ? theme.gray400 : theme.mutedText },
    statValue: { fontSize: 14, fontWeight: "500", color: theme.text },
    // Progress bar styles for completion rate
    progressBarContainer: { width: "100%", backgroundColor: darkMode ? theme.gray800 : theme.gray200, borderRadius: 999, height: 8 },
    progressBar: { backgroundColor: theme.violet600, height: 8, borderRadius: 999 }, // Filled part of the progress bar
    // Grid layout for stats like Total/Pending tasks
    statGrid: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
    statGridItem: { flex: 1, backgroundColor: darkMode ? theme.gray900 : theme.card, borderWidth:1, borderColor: darkMode ? theme.gray800 : theme.border, borderRadius: 8, padding: 12 },
    statGridLabel: { fontSize: 12, color: darkMode ? theme.gray400 : theme.mutedText },
    statGridValue: { fontSize: 24, fontWeight: "600", color: theme.text },
    // Priority breakdown display styles
    priorityBreakdown: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", fontSize: 12 },
    priorityItem: { flexDirection: "row", alignItems: "center" }, // For each dot + text pair
    priorityDot: { width: 12, height: 12, borderRadius: 6, marginRight: 4 }, // The colored dot itself
    
    // Header section of the main content (shows current tab title like "All Tasks")
    header: {
      backgroundColor: darkMode ? theme.gray900 : theme.card,
      borderBottomWidth: 1,
      borderColor: darkMode ? theme.gray800 : theme.border,
      paddingHorizontal: 24, 
      paddingVertical: 16,   
    },
    headerTitle: { fontSize: 20, fontWeight: "600", color: theme.text },
    // Scrollable content area within the main section
    contentArea: { flex: 1, padding: 24 }, 
    
    // "Add New Task" Form Styles
    formContainer: {
      backgroundColor: darkMode ? theme.gray900 : theme.card,
      borderColor: darkMode ? theme.gray800 : theme.border,
      borderWidth:1, borderRadius: 8, padding: 24, marginBottom: 24
    },
    formTitle: { fontSize: 18, fontWeight: "500", color: theme.text, marginBottom: 16 },
    formGroup: { marginBottom: 16 }, // Wrapper for label + input
    label: { fontSize: 14, fontWeight: "500", color: darkMode ? theme.gray300 : theme.gray700, marginBottom: 4 },
    input: { // General text input style
      width: "100%", paddingHorizontal: 12, paddingVertical: Platform.OS === 'ios' ? 12 : 8, 
      borderWidth: 1, borderRadius: 6, 
      backgroundColor: darkMode ? theme.gray800 : theme.card, // Input background adapts to theme
      borderColor: darkMode ? theme.gray700 : theme.gray300, // Input border adapts to theme
      color: theme.text, // Text color within the input
      fontSize: 14,
    },
    inputError: { // Style for input fields with validation errors
        borderColor: darkMode ? theme.red700 : theme.red300, // Use error color for border
    },
    textArea: { minHeight: 60, textAlignVertical: "top" }, // For multi-line description input
    errorText: { marginTop: 4, fontSize: 12, color: darkMode ? theme.red400 : theme.red600 }, // Error message text style
    // Row layout for form elements like Due Date and Priority
    formRow: { flexDirection: "row", justifyContent: "space-between", gap: 16 }, 
    formRowItem: { flex: 1 }, // Each item in the row (e.g., Due Date field)
    // Container for the priority selection buttons (Low, Medium, High)
    priorityButtonsContainer: { flexDirection: "row", gap: 8 }, 
    priorityButton: { // Style for each priority button
      flex: 1, paddingVertical: 10, paddingHorizontal: 6, 
      borderRadius: 6, borderWidth: 1, alignItems: 'center',
    },
    priorityButtonText: { fontSize: 14, fontWeight: "500" },
    // Style for the main "Add Task" submission button
    addTaskButton: {
      backgroundColor: theme.violet600, 
      width: "100%", paddingVertical: 10, borderRadius: 6, alignItems: "center", marginTop: 8, 
    },
    addTaskButtonText: { color: theme.buttonText, fontSize: 14, fontWeight: "500" },
    
    // "Tasks Due Soon" Section Styles
    dueSoonSection: { marginBottom: 24 },
    dueSoonHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
    dueSoonTitle: { fontSize: 14, fontWeight: "500", color: darkMode ? theme.orange300 : AppColors.light.textOrange, marginLeft: 8 },
    dueSoonCard: { // Card containing the list of due soon tasks
      backgroundColor: darkMode ? theme.orangeBg : AppColors.light.orangeBg,
      borderColor: darkMode ? theme.orangeBg : AppColors.light.borderOrange, 
      borderWidth: 1, borderRadius: 8, overflow: "hidden" // overflow:hidden for rounded corners with bordered child items
    },
    
    // Styles for Individual Task Items in the List
    taskItemContainer: {
      flexDirection: "row", alignItems: "flex-start", // Align icon and text content to the top
      padding: 16, 
      borderBottomWidth: 1,
      // borderColor is applied dynamically in the renderTaskItem function
    },
    // Content area within a task item (title, description, meta)
    taskItemContent: { flex: 1, minWidth: 0, marginLeft: 12 }, // minWidth:0 helps with text truncation if needed
    taskTitle: { fontSize: 14, fontWeight: "500", color: theme.text },
    taskTitleCompleted: { textDecorationLine: "line-through", color: darkMode ? theme.gray400 : theme.mutedText }, // Style for completed task titles
    taskDescription: { marginTop: 4, fontSize: 12, color: darkMode ? theme.gray400 : theme.mutedText },
    taskDescriptionCompleted: { color: darkMode ? theme.gray400 : theme.mutedText },
    // Container for meta information (date, priority badge) below task description
    taskMeta: { marginTop: 8, flexDirection: "row", flexWrap: 'wrap', alignItems: "center", gap: 8 },
    // Container for date icon and text (to keep them together)
    taskMetaText: { fontSize: 12, color: darkMode ? theme.gray400 : theme.mutedText, flexDirection: 'row', alignItems: 'center' },
    // Priority badge displayed on each task item
    priorityBadge: {
      paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, fontSize: 12, fontWeight: "500",
      overflow: 'hidden', 
      // backgroundColor and color are applied dynamically via priorityStyleLookup
    },
    // Container for task action icons (e.g., delete icon)
    taskActions: { marginLeft: 8 }, 
    
    // Styles for the Empty State (when no tasks are available to display)
    emptyStateContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 48 },
    emptyStateText: { marginTop: 8, fontSize: 14, fontWeight: "500", color: theme.text },
    emptyStateSubText: { marginTop: 4, fontSize: 14, color: darkMode ? theme.gray400 : theme.mutedText },
    // Button shown in empty state (e.g., "Go to Dashboard")
    emptyStateButton: {
      marginTop: 24, backgroundColor: theme.violet600, 
      paddingHorizontal: 16, paddingVertical: 10, borderRadius: 6,
    },
    emptyStateButtonText: { color: theme.buttonText, fontSize: 14, fontWeight: "500" },
  });
  
  // Component to render a single task item in the list
  const renderTaskItem = ({ item: task }) => {
    // Get styles specific to the task's priority and current theme
    const priorityStyle = priorityStyleLookup(task.priority, colorMode);
    const isCompleted = task.completed; // Convenience variable

    return (
      <View style={[
          styles.taskItemContainer, // Base style for task item
          { borderColor: darkMode ? theme.gray800 : theme.border }, // Border color adapts to theme
          isCompleted && { backgroundColor: darkMode ? '#1E293B' : '#F9FAFB' } // Subtle background change for completed items
        ]}
      >
        {/* Touchable icon to toggle task completion status */}
        <TouchableOpacity onPress={() => toggleTaskCompletion(task.id)} style={{ marginTop: 2 }}>
          {isCompleted ? (
            <CheckCircle size={20} color={AppColors.light.green800} /> // Shows filled green checkmark if completed
          ) : (
            <Circle size={20} color={darkMode ? theme.gray400 : theme.mutedText} /> // Shows empty circle if not completed
          )}
        </TouchableOpacity>

        {/* Container for task title, description, and meta info */}
        <View style={styles.taskItemContent}>
          <Text style={[styles.taskTitle, isCompleted && styles.taskTitleCompleted]}> 
            {task.title}
          </Text>
          {task.description && ( // Only render description if it exists
            <Text style={[styles.taskDescription, isCompleted && styles.taskDescriptionCompleted]}>
              {task.description}
            </Text>
          )}
          {/* Container for task meta (date and priority badge) */}
          <View style={styles.taskMeta}>
            {task.date && ( // Only render date info if date exists
              <>
                <View style={styles.taskMetaText}> {/* Icon and date text */}
                  <Calendar size={12} color={darkMode ? theme.gray400 : theme.mutedText} style={{ marginRight: 4 }} />
                  <Text style={styles.taskMetaText}>{task.date}</Text>
                </View>
                <Text style={[styles.taskMetaText, {marginHorizontal: 4}]}>•</Text> {/* Separator dot */}
              </>
            )}
            {/* Priority badge for the task */}
            <View style={[styles.priorityBadge, { backgroundColor: priorityStyle.backgroundColor }]}>
               <Text style={{ color: priorityStyle.color, fontSize: 12, fontWeight: '500' }}>{task.priority}</Text>
            </View>
          </View>
        </View>

        {/* Touchable icon to delete the task */}
        <TouchableOpacity onPress={() => deleteTask(task.id)} style={styles.taskActions}>
          <Trash2 size={16} color={darkMode ? theme.gray400 : theme.mutedText} />
        </TouchableOpacity>
      </View>
    );
  };

  // Component to render a single task item in the "Due Soon" section
   const renderDueSoonTaskItem = ({ item: task }) => {
    // Get styles specific to task's priority and theme
    const priorityStyle = priorityStyleLookup(task.priority, colorMode);
    // Get colors specific to the "Due Soon" context
    const dueSoonColors = AppColors[colorMode]; 
    
    return (
      <View style={[
        styles.taskItemContainer, // Base style for task item
        { borderColor: darkMode ? dueSoonColors.orangeBg : dueSoonColors.borderOrange }, // Specific border for due soon items
        { borderBottomWidth: 1} // Ensure border even if it's the last item in a separate list
      ]}
      >
        {/* Touchable icon to toggle completion (note: due soon tasks are by definition incomplete) */}
        <TouchableOpacity onPress={() => toggleTaskCompletion(task.id)} style={{ marginTop: 2}}>
           <Circle size={20} color={darkMode ? dueSoonColors.orange300 : dueSoonColors.textOrange} />
        </TouchableOpacity>

        <View style={styles.taskItemContent}>
          <Text style={[styles.taskTitle, { color: theme.text}]}>{task.title}</Text>
          {task.description && (
            <Text style={[styles.taskDescription, {color: theme.mutedText}]}>{task.description}</Text>
          )}
          <View style={styles.taskMeta}>
            <View style={styles.taskMetaText}> {/* Icon and date text for due soon item */}
                <Calendar size={12} color={darkMode ? dueSoonColors.orange300 : dueSoonColors.textOrange} style={{ marginRight: 4 }} />
                <Text style={[styles.taskMetaText, {color: darkMode ? dueSoonColors.orange300 : dueSoonColors.textOrange}]}>{task.date}</Text>
            </View>
             <Text style={[styles.taskMetaText, {marginHorizontal: 4, color: darkMode ? dueSoonColors.orange300 : dueSoonColors.textOrange}]}>•</Text> {/* Separator dot */}
             {/* Priority badge for due soon item */}
             <View style={[styles.priorityBadge, { backgroundColor: priorityStyle.backgroundColor, borderColor: priorityStyle.borderColor }]}>
               <Text style={{ color: priorityStyle.color, fontSize: 12, fontWeight: '500' }}>{task.priority}</Text>
            </View>
          </View>
        </View>

        {/* Touchable icon to delete the task */}
        <TouchableOpacity onPress={() => deleteTask(task.id)} style={styles.taskActions}>
          <Trash2 size={16} color={darkMode ? theme.gray400 : theme.mutedText} />
        </TouchableOpacity>
      </View>
    );
  };


  // --- Main JSX structure for the TaskManager component ---
  return (
    <SafeAreaView style={styles.screenContainer}> {/* Ensures content is within safe screen boundaries */}
      <View style={styles.flexRow}> {/* Main layout: Sidebar and Main Content side-by-side */}
        
        {/* --- Sidebar --- */}
        <ScrollView style={styles.sidebar} showsVerticalScrollIndicator={false}> {/* Scrollable sidebar */}
          {/* Sidebar Header: App Title & Dark Mode Toggle */}
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarTitle}>Task Manager</Text>
            <TouchableOpacity onPress={toggleDarkMode} style={styles.darkModeToggle}>
              {darkMode ? <Sun size={20} color={theme.yellow300} /> : <Moon size={20} color={theme.gray700} />}
            </TouchableOpacity>
          </View>

          {/* Navigation Tabs */}
          <TouchableOpacity 
            onPress={() => setActiveTab("dashboard")}
            style={[styles.navItem, activeTab === "dashboard" && styles.navItemActive]} // Apply active style if this tab is selected
          >
            <BarChart2 size={20} color={activeTab === "dashboard" ? (darkMode ? theme.violet100 : theme.violet800) : (darkMode ? theme.gray300 : theme.gray700)} />
            <Text style={[styles.navItemText, activeTab === "dashboard" && styles.navItemTextActive]}>Dashboard</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => setActiveTab("pending")}
            style={[styles.navItem, activeTab === "pending" && styles.navItemActive]}
          >
            <Clock size={20} color={activeTab === "pending" ? (darkMode ? theme.violet100 : theme.violet800) : (darkMode ? theme.gray300 : theme.gray700)} />
            <Text style={[styles.navItemText, activeTab === "pending" && styles.navItemTextActive]}>Pending Tasks</Text>
            {stats.pending > 0 && ( // Display count badge if there are pending tasks
                <Text style={styles.badge}>{stats.pending}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setActiveTab("completed")}
            style={[styles.navItem, activeTab === "completed" && styles.navItemActive]}
          >
            <CheckSquare size={20} color={activeTab === "completed" ? (darkMode ? theme.violet100 : theme.violet800) : (darkMode ? theme.gray300 : theme.gray700)} />
            <Text style={[styles.navItemText, activeTab === "completed" && styles.navItemTextActive]}>Completed Tasks</Text>
            {stats.completed > 0 && ( // Display count badge if there are completed tasks
                <Text style={[styles.badge, styles.badgeCompleted]}>{stats.completed}</Text>
            )}
          </TouchableOpacity>
          
          {/* Statistics Section in Sidebar */}
          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>STATISTICS</Text>
            {/* Completion Rate Card */}
            <View style={styles.statCard}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Completion Rate</Text>
                <Text style={styles.statValue}>{stats.completionRate}%</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${stats.completionRate}%` }]} />
              </View>
            </View>
            {/* Total and Pending Task Counts */}
            <View style={styles.statGrid}>
                <View style={styles.statGridItem}>
                    <Text style={styles.statGridLabel}>Total</Text>
                    <Text style={styles.statGridValue}>{stats.total}</Text>
                </View>
                <View style={styles.statGridItem}>
                    <Text style={styles.statGridLabel}>Pending</Text>
                    <Text style={styles.statGridValue}>{stats.pending}</Text>
                </View>
            </View>
            {/* Priority Breakdown Card */}
             <View style={[styles.statCard, {marginTop: 12}]}>
                <Text style={[styles.statGridLabel, { marginBottom: 8 }]}>Priority Breakdown</Text>
                <View style={styles.priorityBreakdown}>
                    {/* Low Priority */}
                    <View style={styles.priorityItem}>
                        <View style={[
                            styles.priorityDot,
                            { // Dot color uses the vibrant 'textLow' color for background for visibility
                                backgroundColor: theme.textLow,      
                                borderColor: theme.borderLow,    
                                borderWidth: 1
                            }
                        ]} />
                        <Text style={{color: theme.text, fontSize: 12}}>Low: {stats.low}</Text>
                    </View>
                    {/* Medium Priority */}
                    <View style={styles.priorityItem}>
                        <View style={[
                            styles.priorityDot,
                            { // Dot color uses the vibrant 'textMedium' color
                                backgroundColor: theme.textMedium,   
                                borderColor: theme.borderMedium, 
                                borderWidth: 1
                            }
                        ]} />
                         <Text style={{color: theme.text, fontSize: 12}}>Medium: {stats.medium}</Text>
                    </View>
                    {/* High Priority */}
                    <View style={styles.priorityItem}>
                        <View style={[
                            styles.priorityDot,
                            { // Dot color uses the vibrant 'textHigh' color
                                backgroundColor: theme.textHigh,     
                                borderColor: theme.borderHigh,   
                                borderWidth: 1
                            }
                        ]} />
                         <Text style={{color: theme.text, fontSize: 12}}>High: {stats.high}</Text>
                    </View>
                </View>
            </View>
          </View>
        </ScrollView>

        {/* --- Main Content Area --- */}
        <View style={styles.mainContent}>
          {/* Header of the Main Content (shows active tab title) */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {activeTab === "dashboard" ? "All Tasks" : 
               activeTab === "pending" ? "Pending Tasks" : "Completed Tasks"}
            </Text>
          </View>
          
          {/* Scrollable area for tasks, form, etc. */}
          <ScrollView style={styles.contentArea} contentContainerStyle={{flexGrow: 1}}> {/* flexGrow ensures content can fill space if small */}
            {/* "Add New Task" Form (only displayed on Dashboard tab) */}
            {activeTab === "dashboard" && (
              <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Add New Task</Text>
                {/* Task Title Input */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Title *</Text>
                  <TextInput
                    style={[styles.input, titleError && styles.inputError]} // Apply error style if titleError exists
                    value={newTask.title}
                    onChangeText={(text) => {
                      setNewTask({...newTask, title: text});
                      if (text.trim()) setTitleError(""); // Clear error if title is no longer empty
                    }}
                    placeholder="What needs to be done?"
                    placeholderTextColor={theme.mutedText}
                  />
                  {titleError && <Text style={styles.errorText}>{titleError}</Text>} {/* Display title error message */}
                </View>
                {/* Task Description Input */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]} // Apply textarea specific styles
                    value={newTask.description}
                    onChangeText={(text) => setNewTask({...newTask, description: text})}
                    placeholder="Add details..."
                    placeholderTextColor={theme.mutedText}
                    multiline // Allow multiple lines of text
                  />
                </View>
                {/* Row for Due Date and Priority Inputs */}
                <View style={styles.formRow}>
                    {/* Due Date Input */}
                    <View style={[styles.formGroup, styles.formRowItem]}>
                        <Text style={styles.label}>Due Date</Text>
                        <TextInput
                            style={[styles.input, dateError && styles.inputError]} // Apply error style if dateError exists
                            value={newTask.date}
                            onChangeText={(text) => {
                                const formatted = formatDateInput(text); // Format input on the fly
                                setNewTask({...newTask, date: formatted});
                                if (isValidDate(formatted) || formatted === "") setDateError(""); // Clear error if date is valid or empty
                            }}
                            placeholder="MM/DD/YYYY"
                            placeholderTextColor={theme.mutedText}
                            keyboardType="numeric" // Suggest numeric keyboard
                        />
                        {dateError && <Text style={styles.errorText}>{dateError}</Text>} {/* Display date error message */}
                    </View>
                    {/* Priority Selection */}
                    <View style={[styles.formGroup, styles.formRowItem]}>
                        <Text style={styles.label}>Priority</Text>
                        <View style={styles.priorityButtonsContainer}>
                          {["Low", "Medium", "High"].map((priority) => { // Map through priority levels to create buttons
                            const priorityBtnStyle = priorityStyleLookup(priority, colorMode);
                            const isSelected = newTask.priority === priority; // Check if this priority is currently selected

                            // Determine background color for selected button (darker in light mode for contrast)
                            let selectedButtonBackgroundColor = priorityBtnStyle.backgroundColor;
                            if (isSelected && !darkMode) { // Special handling for selected buttons in light mode
                              switch (priority) {
                                case "Low": selectedButtonBackgroundColor = theme.textLow; break;
                                case "Medium": selectedButtonBackgroundColor = theme.textMedium; break;
                                case "High": selectedButtonBackgroundColor = theme.textHigh; break;
                              }
                            }
                            // Determine border color for selected button
                            let selectedButtonBorderColor = priorityBtnStyle.borderColor || priorityBtnStyle.backgroundColor;
                            if (isSelected && !darkMode) {
                                selectedButtonBorderColor = selectedButtonBackgroundColor; // Border matches new darker background
                            }

                            return (
                              <TouchableOpacity
                                key={priority} // Unique key for each button
                                style={[
                                  styles.priorityButton,
                                  isSelected // Apply different styles if button is selected
                                    ? { backgroundColor: selectedButtonBackgroundColor, borderColor: selectedButtonBorderColor, }
                                    : { backgroundColor: darkMode ? theme.gray800 : theme.card, borderColor: darkMode ? theme.gray700 : theme.gray300, }
                                ]}
                                onPress={() => setNewTask({ ...newTask, priority })} // Update newTask state with selected priority
                              >
                                <Text style={[
                                  styles.priorityButtonText,
                                  // Text color contrasts with button background
                                  { color: isSelected ? theme.buttonText : theme.text } 
                                ]}>
                                  {priority}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                    </View>
                </View>
                {/* Submit Button to Add Task */}
                 <TouchableOpacity style={styles.addTaskButton} onPress={addTask}>
                  <Text style={styles.addTaskButtonText}>Add Task</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* "Tasks Due Soon" Section (displayed on Dashboard and Pending, if tasks exist) */}
            {dueSoonTasks.length > 0 && activeTab !== "completed" && (
              <View style={styles.dueSoonSection}>
                <View style={styles.dueSoonHeader}>
                  <AlertTriangle size={16} color={darkMode ? theme.orange300 : AppColors.light.textOrange} />
                  <Text style={styles.dueSoonTitle}>Tasks Due Soon</Text>
                </View>
                {/* Card containing the list of due soon tasks */}
                <View style={styles.dueSoonCard}>
                  <FlatList
                    data={dueSoonTasks}
                    renderItem={renderDueSoonTaskItem} // Use specific renderer for due soon items
                    keyExtractor={item => item.id}
                    scrollEnabled={false} // Disable scrolling for this inner FlatList as parent ScrollView handles it
                  />
                </View>
              </View>
            )}
            
            {/* Main Task List */}
            {sortedTasks.length > 0 ? ( // If there are tasks to display
               <View style={[ // Container for the task list with themed border and background
                    { backgroundColor: darkMode ? theme.gray900 : theme.card,
                      borderColor: darkMode ? theme.gray800 : theme.border,
                      borderWidth: 1, borderRadius: 8, overflow: 'hidden'}
                ]}>
                <FlatList
                    data={sortedTasks}
                    renderItem={renderTaskItem} // Use general task item renderer
                    keyExtractor={item => item.id}
                    scrollEnabled={false} // Disable scrolling, parent ScrollView handles it
                />
               </View>
            ) : ( // If no tasks, display the empty state message
              <View style={styles.emptyStateContainer}>
                <List size={48} color={darkMode ? theme.gray700 : theme.gray200} />
                <Text style={styles.emptyStateText}>No tasks</Text>
                <Text style={styles.emptyStateSubText}>
                  {activeTab === "dashboard" 
                    ? "Get started by adding a new task" 
                    : activeTab === "pending" 
                      ? "No pending tasks" 
                      : "No completed tasks"}
                </Text>
                {/* Button to navigate to Dashboard if not already there and list is empty */}
                {activeTab !== "dashboard" && (
                  <TouchableOpacity 
                    style={styles.emptyStateButton}
                    onPress={() => setActiveTab("dashboard")}
                  >
                    <Text style={styles.emptyStateButtonText}>Go to Dashboard</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}