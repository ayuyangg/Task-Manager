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
  Appearance, 
  Platform,
  UIManager,
  LayoutAnimation,
} from "react-native";
// Import UI components and utility modules from React Native
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
  Menu as MenuIcon, 
  X as XIcon        
} from "lucide-react-native";
// Import icons from lucide-react-native library

// Enable LayoutAnimation for Android for smoother UI transitions
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Color palette definition for light and dark themes
const AppColors = {
  light: {
    background: "#F9FAFB", // Overall app background, now also for header
    text: "#1F2937", 
    card: "#FFFFFF", 
    border: "#E5E7EB", 
    primary: "#6D28D9", 
    primaryLight: "#EDE9FE", 
    primaryText: "#5B21B6", 
    icon: "#4B5563", 
    mutedText: "#6B7280", 
    error: "#DC2626", 
    buttonText: "#FFFFFF", 
    completedIcon: "#16A34A", 
    lowBg: "#D1FAE5",    
    textLow: "#065F46",  
    borderLow: "#A7F3D0",
    mediumBg: "#FFF7ED", 
    textMedium: "#D97706", 
    borderMedium: "#FED7AA",
    highBg: "#FEE2E2", 
    textHigh: "#B91C1C", 
    borderHigh: "#FECACA", 
    countBadgeGreenBg: "#D1FAE5", 
    countBadgeGreenText: "#065F46",
    dueSoonCardBg: "#FFF3E0", 
    dueSoonText: "#C2410C", 
    dueSoonBorder: "#FFE0B2",
    yellow300: '#FDE047', 
    sidebarBackground: "#FFFFFF", 
    sidebarBorder: "#E5E7EB", 
    // MODIFIED: headerBackground now uses the main 'background' color
    headerBackground: "#F9FAFB", 
    headerBorder: "#E5E7EB", // Kept the border, adjust if needed
    activeTabBackground: "#EDE9FE", 
    navItemTextColor: "#374151", 
    activeNavItemTextColor: "#5B21B6", 
    inputBackground: "#FFFFFF", 
    inputBorder: "#D1D4DB", 
    unselectedPriorityButtonBackground: "#FFFFFF",
    unselectedPriorityButtonBorder: "#D1D4DB",
    darkModeToggleBackground: "#E5E7EB",
    progressBarContainerBackground: "#E5E7EB", 
    formContainerBackground: "#FFFFFF", 
    taskListItemBackground: "#FFFFFF", 
  },
  dark: {
    background: "#111827", // Overall app background, now also for header
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
    sidebarBackground: "#111827", 
    sidebarBorder: "#374151",
    // MODIFIED: headerBackground now uses the main 'background' color
    headerBackground: "#111827", 
    headerBorder: "#374151", // Kept the border, adjust if needed
    activeTabBackground: "#4C1D95",
    navItemTextColor: "#D1D4DB",
    activeNavItemTextColor: "#DDD6FE",
    inputBackground: "#1F2937",
    inputBorder: "#374151",
    unselectedPriorityButtonBackground: "#1F2937",
    unselectedPriorityButtonBorder: "#374151",
    darkModeToggleBackground: "#1F2937",
    progressBarContainerBackground: "#374151", 
    formContainerBackground: "#1F2937", 
    taskListItemBackground: "#1F2937", 
  },
};


