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
} from "lucide-react-native"; // Use lucide-react-native

// Enable LayoutAnimation for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AppColors = {
  light: {
    background: "#F9FAFB", // gray-50
    text: "#1F2937", // gray-800
    card: "#FFFFFF", // white
    border: "#E5E7EB", // gray-200
    primary: "#6D28D9", // violet-700
    primaryLight: "#EDE9FE", // violet-50
    primaryText: "#5B21B6", // violet-700
    icon: "#4B5563", // gray-600
    mutedText: "#6B7280", // gray-500
    error: "#DC2626", // red-600
    buttonText: "#FFFFFF", // For text on colored buttons
    completedIcon: "#16A34A", // Green for completed checkmark

    // Priority specific
    lowBg: "#D1FAE5",    // Light green background 
    textLow: "#065F46",  // Dark green text (for badges)
    borderLow: "#A7F3D0",// Light green border
    
    mediumBg: "#FFF7ED", // Light orange background
    textMedium: "#D97706", // Dark orange text (for badges)
    borderMedium: "#FED7AA",// Light orange border
    
    highBg: "#FEE2E2", // red-100
    textHigh: "#B91C1C", // red-800 (for badges)
    borderHigh: "#FECACA", // red-200

    // Other specific colors
    countBadgeGreenBg: "#D1FAE5", // For sidebar completed count
    countBadgeGreenText: "#065F46",
    dueSoonCardBg: "#FFF3E0", // A specific orange for Due Soon card
    dueSoonText: "#C2410C", 
    dueSoonBorder: "#FFE0B2",
    
    gray800: '#1F2937',
    gray900: '#111827',
    gray700: '#374151',
    gray400: '#9CA3AF',
    gray300: '#D1D4DB',
    gray200: '#E5E7EB',
    yellow300: '#FDE047', // For Moon icon
    violet600: '#7C3AED',
    violet100: '#EDE9FE',
    violet800: '#5B21B6',
    violet900: '#4C1D95',
    green800: '#065F46',
    green200: '#A7F3D0',
    orange300: '#FDBA74', // For due soon alert icon
    red600: '#DC2626',
    red400: '#F87171',
    red300: '#FCA5A5',
    red700: '#B91C1C',
  },
  dark: {
    background: "#111827", // gray-900
    text: "#F3F4F6", // gray-100
    card: "#1F2937", // gray-800
    border: "#374151", // gray-700 / gray-800
    primary: "#8B5CF6", // violet-500
    primaryLight: "#4C1D95", 
    primaryText: "#DDD6FE", // violet-100
    icon: "#9CA3AF", // gray-400
    mutedText: "#9CA3AF", // gray-400
    error: "#F87171", // red-400
    buttonText: "#FFFFFF",
    completedIcon: "#22C55E", // Green for completed checkmark

    // Priority specific
    lowBg: "#064E3B",    // Dark green background
    textLow: "#6EE7B7",  // Light green text (for badges)
    borderLow: "#052e16", // Darker green border
    
    mediumBg: "#7C2D12", // Dark orange background
    textMedium: "#FDBA74", // Light orange text (for badges)
    borderMedium: "#9A3412",// Medium-dark orange border
    
    highBg: "#7F1D1D", // red-900
    textHigh: "#F87171", // red-400 (for badges)
    borderHigh: "#991B1B", // red-800

    // Other specific colors
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
    yellow300: '#FDE047',
    violet600: '#7C3AED',
    violet100: '#EDE9FE',
    violet800: '#5B21B6',
    violet900: '#4C1D95',
    green800: '#065F46',
    green200: '#A7F3D0',
    orange300: '#FDBA74',
    red600: '#DC2626',
    red400: '#F87171',
    red300: '#FCA5A5',
    red700: '#B91C1C',
  },
};


