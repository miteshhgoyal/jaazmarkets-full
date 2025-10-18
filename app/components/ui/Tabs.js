import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useAuth } from "@/context/authContext";

const Tabs = ({ tabs, activeTab, onTabChange, className = "" }) => {
    const { isDarkMode } = useAuth();

    return (
        <View
            className={`border-b ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-100"} ${className}`}
        >
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="px-4"
            >
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.id}
                        onPress={() => onTabChange(tab.id)}
                        className={`py-4 px-1 mr-4 border-b-2 ${activeTab === tab.id ? "border-primary" : "border-transparent"
                            }`}
                    >
                        <View className="flex-row items-center gap-2">
                            {tab.icon && (
                                <tab.icon
                                    size={16}
                                    color={activeTab === tab.id ? "#3b82f6" : "#9ca3af"}
                                />
                            )}
                            <Text
                                className={`text-sm font-medium ${activeTab === tab.id
                                    ? "text-primary"
                                    : isDarkMode
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                    }`}
                            >
                                {tab.label}
                            </Text>
                            {tab.count !== undefined && (
                                <View
                                    className={`ml-2 px-2 py-1 rounded-full ${activeTab === tab.id
                                        ? "bg-primary/10"
                                        : isDarkMode
                                            ? "bg-gray-700"
                                            : "bg-gray-100"
                                        }`}
                                >
                                    <Text
                                        className={`text-xs ${activeTab === tab.id
                                            ? "text-primary"
                                            : isDarkMode
                                                ? "text-gray-400"
                                                : "text-gray-600"
                                            }`}
                                    >
                                        {tab.count}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

export default Tabs;
