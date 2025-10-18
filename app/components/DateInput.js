import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { useAuth } from '@/context/authContext';

const DateInput = ({ onDateChange, initialDate = null }) => {
    const { isDarkMode } = useAuth();
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [showDayModal, setShowDayModal] = useState(false);
    const [showMonthModal, setShowMonthModal] = useState(false);

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const formatDate = (day, month, year) => {
        if (day && month && year && year.length === 4) {
            const monthIndex = months.indexOf(month) + 1;
            const formattedDate = `${year}-${String(monthIndex).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            return formattedDate;
        }
        return '';
    };

    useEffect(() => {
        const formattedDate = formatDate(selectedDay, selectedMonth, selectedYear);
        if (formattedDate) {
            onDateChange(formattedDate);
        }
    }, [selectedDay, selectedMonth, selectedYear]);

    const DropdownModal = ({ visible, onClose, options, onSelect, title }) => (
        <Modal visible={visible} transparent animationType="fade">
            <View className="flex-1 bg-black/50 justify-center items-center px-8">
                <View className={`${isDarkMode ? 'container-dark' : 'container-light'} rounded-lg p-6 w-full max-h-96`}>
                    <Text className={`${isDarkMode ? 'text-text-dark' : 'text-text-light'} text-lg font-bold text-center mb-4`}>
                        Select {title}
                    </Text>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {options.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    onSelect(option);
                                    onClose();
                                }}
                                className={`py-3 px-4 rounded-lg mb-2 ${isDarkMode ? 'bg-input-dark' : 'bg-input-light'}`}
                            >
                                <Text className={`${isDarkMode ? 'text-text-dark' : 'text-text-light'} text-center text-base`}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <TouchableOpacity
                        onPress={onClose}
                        className="bg-primary rounded-lg py-3 mt-4"
                    >
                        <Text className="text-gray-100 text-center font-semibold">Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    const isValidDate = () => {
        return selectedDay && selectedMonth && selectedYear && selectedYear.length === 4;
    };

    return (
        <View>
            <View className="flex-row gap-3">
                {/* Day Dropdown */}
                <View className="flex-1">
                    <Text className={`${isDarkMode ? 'text-text-dark' : 'text-text-light'} text-xs font-medium mb-1`}>
                        Day
                    </Text>
                    <TouchableOpacity
                        onPress={() => setShowDayModal(true)}
                        className={isDarkMode ? 'input-dark' : 'input-light'}
                    >
                        <Text className={`${isDarkMode ? 'text-text-dark' : 'text-text-light'} text-base text-center`}>
                            {selectedDay || 'Day'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Month Dropdown */}
                <View className="flex-2">
                    <Text className={`${isDarkMode ? 'text-text-dark' : 'text-text-light'} text-xs font-medium mb-1`}>
                        Month
                    </Text>
                    <TouchableOpacity
                        onPress={() => setShowMonthModal(true)}
                        className={isDarkMode ? 'input-dark' : 'input-light'}
                    >
                        <Text className={`${isDarkMode ? 'text-text-dark' : 'text-text-light'} text-base text-center`}>
                            {selectedMonth || 'Month'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Year Input */}
                <View className="flex-1">
                    <Text className={`${isDarkMode ? 'text-text-dark' : 'text-text-light'} text-xs font-medium mb-1`}>
                        Year
                    </Text>
                    <TextInput
                        value={selectedYear}
                        onChangeText={(text) => {
                            if (text.length <= 4 && /^\d*$/.test(text)) {
                                setSelectedYear(text);
                            }
                        }}
                        placeholder="YYYY"
                        placeholderTextColor="#64748b"
                        keyboardType="number-pad"
                        maxLength={4}
                        className={`${isDarkMode ? 'input-dark' : 'input-light'} text-center`}
                    />
                </View>
            </View>

            {/* Display selected date */}
            {isValidDate() && (
                <View className="mt-3 p-2 bg-success/10 rounded-lg">
                    <Text className="text-success text-sm text-center font-medium">
                        ✓ Selected: {selectedDay} {selectedMonth} {selectedYear}
                    </Text>
                </View>
            )}

            {/* Day Modal */}
            <DropdownModal
                visible={showDayModal}
                onClose={() => setShowDayModal(false)}
                options={days}
                onSelect={setSelectedDay}
                title="Day"
            />

            {/* Month Modal */}
            <DropdownModal
                visible={showMonthModal}
                onClose={() => setShowMonthModal(false)}
                options={months}
                onSelect={setSelectedMonth}
                title="Month"
            />
        </View>
    );
};

export default DateInput;