export default function TaskManager() {
  // --- State ---
  const [tasks, setTasks] = useState([]); // Holds the list of all tasks
  const [newTask, setNewTask] = useState({ title: "", description: "", date: "", priority: "Low" }); // State for the new task form
  const [activeTab, setActiveTab] = useState("dashboard"); // Current active tab (e.g., dashboard, pending, completed)
  const [dateError, setDateError] = useState(""); // Error message for date input validation
  const [titleError, setTitleError] = useState(""); // Error message for title input validation
  const [darkMode, setDarkMode] = useState(false); // Dark mode toggle state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Mobile navigation drawer visibility state

  // --- Theme & Responsive Calculation ---
  const theme = darkMode ? AppColors.dark : AppColors.light; // Selects color theme based on darkMode state
  const colorMode = darkMode ? "dark" : "light"; // String representation of current color mode
  const windowWidth = Dimensions.get('window').width; // Gets the current window width for responsiveness
  const WEB_SIDEBAR_WIDTH = 280; // Fixed width for sidebar on web
  const MOBILE_DRAWER_WIDTH = windowWidth * 0.8; // Width of the mobile drawer (80% of screen width)
  const isMobile = Platform.OS !== 'web' || windowWidth < 768; // Determines if layout should be mobile-optimized
                                                            // This ensures on actual mobile devices, mobile layout is default.

  // --- Core Logic Functions ---
  // Retrieves style properties based on task priority and current theme mode
  const priorityStyleLookup = (priority, mode) => { /* ... same ... */ 
    const pColors = AppColors[mode];
    switch (priority) {
      case "Low": return { backgroundColor: pColors.lowBg, color: pColors.textLow, borderColor: pColors.borderLow };
      case "Medium": return { backgroundColor: pColors.mediumBg, color: pColors.textMedium, borderColor: pColors.borderMedium };
      case "High": return { backgroundColor: pColors.highBg, color: pColors.textHigh, borderColor: pColors.borderHigh };
      default: return { backgroundColor: pColors.lowBg, color: pColors.textLow, borderColor: pColors.borderLow };
    }
  };
  // Adds a new task to the list after validation
  const addTask = () => { /* ... same ... */ 
    if (newTask.title.trim() === "") { setTitleError("Title is required"); return; }
    if (newTask.date && !isValidDate(newTask.date)) { setDateError("Please enter a valid date in MM/DD/YYYY format"); return; }
    const task = { id: Date.now().toString(), ...newTask, priority: newTask.priority || "Low", completed: false, createdAt: new Date() };
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Animate task addition
    setTasks(prev => [task, ...prev]);
    setNewTask({ title: "", description: "", date: "", priority: "Low" }); // Reset form
    setTitleError(""); setDateError("");
  };
  // Validates date string format (MM/DD/YYYY)
  const isValidDate = (dateStr) => { /* ... same ... */ 
    if (!dateStr) return true; // Allow empty date
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (!regex.test(dateStr)) return false;
    const [month, day, year] = dateStr.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    return date.getMonth() === month - 1 && date.getDate() === day && date.getFullYear() === year;
  };
  // Formats date input as user types (MM/DD/YYYY)
  const formatDateInput = (value) => { /* ... same ... */ 
    const digits = value.replace(/\D/g, "").substring(0, 8);
    let formatted = "";
    if (digits.length > 0) {formatted += digits.substring(0, 2); if (digits.length > 2) {formatted += "/" + digits.substring(2, 4); if (digits.length > 4) {formatted += "/" + digits.substring(4, 8);}}}
    return formatted;
  };
  // Toggles the completion status of a task
  const toggleTaskCompletion = (id) => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task)); };
  // Deletes a task from the list
  const deleteTask = (id) => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setTasks(tasks.filter(task => task.id !== id)); };
  // Filters tasks based on the active tab (pending, completed, or all)
  const filteredTasks = tasks.filter(task => { if (activeTab === "pending") return !task.completed; if (activeTab === "completed") return task.completed; return true; });
  // Calculates various statistics about the tasks
  const stats = { /* ... same ... */ 
    total: tasks.length, completed: tasks.filter(task => task.completed).length, pending: tasks.filter(task => !task.completed).length,
    low: tasks.filter(task => task.priority === "Low").length, medium: tasks.filter(task => task.priority === "Medium").length, high: tasks.filter(task => task.priority === "High").length,
    completionRate: tasks.length > 0 ? Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100) : 0
  };
  // Filters tasks that are due within the next 3 days and are not completed
  const getDueSoonTasks = () => { /* ... same as your last full version ... */ 
    const today = new Date(); today.setHours(0,0,0,0);
    const threeDaysLater = new Date(); threeDaysLater.setDate(today.getDate() + 3); threeDaysLater.setHours(23,59,59,999);
    return tasks.filter(task => {
      if (!task.date || task.completed) return false;
      const [month, day, year] = task.date.split("/").map(Number);
      const taskDate = new Date(year, month - 1, day); taskDate.setHours(0,0,0,0);
      return taskDate >= today && taskDate <= threeDaysLater;
    });
  };
  const dueSoonTasks = getDueSoonTasks(); // Memoized list of tasks due soon
  // Sorts tasks: incomplete first, then by priority (High > Medium > Low), then by due date (earlier first), then by creation date (newest first)
  const sortedTasks = [...filteredTasks].sort((a, b) => { /* ... same as your last full version ... */
    if (a.completed !== b.completed) return a.completed ? 1 : -1; // Incomplete tasks first
    const priorityOrder = { "High": 0, "Medium": 1, "Low": 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) { return priorityOrder[a.priority] - priorityOrder[b.priority]; } // Sort by priority
    if (a.date && b.date) { // Sort by due date if both exist
      const dateA = new Date(a.date.split("/")[2], parseInt(a.date.split("/")[0],10)-1, a.date.split("/")[1]);
      const dateB = new Date(b.date.split("/")[2], parseInt(b.date.split("/")[0],10)-1, b.date.split("/")[1]);
      if (dateA.getTime() !== dateB.getTime()) return dateA - dateB;
    } else if (a.date) { return -1; } else if (b.date) { return 1;} // Tasks with dates come before those without
    return b.createdAt - a.createdAt; // Fallback to creation date (newest first)
  });
  // Toggles dark mode state
  const toggleDarkMode = () => setDarkMode(!darkMode);
  // Toggles the mobile navigation drawer, only if on a mobile layout
  const toggleDrawer = () => {
    if (isMobile) { // Drawer toggle is only for mobile
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Animate drawer opening/closing
        setIsDrawerOpen(!isDrawerOpen);
    }
  };

  // --- Styles ---
  // Note: `theme` object provides colors based on `darkMode` state.
  // `isMobile` boolean helps apply mobile-specific layout styles.
  const styles = StyleSheet.create({
    screenContainer: { flex: 1, backgroundColor: theme.background }, // Overall screen container
    flexRow: { flexDirection: "row", flex: 1 }, // Helper for row layout
    
    menuButton: { // Hamburger menu button for mobile
      // Only displayed and positioned if isMobile is true
      ...(isMobile && { 
        position: 'absolute', // Positioned over content
        top: Platform.OS === 'ios' ? 50 : 20, // iOS/Android specific top positioning
        left: 15,
        zIndex: 1010, // Ensures button is on top
        padding: 8,
      })
    },
    sidebar: {
      // Common base styles for sidebar (padding, background, border)
      paddingHorizontal: 8, 
      paddingVertical: 16,
      backgroundColor: theme.sidebarBackground,
      borderColor: theme.sidebarBorder,

      // Web-specific layout (fixed width, part of flow)
      ...(!isMobile && {
        width: WEB_SIDEBAR_WIDTH,
        borderRightWidth: 1,
        flexGrow: 0,        // Prevents growing
        flexShrink: 0,      // Prevents shrinking
      }),

      // Mobile-specific drawer layout (absolute, slides in/out)
      ...(isMobile && {
        position: 'absolute', // Allows sliding in/out
        top: 0,
        bottom: 0,
        left: isDrawerOpen ? 0 : -MOBILE_DRAWER_WIDTH, // Controls drawer visibility via left offset
        width: MOBILE_DRAWER_WIDTH,
        height: '100%',
        zIndex: 1000, // Sits above main content but below menu button/overlay
        borderRightWidth: isDrawerOpen ? 1 : 0, // Show border only when open
        // Shadow for drawer elevation on mobile
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: isDrawerOpen ? 0.25 : 0,
        shadowRadius: 3.84,
        elevation: isDrawerOpen ? 5 : 0, // Android elevation
      })
    },
    mainContent: {
      flex: 1, // Takes remaining space
      backgroundColor: theme.background,
    },
    overlay: { // Overlay to close mobile drawer by tapping outside
      // Only displayed and active if isMobile and isDrawerOpen
      ...(isMobile && isDrawerOpen && {
        position: 'absolute', // Covers the entire screen
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
        zIndex: 999, // Below drawer, above main content when drawer is open
      })
    },
    sidebarHeader: { 
      flexDirection: "row", 
      justifyContent: isMobile ? "center" : "space-between", // Center title on mobile, space items on web
      alignItems: "center", 
      marginBottom: 24, 
      paddingHorizontal: 8,
      marginTop: isMobile ? (Platform.OS === 'ios' ? 25 : 10) : 0, // Adjust top margin for mobile drawer status bar
    },
    // Mobile-only placeholder for menu button in sidebar header to balance centered title
    menuButtonPlaceholder: { // Used to correctly center title when menu button might be present/absent
        display: isMobile ? 'flex' : 'none',
        width: 40, // Approx width of the menu icon + padding
    },
    sidebarTitle: { 
        fontSize: (isMobile && isDrawerOpen) || !isMobile ? 18 : 16, // Dynamic font size
        fontWeight: "bold", 
        color: theme.text,
        textAlign: isMobile ? 'center' : 'left', // Center title on mobile drawer
    },
    darkModeToggle: { 
        padding: 8, 
        borderRadius: 999, // Circular button
        backgroundColor: theme.darkModeToggleBackground,
        display: isMobile ? 'none' : 'flex', // Hidden on mobile sidebar header (moved to drawer items)
                                            // OR: if you want it, make sure menu button and this are spaced.
                                            // For now, hiding it from mobile drawer header to simplify centering Task Manager
    },
    darkModeToggleInDrawer: { // Style for dark mode toggle when inside mobile drawer items
        display: isMobile ? 'flex' : 'none', // Only shown in drawer on mobile
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, marginBottom: 4,
    },

    navItem: { flexDirection: "row", alignItems: "center", width: "100%", paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, marginBottom: 4, }, // Navigation item base style
    navItemActive: { backgroundColor: theme.activeTabBackground }, // Style for active navigation item
    navItemText: { color: theme.navItemTextColor, marginLeft: ((isMobile && isDrawerOpen) || !isMobile) ? 10 : 8, fontSize: ((isMobile && isDrawerOpen) || !isMobile) ? 14 : 13, }, // Navigation item text style
    navItemTextActive: { color: theme.activeNavItemTextColor, fontWeight: "500" }, // Style for active navigation item text
    badge: { marginLeft: "auto", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, fontSize: 12, backgroundColor: theme.primaryLight, color: theme.primaryText, overflow: 'hidden'}, // Count badge style
    badgeCompleted: { backgroundColor: theme.countBadgeGreenBg, color: theme.countBadgeGreenText }, // Style for completed count badge
    
    statsContainer: { 
      display: (isMobile && !isDrawerOpen) ? 'none' : 'flex', // Hide stats if mobile drawer is closed
      marginTop: 24, paddingTop: 16, borderTopWidth: 1, 
      borderColor: theme.border, paddingHorizontal: 8 
    },
    statsTitle: { fontSize: 11, fontWeight: "500", color: theme.mutedText, marginBottom: 12, textTransform: 'uppercase'}, // Title for statistics section
    statCard: { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 }, // Card style for individual stats
    statRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }, // Row within a stat card
    statLabel: { fontSize: 13, color: theme.mutedText }, // Label for a stat
    statValue: { fontSize: 13, fontWeight: "500", color: theme.text }, // Value of a stat
    progressBarContainer: { width: "100%", backgroundColor: theme.progressBarContainerBackground, borderRadius: 999, height: 8 }, // Container for progress bar
    progressBar: { backgroundColor: theme.primary, height: 8, borderRadius: 999 }, // Actual progress bar
    statGrid: { flexDirection: "row", justifyContent: "space-between", gap: 8 }, // Grid layout for multiple small stats
    statGridItem: { flex: 1, backgroundColor: theme.card, borderWidth:1, borderColor: theme.border, borderRadius: 8, padding: 10 }, // Item in the stat grid
    statGridLabel: { fontSize: 11, color: theme.mutedText, marginBottom: 2 }, // Label for stat grid item
    statGridValue: { fontSize: 20, fontWeight: "600", color: theme.text }, // Value for stat grid item
    priorityBreakdownTitle: { fontSize: 11, color: theme.mutedText, marginBottom: 8, textTransform: 'uppercase', fontWeight: '500'}, // Title for priority breakdown
    priorityBreakdown: { flexDirection: "row", justifyContent: "space-around", alignItems: "center" }, // Container for priority items
    priorityItem: { flexDirection: "row", alignItems: "center", gap: 4 }, // Individual priority item (dot + text)
    priorityDot: { width: 10, height: 10, borderRadius: 5, borderWidth: 1 }, // Color-coded dot for priority
    priorityItemText: { color: theme.text, fontSize: 11 }, // Text for priority item
    
    header: { // Main content header (e.g., "All Tasks")
      backgroundColor: theme.headerBackground, 
      borderBottomWidth: 1, 
      borderColor: theme.headerBorder, 
      paddingHorizontal: isMobile ? 50 : 20, // More horizontal padding on mobile to account for potential absolute menu button
      paddingVertical: 16,
      flexDirection: 'row', 
      alignItems: 'center',
      justifyContent: isMobile ? 'center' : 'flex-start', // Center title on mobile
    },
    headerTitle: { 
        fontSize: 20, 
        fontWeight: "600", 
        color: theme.text,
        // textAlign: isMobile ? 'center' : 'left', // Ensure title text is centered on mobile if justifyContent is 'center'
    },
    // This invisible placeholder is only for mobile header to balance menu icon if it's within the header flow.
    // Since menu icon is absolute, this is not strictly needed unless we make menu icon part of header.
    headerMenuPlaceholder: { 
        // display: isMobile ? 'flex' : 'none', // Typically hidden, used for layout balancing
        // width: 40, // Match menu button width + padding
    },

    contentAreaScrollView: { padding: 20 }, // Padding for scrollable content areas
    contentAreaFlatList: { padding: 20 }, // Padding for FlatList content
    formContainer: { backgroundColor: theme.formContainerBackground, borderColor: theme.border, borderWidth:1, borderRadius: 8, padding: 20, marginBottom: 20 }, // Container for the "Add New Task" form
    formTitle: { fontSize: 18, fontWeight: "500", color: theme.text, marginBottom: 16 }, // Title for the form
    formGroup: { marginBottom: 16 }, // Grouping for label and input
    label: { fontSize: 14, fontWeight: "500", color: theme.mutedText, marginBottom: 6 }, // Label for form inputs
    input: { width: "100%", paddingHorizontal: 12, paddingVertical: Platform.OS === 'ios' ? 12 : 10, borderWidth: 1, borderRadius: 6, backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, color: theme.text, fontSize: 14}, // General input style
    inputError: { borderColor: theme.error }, // Style for input with validation error
    textArea: { minHeight: 60, textAlignVertical: "top" }, // Style for multi-line text input (description)
    errorText: { marginTop: 4, fontSize: 12, color: theme.error }, // Text style for validation errors
    formRow: { flexDirection: "row", justifyContent: "space-between", gap: 16 }, // Row layout in form (e.g., for date and priority)
    formRowItem: { flex: 1 }, // Item within a form row
    priorityButtonsContainer: { flexDirection: "row", gap: 8 }, // Container for priority selection buttons
    priorityButton: { flex: 1, paddingVertical: 10, paddingHorizontal: 6, borderRadius: 6, borderWidth: 1, alignItems: 'center'}, // Individual priority button
    priorityButtonText: { fontSize: 14, fontWeight: "500" }, // Text on priority button
    addTaskButton: { backgroundColor: theme.primary, width: "100%", paddingVertical: 12, borderRadius: 6, alignItems: "center", marginTop: 8 }, // "Add Task" button style
    addTaskButtonText: { color: theme.buttonText, fontSize: 14, fontWeight: "500" }, // Text on "Add Task" button
    dueSoonSection: { marginBottom: 20 }, // Section for tasks due soon
    dueSoonHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 }, // Header for "due soon" section
    dueSoonTitle: { fontSize: 14, fontWeight: "500", color: theme.dueSoonText, marginLeft: 8 }, // Title for "due soon" section
    dueSoonCard: { backgroundColor: theme.dueSoonCardBg, borderColor: theme.dueSoonBorder, borderWidth: 1, borderRadius: 8, overflow: "hidden" }, // Card style for "due soon" tasks list
    taskItemContainer: { flexDirection: "row", alignItems: "flex-start", padding: 16, borderBottomWidth: 1}, // Container for an individual task item
    taskItemContent: { flex: 1, minWidth: 0, marginLeft: 12 }, // Main content area of a task item (title, description, meta)
    taskTitle: { fontSize: 14, fontWeight: "500", color: theme.text }, // Task title text
    taskTitleCompleted: { textDecorationLine: "line-through", color: theme.mutedText }, // Style for completed task title
    taskDescription: { marginTop: 4, fontSize: 12, color: theme.mutedText }, // Task description text
    taskDescriptionCompleted: { color: theme.mutedText }, // Style for completed task description
    taskMeta: { marginTop: 8, flexDirection: "row", flexWrap: 'wrap', alignItems: "center", gap: 6 }, // Container for task metadata (date, priority)
    taskMetaTextContainer: { flexDirection: 'row', alignItems: 'center', gap: 4}, // Container for meta text with icon
    taskMetaText: { fontSize: 12, color: theme.mutedText }, // Text for task metadata
    priorityBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1}, // Badge for task priority
    priorityBadgeText: {fontSize: 11, fontWeight: "500"}, // Text within priority badge
    taskActions: { marginLeft: 8, paddingTop:2 }, // Container for task actions (e.g., delete button)
    emptyStateContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 48 }, // Container for when no tasks are shown
    emptyStateIcon: { marginBottom: 12, color: theme.mutedText }, // Icon for empty state
    emptyStateText: { marginTop: 8, fontSize: 14, fontWeight: "500", color: theme.text }, // Main text for empty state
    emptyStateSubText: { marginTop: 4, fontSize: 14, color: theme.mutedText, textAlign: 'center', paddingHorizontal: 20 }, // Sub-text for empty state
    emptyStateButton: { marginTop: 24, backgroundColor: theme.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 6}, // Button for empty state (e.g., "Go to Dashboard")
    emptyStateButtonText: { color: theme.buttonText, fontSize: 14, fontWeight: "500" }, // Text on empty state button
  });

  // --- Render Functions for List Items ---
  // Renders a single task item, adaptable for regular list or "due soon" list
  const renderTaskItem = ({ item: task, isDueSoon = false }) => { /* ... (Same as your previous good version, using `theme`) ... */ 
    const priorityStyles = priorityStyleLookup(task.priority, colorMode); // Get priority-specific styles
    const isCompleted = task.completed;
    // Determine colors based on whether the task is due soon and its completion status
    const itemBorderColor = isDueSoon ? theme.dueSoonBorder : theme.border;              
    const itemIconColorUncompleted = isDueSoon ? theme.dueSoonText : theme.mutedText;         
    const titleTextColor = (isDueSoon && !isCompleted) ? theme.dueSoonText : (isCompleted ? theme.mutedText : theme.text);
    const descriptionTextColor = (isDueSoon && !isCompleted) ? (darkMode ? theme.dueSoonText : theme.mutedText ) : theme.mutedText;
    const metaIconAndTextColor = (isDueSoon && !isCompleted) ? theme.dueSoonText : theme.mutedText;

    return (
      <View style={[styles.taskItemContainer, { borderColor: itemBorderColor, backgroundColor: isCompleted ? (darkMode ? theme.card : theme.background) : (isDueSoon ? theme.dueSoonCardBg : theme.taskListItemBackground) }]}>
        {/* Checkbox for task completion */}
        <TouchableOpacity onPress={() => toggleTaskCompletion(task.id)} style={{ marginTop: 2 }}>
          {isCompleted ? <CheckCircle size={20} color={theme.completedIcon} /> : <Circle size={20} color={itemIconColorUncompleted} />}
        </TouchableOpacity>
        {/* Task details */}
        <View style={styles.taskItemContent}>
          <Text style={[styles.taskTitle, isCompleted && styles.taskTitleCompleted, {color: titleTextColor} ]}>{task.title}</Text>
          {task.description && (<Text style={[styles.taskDescription, isCompleted && styles.taskDescriptionCompleted, {color: descriptionTextColor}]}>{task.description}</Text>)}
          <View style={styles.taskMeta}>
            {task.date && (<><View style={styles.taskMetaTextContainer}><Calendar size={12} color={metaIconAndTextColor} /><Text style={[styles.taskMetaText, {color: metaIconAndTextColor}]}>{task.date}</Text></View><Text style={[styles.taskMetaText, {marginHorizontal: 4, color: metaIconAndTextColor}]}>•</Text></>)}
            <View style={[styles.priorityBadge, { backgroundColor: priorityStyles.backgroundColor, borderColor: priorityStyles.borderColor }]}><Text style={[styles.priorityBadgeText, { color: priorityStyles.color }]}>{task.priority}</Text></View>
          </View>
        </View>
        {/* Delete task button */}
        <TouchableOpacity onPress={() => deleteTask(task.id)} style={styles.taskActions}><Trash2 size={16} color={theme.mutedText} /></TouchableOpacity>
      </View>
    );
  };

  // --- Main Component Return JSX ---
  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* Hamburger Menu Button - Only displayed on Mobile */}
      {isMobile && ( // Conditionally render menu button for mobile layout
        <TouchableOpacity style={styles.menuButton} onPress={toggleDrawer}>
          {isDrawerOpen ? <XIcon color={theme.icon} size={28} /> : <MenuIcon color={theme.icon} size={28} />}
        </TouchableOpacity>
      )}
      <View style={styles.flexRow}>
        {/* Sidebar / Drawer */}
        {/* For Web: Always rendered as part of normal layout. */}
        {/* For Mobile: Rendered as an absolutely positioned drawer. Its `left` style, based on `isDrawerOpen`, handles visibility. */}
        {/* The conditional rendering `(!isMobile || isDrawerOpen)` can be removed if left style is sufficient. Or keep for perf on mobile when closed. */}
        {/* Let's keep the sidebar always in the JSX tree for simpler style logic on mobile. The style itself will hide it. */}
        <ScrollView
            style={styles.sidebar} // Applies responsive styles for web sidebar or mobile drawer
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 20}}>
            <View style={styles.sidebarHeader}>
                {isMobile && <View style={styles.menuButtonPlaceholder} /> } {/* Spacer for mobile to help center title if menu icon was inline */}
                <Text style={styles.sidebarTitle}>Task Manager</Text>
                {/* On mobile, dark mode toggle might be moved into drawer items if header space is tight with centered title and X button */}
                {/* On web, it's fine */}
                {!isMobile && ( // Dark mode toggle for web sidebar header
                     <TouchableOpacity onPress={toggleDarkMode} style={styles.darkModeToggle}>
                        {darkMode ? <Sun size={18} color={theme.yellow300} /> : <Moon size={18} color={AppColors.light.icon} />}
                        {/* Used AppColors.light.icon for moon, assuming theme.icon may not be specific enough if reused */}
                    </TouchableOpacity>
                )}
                 {/* If using an absolute menu button on top left for mobile, a balancing spacer is needed if title is truly centered */}
                {isMobile && <View style={styles.menuButtonPlaceholder} /> } {/* Another spacer for mobile title centering */}
            </View>
            {/* Navigation Items */}
            <View> {/* Nav Items Wrapper */}
                <TouchableOpacity onPress={() => { setActiveTab("dashboard"); if (isMobile) toggleDrawer(); }} style={[styles.navItem, activeTab === "dashboard" && styles.navItemActive]}>
                    <BarChart2 size={18} color={activeTab === "dashboard" ? theme.activeNavItemTextColor : theme.navItemTextColor} />
                    <Text style={[styles.navItemText, activeTab === "dashboard" && styles.navItemTextActive]}>Dashboard</Text>
                </TouchableOpacity>
                {/* ... Other Nav Items (Pending, Completed) with same pattern ... */}
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
                 {/* Dark mode toggle inside drawer items for mobile */}
                 {isMobile && ( // Dark mode toggle specific for mobile drawer
                    <TouchableOpacity onPress={() => { toggleDarkMode(); /* Optionally close drawer: if (isMobile) toggleDrawer(); */ }} style={styles.darkModeToggleInDrawer}>
                        <Text style={[styles.navItemText, {color: theme.text, marginLeft: 0 }]}>{darkMode ? "Light Mode" : "Dark Mode"}</Text>
                        {darkMode ? <Sun size={18} color={theme.yellow300} /> : <Moon size={18} color={theme.icon} />}
                    </TouchableOpacity>
                 )}
            </View>
            {/* Stats Container: visibility handled by its own style based on isMobile & isDrawerOpen */}
            <View style={styles.statsContainer}>
                <Text style={styles.statsTitle}>Statistics</Text>
                {/* Completion Rate Card */}
                <View style={styles.statCard}>
                    <View style={styles.statRow}><Text style={styles.statLabel}>Completion</Text><Text style={styles.statValue}>{stats.completionRate}%</Text></View>
                    <View style={styles.progressBarContainer}><View style={[styles.progressBar, { width: `${stats.completionRate}%` }]} /></View>
                </View>
                {/* Total & Pending Grid */}
                <View style={styles.statGrid}>
                    <View style={styles.statGridItem}><Text style={styles.statGridLabel}>Total</Text><Text style={styles.statGridValue}>{stats.total}</Text></View>
                    <View style={styles.statGridItem}><Text style={styles.statGridLabel}>Pending</Text><Text style={styles.statGridValue}>{stats.pending}</Text></View>
                </View>
                {/* Priority Breakdown Card */}
                <View style={[styles.statCard, {marginTop:12 /* From old inline style*/}]}>
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
          {/* Header for the main content (e.g., "All Tasks") */}
          <View style={styles.header}>
              {isMobile && <View style={styles.headerMenuPlaceholder} />} {/* Invisible spacer for mobile to help center title if main menu icon is absolute */}
              <Text style={styles.headerTitle}>
                {activeTab === "dashboard" ? "All Tasks" : activeTab === "pending" ? "Pending Tasks" : "Completed Tasks"}
              </Text>
              {isMobile && <View style={styles.headerMenuPlaceholder} />} {/* Another spacer if needed for centering on mobile */}
          </View>
          {/* FlatList for displaying tasks */}
          <FlatList
            ListHeaderComponent={<>
                {/* Add New Task Form (only on Dashboard tab) */}
                {activeTab === "dashboard" && (
                  <View style={styles.formContainer}>
                    <Text style={styles.formTitle}>Add New Task</Text>
                    {/* Title Input */}
                    <View style={styles.formGroup}><Text style={styles.label}>Title *</Text><TextInput style={[styles.input, titleError && styles.inputError]} value={newTask.title} onChangeText={(text) => { setNewTask({...newTask, title: text}); if (text.trim()) setTitleError(""); }} placeholder="What needs to be done?" placeholderTextColor={theme.mutedText} />{titleError && <Text style={styles.errorText}>{titleError}</Text>}</View>
                    {/* Description Input */}
                    <View style={styles.formGroup}><Text style={styles.label}>Description</Text><TextInput style={[styles.input, styles.textArea]} value={newTask.description} onChangeText={(text) => setNewTask({...newTask, description: text})} placeholder="Add details..." placeholderTextColor={theme.mutedText} multiline /></View>
                    {/* Due Date & Priority Row */}
                    <View style={styles.formRow}>
                        <View style={[styles.formGroup, styles.formRowItem]}><Text style={styles.label}>Due Date</Text><TextInput style={[styles.input, dateError && styles.inputError]} value={newTask.date} onChangeText={(text) => { const formatted = formatDateInput(text); setNewTask({...newTask, date: formatted}); if (isValidDate(formatted) || formatted === "") setDateError(""); }} placeholder="MM/DD/YYYY" placeholderTextColor={theme.mutedText} keyboardType="numeric" />{dateError && <Text style={styles.errorText}>{dateError}</Text>}</View>
                        <View style={[styles.formGroup, styles.formRowItem]}><Text style={styles.label}>Priority</Text><View style={styles.priorityButtonsContainer}>
                          {["Low", "Medium", "High"].map((priority) => { // Map through priorities to create buttons
                            const priorityBtnStyle = priorityStyleLookup(priority, colorMode); 
                            const isSelected = newTask.priority === priority;
                            // Dynamic background for selected priority button
                            let selectedButtonBackgroundColor = isSelected ? (darkMode ? priorityBtnStyle.backgroundColor : theme[`text${priority.charAt(0).toUpperCase() + priority.slice(1)}`]) : theme.unselectedPriorityButtonBackground;
                            // Dynamic border for selected priority button
                            let selectedButtonBorderColor = isSelected ? selectedButtonBackgroundColor : theme.unselectedPriorityButtonBorder;
                            // If the semantic key for selected border should be different, define in AppColors. For now, matching BG.
                            // Or if theme[`border${priority.charAt(0).toUpperCase() + priority.slice(1)}`] is preferred for the selected state, use that.
                            return (<TouchableOpacity key={priority} style={[ styles.priorityButton, { backgroundColor: selectedButtonBackgroundColor, borderColor: selectedButtonBorderColor }]} onPress={() => setNewTask({...newTask, priority})}><Text style={[ styles.priorityButtonText, { color: isSelected ? theme.buttonText : theme.text } ]}>{priority}</Text></TouchableOpacity>);
                          })}
                        </View></View>
                    </View>
                    {/* Add Task Button */}
                    <TouchableOpacity style={styles.addTaskButton} onPress={addTask}><Text style={styles.addTaskButtonText}>Add Task</Text></TouchableOpacity>
                  </View>
                )}
                {/* Tasks Due Soon Section (not shown on "Completed" tab) */}
                {dueSoonTasks.length > 0 && activeTab !== "completed" && (
                  <View style={styles.dueSoonSection}><View style={styles.dueSoonHeader}><AlertTriangle size={16} color={theme.dueSoonText} /><Text style={styles.dueSoonTitle}>Tasks Due Soon</Text></View><View style={styles.dueSoonCard}>{dueSoonTasks.map(task => renderTaskItem({ item: task, isDueSoon: true, key: `due-${task.id}` }))}</View></View>
                )}
              </>}
            data={sortedTasks} // Data source for the list (filtered and sorted tasks)
            renderItem={({item}) => renderTaskItem({item, isDueSoon: false})} // Renders each task item
            keyExtractor={item => item.id} // Unique key for each item
            ListEmptyComponent={ /* Component to show when the list is empty */
              (!(activeTab === "dashboard" && (newTask.title || dueSoonTasks.length > 0))) ? ( // Avoid showing empty state if form is partially filled or due soon tasks exist
                <View style={styles.emptyStateContainer}>
                    <List size={48} color={theme.mutedText} style={styles.emptyStateIcon} />
                    <Text style={styles.emptyStateText}>{activeTab === "completed" ? "No Completed Tasks Yet" : "No Tasks"}</Text>
                    <Text style={styles.emptyStateSubText}>{activeTab === "dashboard" ? "Get started by adding a new task." : activeTab === "pending" ? "All caught up! No pending tasks." : "Mark tasks as completed to see them here."}</Text>
                    {activeTab !== "dashboard" && (<TouchableOpacity style={styles.emptyStateButton} onPress={() => setActiveTab("dashboard")}><Text style={styles.emptyStateButtonText}>Go to Dashboard</Text></TouchableOpacity>)}
                </View>
              ) : null 
            }
            contentContainerStyle={{ flexGrow: 1, padding: styles.contentAreaFlatList.padding }} // Ensures empty state can fill height
            showsVerticalScrollIndicator={false}
          />
        </View>
        {/* Overlay to dismiss drawer on mobile */}
        {isMobile && isDrawerOpen && ( // Conditionally render overlay for performance and functionality
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1} // Makes the TouchableOpacity fully opaque and act as a dismiss area
                onPress={toggleDrawer} // Closes drawer on tap
            />
        )}
      </View>
    </SafeAreaView>
  );
}