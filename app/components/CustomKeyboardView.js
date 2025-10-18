import { View, Text, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import React from 'react';

const ios = Platform.OS === 'ios';

const CustomKeyboardView = ({
    children,
    keyboardVerticalOffset = 0,
    scrollViewProps = {}
}) => {
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={ios ? 'padding' : 'height'}
            keyboardVerticalOffset={keyboardVerticalOffset}
        >
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
                bounces={false}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                {...scrollViewProps}
            >
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default CustomKeyboardView;