export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    date: "",
    priority: "Low" // Default priority
  });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dateError, setDateError] = useState("");
  const [titleError, setTitleError] = useState("");
  // const [animation, setAnimation] = useState(""); // Not used, replaced with LayoutAnimation
  const [darkMode, setDarkMode] = useState(false); // Or use useColorScheme() from react-native

  const theme = darkMode ? AppColors.dark : AppColors.light;

  // Priority colors adapted for StyleSheet
  const priorityStyleLookup = (priority, mode) => {
    const pColors = AppColors[mode];
    switch (priority) {
      case "Low": return { backgroundColor: pColors.lowBg, color: pColors.textLow, borderColor: pColors.borderLow };
      case "Medium": return { backgroundColor: pColors.mediumBg, color: pColors.textMedium, borderColor: pColors.borderMedium };
      case "High": return { backgroundColor: pColors.highBg, color: pColors.textHigh, borderColor: pColors.borderHigh };
      default: return { backgroundColor: pColors.lowBg, color: pColors.textLow, borderColor: pColors.borderLow };
    }
  };
  const colorMode = darkMode ? "dark" : "light";

  const addTask = () => {
    if (newTask.title.trim() === "") {
      setTitleError("Title is required");
      return;
    }
    if (newTask.date && !isValidDate(newTask.date)) {
      setDateError("Please enter a valid date in MM/DD/YYYY format");
      return;
    }

    const task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      date: newTask.date,
      priority: newTask.priority || "Low",
      completed: false,
      createdAt: new Date()
    };
    
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(prev => [...prev, task]);
    setNewTask({ title: "", description: "", date: "", priority: "Low" });
    setTitleError("");
    setDateError("");
  };

  const isValidDate = (dateStr) => {
    if (!dateStr) return true;
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (!regex.test(dateStr)) return false;
    const [month, day, year] = dateStr.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    return date.getMonth() === month - 1 && date.getDate() === day && date.getFullYear() === year;
  };

  const formatDateInput = (value) => {
    const digits = value.replace(/\D/g, "").substring(0, 8);
    let formatted = "";
    if (digits.length > 0) {
      formatted += digits.substring(0, 2);
      if (digits.length > 2) {
        formatted += "/" + digits.substring(2, 4);
        if (digits.length > 4) {
          formatted += "/" + digits.substring(4, 8);
        }
      }
    }
    return formatted;
  };

  const toggleTaskCompletion = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (activeTab === "pending") return !task.completed;
    if (activeTab === "completed") return task.completed;
    return true;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    pending: tasks.filter(task => !task.completed).length,
    low: tasks.filter(task => task.priority === "Low").length,
    medium: tasks.filter(task => task.priority === "Medium").length,
    high: tasks.filter(task => task.priority === "High").length,
    completionRate: tasks.length > 0 
      ? Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100) 
      : 0
  };

  const getDueSoonTasks = () => {
    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);
    return tasks.filter(task => {
      if (!task.date || task.completed) return false;
      const [month, day, year] = task.date.split("/").map(Number);
      const taskDate = new Date(year, month - 1, day);
      return taskDate >= today && taskDate <= threeDaysLater;
    });
  };

  const dueSoonTasks = getDueSoonTasks();

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const priorityOrder = { "High": 0, "Medium": 1, "Low": 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (a.date && b.date) {
      const dateA = new Date(a.date.split("/").reverse().join("-"));
      const dateB = new Date(b.date.split("/").reverse().join("-"));
      if (dateA.getTime() !== dateB.getTime()) return dateA - dateB;
    } else if (a.date) {
        return -1; // tasks with dates first
    } else if (b.date) {
        return 1;
    }
    return a.createdAt - b.createdAt;
  });

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const styles = StyleSheet.create({
    // Global container
    screenContainer: { flex: 1, backgroundColor: theme.background },
    flexRow: { flexDirection: "row" },
    flex1: { flex: 1 },
    // Sidebar
    sidebar: {
      // Explicitly set width and prevent flex growth/shrink
      width: 280,         // Let's try a small, definite width like 100 for testing
      flexGrow: 0,        // IMPORTANT: Prevent the sidebar from growing
      flexShrink: 0,      // IMPORTANT: Prevent shrinking (it should obey width)
      paddingHorizontal: 8, // Reduce padding for testing
      paddingVertical: 16,
      backgroundColor: darkMode ? theme.gray900 : theme.card,
      borderRightWidth: 1,
      borderColor: darkMode ? theme.gray800 : theme.border,
      // For extreme testing:
      // width: 50,
      // padding: 0,
      // backgroundColor: 'red', // Make it obvious
    },
    mainContent: {
      flex: 1, // This should take up ALL remaining space
      // For extreme testing:
      // backgroundColor: 'blue', // Make it obvious
    },
    sidebarHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }, // mb-6
    sidebarTitle: { fontSize: 20, fontWeight: "bold", color: theme.text }, // text-xl
    darkModeToggle: {
      padding: 8, // p-2
      borderRadius: 999, // rounded-full
      backgroundColor: darkMode ? theme.gray800 : theme.gray200,
    },
    navItem: {
      flexDirection: "row", alignItems: "center", width: "100%", paddingHorizontal: 16, paddingVertical: 10, // px-4 py-2.5
      borderRadius: 8, // rounded-lg
      marginBottom: 4, // space-y-1
    },
    navItemActive: {
      backgroundColor: darkMode ? theme.violet900 : theme.violet100,
      // color set in Text below
    },
    navItemText: { color: darkMode ? theme.gray300 : theme.gray700, marginLeft: 12 }, // mr-3 for icon
    navItemTextActive: { color: darkMode ? theme.violet100 : theme.violet800, fontWeight: "500" },
    badge: {
      marginLeft: "auto", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, fontSize: 12,
      backgroundColor: darkMode ? theme.violet800 : theme.violet100,
      color: darkMode ? theme.violet200 : theme.violet800,
      overflow: 'hidden', // for iOS text clipping
    },
    badgeCompleted: { // Example for completed tasks if different color
      backgroundColor: darkMode ? theme.green800 : theme.green200,
      color: darkMode ? theme.green200 : theme.green800,
    },
    statsContainer: { marginTop: 32, paddingTop: 24, borderTopWidth: 1, borderColor: darkMode ? theme.gray800: theme.gray700 },
    statsTitle: { fontSize: 12, fontWeight: "500", color: darkMode ? theme.gray400 : theme.gray400, marginBottom: 16 },
    statCard: {
        backgroundColor: darkMode ? theme.gray900 : theme.card, // bg-white or gray-900 (using card will show borders better)
        borderColor: darkMode ? theme.gray800 : theme.border,
        borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 // p-3, space-y-3
    },
    statRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
    statLabel: { fontSize: 14, color: darkMode ? theme.gray400 : theme.mutedText },
    statValue: { fontSize: 14, fontWeight: "500", color: theme.text },
    progressBarContainer: { width: "100%", backgroundColor: darkMode ? theme.gray800 : theme.gray200, borderRadius: 999, height: 8 },
    progressBar: { backgroundColor: theme.violet600, height: 8, borderRadius: 999 },
    statGrid: { flexDirection: "row", justifyContent: "space-between", gap: 8 }, // grid-cols-2 gap-2
    statGridItem: { flex: 1, backgroundColor: darkMode ? theme.gray900 : theme.card, borderWidth:1, borderColor: darkMode ? theme.gray800 : theme.border, borderRadius: 8, padding: 12 },
    statGridLabel: { fontSize: 12, color: darkMode ? theme.gray400 : theme.mutedText },
    statGridValue: { fontSize: 24, fontWeight: "600", color: theme.text }, // text-xl
    priorityBreakdown: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", fontSize: 12 },
    priorityItem: { flexDirection: "row", alignItems: "center" },
    priorityDot: { width: 12, height: 12, borderRadius: 6, marginRight: 4 },
    // Main Content
    mainContent: { flex: 1, backgroundColor: theme.background },
    header: {
      backgroundColor: darkMode ? theme.gray900 : theme.card,
      borderBottomWidth: 1,
      borderColor: darkMode ? theme.gray800 : theme.border,
      paddingHorizontal: 24, // px-6
      paddingVertical: 16,   // py-4
    },
    headerTitle: { fontSize: 20, fontWeight: "600", color: theme.text },
    contentArea: { flex: 1, padding: 24 }, // p-6
    // Task Form
    formContainer: {
      backgroundColor: darkMode ? theme.gray900 : theme.card,
      borderColor: darkMode ? theme.gray800 : theme.border,
      borderWidth:1, borderRadius: 8, padding: 24, marginBottom: 24
    },
    formTitle: { fontSize: 18, fontWeight: "500", color: theme.text, marginBottom: 16 },
    formGroup: { marginBottom: 16 }, // space-y-4 (applied to each group div)
    label: { fontSize: 14, fontWeight: "500", color: darkMode ? theme.gray300 : theme.gray700, marginBottom: 4 },
    input: {
      width: "100%", paddingHorizontal: 12, paddingVertical: Platform.OS === 'ios' ? 12 : 8, // py-2 with adjustments
      borderWidth: 1, borderRadius: 6, // rounded-md
      backgroundColor: darkMode ? theme.gray800 : theme.card,
      borderColor: darkMode ? theme.gray700 : theme.gray300,
      color: theme.text,
      fontSize: 14,
    },
    inputError: {
        borderColor: darkMode ? theme.red700 : theme.red300,
    },
    textArea: { minHeight: 60, textAlignVertical: "top" }, // rows=2
    errorText: { marginTop: 4, fontSize: 12, color: darkMode ? theme.red400 : theme.red600 },
    formRow: { flexDirection: "row", justifyContent: "space-between", gap: 16 }, // grid grid-cols-2 gap-4
    formRowItem: { flex: 1 },
    priorityButtonsContainer: { flexDirection: "row", gap: 8 }, // space-x-2
    priorityButton: {
      flex: 1, paddingVertical: 10, paddingHorizontal: 6, // py-2 px-3
      borderRadius: 6, borderWidth: 1, alignItems: 'center',
    },
    priorityButtonText: { fontSize: 14, fontWeight: "500" },
    addTaskButton: {
      backgroundColor: theme.violet600, // Using violet-600 directly
      width: "100%", paddingVertical: 10, borderRadius: 6, alignItems: "center", marginTop: 8, // pt-2 for the button wrapper div
    },
    addTaskButtonText: { color: theme.buttonText, fontSize: 14, fontWeight: "500" },
    // Due Soon
    dueSoonSection: { marginBottom: 24 },
    dueSoonHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
    dueSoonTitle: { fontSize: 14, fontWeight: "500", color: darkMode ? theme.orange300 : AppColors.light.textOrange, marginLeft: 8 },
    dueSoonCard: {
      backgroundColor: darkMode ? theme.orangeBg : AppColors.light.orangeBg,
      borderColor: darkMode ? theme.orangeBg : AppColors.light.borderOrange, // border color fixed for dark/light orange
      borderWidth: 1, borderRadius: 8, overflow: "hidden"
    },
    // Task Item (generic for due soon and regular list)
    taskItemContainer: {
      flexDirection: "row", alignItems: "flex-start", padding: 16, // p-4
      borderBottomWidth: 1,
      // border color set dynamically
    },
    taskItemContent: { flex: 1, minWidth: 0, marginLeft: 12 }, // mr-3 on icon
    taskTitle: { fontSize: 14, fontWeight: "500", color: theme.text },
    taskTitleCompleted: { textDecorationLine: "line-through", color: darkMode ? theme.gray400 : theme.mutedText },
    taskDescription: { marginTop: 4, fontSize: 12, color: darkMode ? theme.gray400 : theme.mutedText },
    taskDescriptionCompleted: { color: darkMode ? theme.gray400 : theme.mutedText }, // Original was darker in dark mode
    taskMeta: { marginTop: 8, flexDirection: "row", flexWrap: 'wrap', alignItems: "center", gap: 8 }, // gap-y-1 means flexWrap
    taskMetaText: { fontSize: 12, color: darkMode ? theme.gray400 : theme.mutedText, flexDirection: 'row', alignItems: 'center' },
    priorityBadge: {
      paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, fontSize: 12, fontWeight: "500",
      overflow: 'hidden', // for iOS text clipping
      // bg/text color set dynamically via priorityStyleLookup
    },
    taskActions: { marginLeft: 8 }, // ml-2
    // Empty State
    emptyStateContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 48 },
    emptyStateText: { marginTop: 8, fontSize: 14, fontWeight: "500", color: theme.text },
    emptyStateSubText: { marginTop: 4, fontSize: 14, color: darkMode ? theme.gray400 : theme.mutedText },
    emptyStateButton: {
      marginTop: 24, backgroundColor: theme.violet600, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 6,
    },
    emptyStateButtonText: { color: theme.buttonText, fontSize: 14, fontWeight: "500" },
  });
  
  const renderTaskItem = ({ item: task }) => {
    const priorityStyle = priorityStyleLookup(task.priority, colorMode);
    const isCompleted = task.completed;

    return (
      <View style={[
          styles.taskItemContainer,
          { borderColor: darkMode ? theme.gray800 : theme.border },
          isCompleted && { backgroundColor: darkMode ? '#1E293B' /* slightly darker gray-800 */ : '#F9FAFB' /* gray-50 */ }
        ]}
      >
        <TouchableOpacity onPress={() => toggleTaskCompletion(task.id)} style={{ marginTop: 2 }}>
          {isCompleted ? (
            <CheckCircle size={20} color={AppColors.light.green800} /> // Hardcoded green for completed
          ) : (
            <Circle size={20} color={darkMode ? theme.gray400 : theme.mutedText} />
          )}
        </TouchableOpacity>

        <View style={styles.taskItemContent}>
          <Text style={[styles.taskTitle, isCompleted && styles.taskTitleCompleted]}>
            {task.title}
          </Text>
          {task.description && (
            <Text style={[styles.taskDescription, isCompleted && styles.taskDescriptionCompleted]}>
              {task.description}
            </Text>
          )}
          <View style={styles.taskMeta}>
            {task.date && (
              <>
                <View style={styles.taskMetaText}>
                  <Calendar size={12} color={darkMode ? theme.gray400 : theme.mutedText} style={{ marginRight: 4 }} />
                  <Text style={styles.taskMetaText}>{task.date}</Text>
                </View>
                <Text style={[styles.taskMetaText, {marginHorizontal: 4}]}>•</Text>
              </>
            )}
            <View style={[styles.priorityBadge, { backgroundColor: priorityStyle.backgroundColor }]}>
               <Text style={{ color: priorityStyle.color, fontSize: 12, fontWeight: '500' }}>{task.priority}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={() => deleteTask(task.id)} style={styles.taskActions}>
          <Trash2 size={16} color={darkMode ? theme.gray400 : theme.mutedText} />
        </TouchableOpacity>
      </View>
    );
  };

   const renderDueSoonTaskItem = ({ item: task }) => {
    const priorityStyle = priorityStyleLookup(task.priority, colorMode);
    const dueSoonColors = AppColors[colorMode];
    
    return (
      <View style={[
        styles.taskItemContainer,
        { borderColor: darkMode ? dueSoonColors.orangeBg : dueSoonColors.borderOrange }, // Use orange shades for border
        { borderBottomWidth: 1} // ensure border if last item
      ]}
      >
        <TouchableOpacity onPress={() => toggleTaskCompletion(task.id)} style={{ marginTop: 2}}>
           <Circle size={20} color={darkMode ? dueSoonColors.orange300 : dueSoonColors.textOrange} />
        </TouchableOpacity>

        <View style={styles.taskItemContent}>
          <Text style={[styles.taskTitle, { color: theme.text}]}>{task.title}</Text>
          {task.description && (
            <Text style={[styles.taskDescription, {color: theme.mutedText}]}>{task.description}</Text>
          )}
          <View style={styles.taskMeta}>
            <View style={styles.taskMetaText}>
                <Calendar size={12} color={darkMode ? dueSoonColors.orange300 : dueSoonColors.textOrange} style={{ marginRight: 4 }} />
                <Text style={[styles.taskMetaText, {color: darkMode ? dueSoonColors.orange300 : dueSoonColors.textOrange}]}>{task.date}</Text>
            </View>
             <Text style={[styles.taskMetaText, {marginHorizontal: 4, color: darkMode ? dueSoonColors.orange300 : dueSoonColors.textOrange}]}>•</Text>
             <View style={[styles.priorityBadge, { backgroundColor: priorityStyle.backgroundColor, borderColor: priorityStyle.borderColor }]}>
               <Text style={{ color: priorityStyle.color, fontSize: 12, fontWeight: '500' }}>{task.priority}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity onPress={() => deleteTask(task.id)} style={styles.taskActions}>
          <Trash2 size={16} color={darkMode ? theme.gray400 : theme.mutedText} />
        </TouchableOpacity>
      </View>
    );
  };


  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.flexRow}>
        {/* Sidebar */}
        <ScrollView style={styles.sidebar} showsVerticalScrollIndicator={false}>
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarTitle}>Task Manager</Text>
            <TouchableOpacity onPress={toggleDarkMode} style={styles.darkModeToggle}>
              {darkMode ? <Sun size={20} color={theme.yellow300} /> : <Moon size={20} color={theme.gray700} />}
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            onPress={() => setActiveTab("dashboard")}
            style={[styles.navItem, activeTab === "dashboard" && styles.navItemActive]}
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
            {stats.pending > 0 && (
                <Text style={styles.badge}>{stats.pending}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setActiveTab("completed")}
            style={[styles.navItem, activeTab === "completed" && styles.navItemActive]}
          >
            <CheckSquare size={20} color={activeTab === "completed" ? (darkMode ? theme.violet100 : theme.violet800) : (darkMode ? theme.gray300 : theme.gray700)} />
            <Text style={[styles.navItemText, activeTab === "completed" && styles.navItemTextActive]}>Completed Tasks</Text>
            {stats.completed > 0 && (
                <Text style={[styles.badge, styles.badgeCompleted]}>{stats.completed}</Text>
            )}
          </TouchableOpacity>
          
          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>STATISTICS</Text>
            <View style={styles.statCard}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Completion Rate</Text>
                <Text style={styles.statValue}>{stats.completionRate}%</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${stats.completionRate}%` }]} />
              </View>
            </View>
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
             <View style={[styles.statCard, {marginTop: 12}]}>
                <Text style={[styles.statGridLabel, { marginBottom: 8 }]}>Priority Breakdown</Text>
                <View style={styles.priorityBreakdown}>
                    {/* --- DOT FOR LOW PRIORITY --- */}
                    <View style={styles.priorityItem}>
                        <View style={[
                            styles.priorityDot,
                            {
                                backgroundColor: theme.textLow,      // CORRECTED: Was theme.lowBg
                                borderColor: theme.borderLow,    // Keeping borderLow for light mode
                                borderWidth: 1
                            }
                        ]} />
                        <Text style={{color: theme.text, fontSize: 12}}>Low: {stats.low}</Text>
                    </View>

                    {/* --- DOT FOR MEDIUM PRIORITY --- */}
                    <View style={styles.priorityItem}>
                        <View style={[
                            styles.priorityDot,
                            {
                                backgroundColor: theme.textMedium,   // CORRECTED: Was theme.mediumBg
                                borderColor: theme.borderMedium, // Keeping borderMedium for light mode
                                borderWidth: 1
                            }
                        ]} />
                         <Text style={{color: theme.text, fontSize: 12}}>Medium: {stats.medium}</Text>
                    </View>

                    {/* --- DOT FOR HIGH PRIORITY --- */}
                    <View style={styles.priorityItem}>
                        <View style={[
                            styles.priorityDot,
                            {
                                backgroundColor: theme.textHigh,     // CORRECTED: Was theme.highBg
                                borderColor: theme.borderHigh,   // Keeping borderHigh for light mode
                                borderWidth: 1
                            }
                        ]} />
                         <Text style={{color: theme.text, fontSize: 12}}>High: {stats.high}</Text>
                    </View>
                </View>
            </View>
          </View>
        </ScrollView>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {activeTab === "dashboard" ? "All Tasks" : 
               activeTab === "pending" ? "Pending Tasks" : "Completed Tasks"}
            </Text>
          </View>
          
          <ScrollView style={styles.contentArea} contentContainerStyle={{flexGrow: 1}}>
            {activeTab === "dashboard" && (
              <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Add New Task</Text>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Title *</Text>
                  <TextInput
                    style={[styles.input, titleError && styles.inputError]}
                    value={newTask.title}
                    onChangeText={(text) => {
                      setNewTask({...newTask, title: text});
                      if (text.trim()) setTitleError("");
                    }}
                    placeholder="What needs to be done?"
                    placeholderTextColor={theme.mutedText}
                  />
                  {titleError && <Text style={styles.errorText}>{titleError}</Text>}
                </View>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Description</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={newTask.description}
                    onChangeText={(text) => setNewTask({...newTask, description: text})}
                    placeholder="Add details..."
                    placeholderTextColor={theme.mutedText}
                    multiline
                  />
                </View>
                <View style={styles.formRow}>
                    <View style={[styles.formGroup, styles.formRowItem]}>
                        <Text style={styles.label}>Due Date</Text>
                        <TextInput
                            style={[styles.input, dateError && styles.inputError]}
                            value={newTask.date}
                            onChangeText={(text) => {
                                const formatted = formatDateInput(text);
                                setNewTask({...newTask, date: formatted});
                                if (isValidDate(formatted) || formatted === "") setDateError("");
                            }}
                            placeholder="MM/DD/YYYY"
                            placeholderTextColor={theme.mutedText}
                            keyboardType="numeric"
                        />
                        {dateError && <Text style={styles.errorText}>{dateError}</Text>}
                    </View>
                    <View style={[styles.formGroup, styles.formRowItem]}>
                        <Text style={styles.label}>Priority</Text>
                        <View style={styles.priorityButtonsContainer}>
                          {["Low", "Medium", "High"].map((priority) => {
                            const priorityBtnStyle = priorityStyleLookup(priority, colorMode); // Used primarily for badges, gives {backgroundColor, color, borderColor}
                            const isSelected = newTask.priority === priority;

                            // Determine the correct background for selected buttons based on mode
                            let selectedButtonBackgroundColor = priorityBtnStyle.backgroundColor; // Default for dark mode

                            if (isSelected && !darkMode) { // If selected AND in light mode
                              switch (priority) {
                                case "Low":
                                  selectedButtonBackgroundColor = theme.textLow; // Use dark green text color as BG
                                  break;
                                case "Medium":
                                  selectedButtonBackgroundColor = theme.textMedium; // Use dark orange text color as BG
                                  break;
                                case "High":
                                  selectedButtonBackgroundColor = theme.textHigh; // Use dark red text color as BG
                                  break;
                              }
                            }
                            
                            // Determine correct border for selected buttons
                            let selectedButtonBorderColor = priorityBtnStyle.borderColor || priorityBtnStyle.backgroundColor;
                            if (isSelected && !darkMode) {
                                selectedButtonBorderColor = selectedButtonBackgroundColor; // Match the new darker BG
                            }


                            return (
                              <TouchableOpacity
                                key={priority}
                                style={[
                                  styles.priorityButton,
                                  isSelected
                                    ? { // SELECTED STYLES
                                        backgroundColor: selectedButtonBackgroundColor,
                                        borderColor: selectedButtonBorderColor,
                                      }
                                    : { // UNSELECTED STYLES
                                        backgroundColor: darkMode ? theme.gray800 : theme.card,
                                        borderColor: darkMode ? theme.gray700 : theme.gray300,
                                      }
                                ]}
                                onPress={() => setNewTask({ ...newTask, priority })}
                              >
                                <Text style={[
                                  styles.priorityButtonText,
                                  // Text is white if selected (now contrasts with darker light-mode BG)
                                  // Text is theme.text (dark) if not selected (contrasts with theme.card)
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
                 <TouchableOpacity style={styles.addTaskButton} onPress={addTask}>
                  <Text style={styles.addTaskButtonText}>Add Task</Text>
                </TouchableOpacity>
              </View>
            )}

            {dueSoonTasks.length > 0 && activeTab !== "completed" && (
              <View style={styles.dueSoonSection}>
                <View style={styles.dueSoonHeader}>
                  <AlertTriangle size={16} color={darkMode ? theme.orange300 : AppColors.light.textOrange} />
                  <Text style={styles.dueSoonTitle}>Tasks Due Soon</Text>
                </View>
                <View style={styles.dueSoonCard}>
                  <FlatList
                    data={dueSoonTasks}
                    renderItem={renderDueSoonTaskItem}
                    keyExtractor={item => item.id}
                    scrollEnabled={false} // if the parent is already ScrollView
                  />
                </View>
              </View>
            )}
            
            {sortedTasks.length > 0 ? (
               <View style={[
                    { backgroundColor: darkMode ? theme.gray900 : theme.card,
                      borderColor: darkMode ? theme.gray800 : theme.border,
                      borderWidth: 1, borderRadius: 8, overflow: 'hidden'}
                ]}>
                <FlatList
                    data={sortedTasks}
                    renderItem={renderTaskItem}
                    keyExtractor={item => item.id}
                    scrollEnabled={false} // if the parent is already ScrollView
                />
               </View>
            ) : (
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