import React, { useState, useRef } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Loading from './Loading';

const OTPInput = ({ onComplete, loading, isDarkMode }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputs = useRef([]);

    const handleChangeText = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Auto focus next input
        if (text && index < 5) {
            inputs.current[index + 1]?.focus();
        }

        // Auto submit when all 6 digits are entered
        if (newOtp.every(digit => digit !== '') && text) {
            onComplete(newOtp.join(''));
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleVerify = () => {
        const otpString = otp.join('');
        if (otpString.length === 6) {
            onComplete(otpString);
        }
    };

    return (
        <View>
            {/* OTP Input Boxes */}
            <View className="flex-row justify-between mb-6">
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={ref => inputs.current[index] = ref}
                        value={digit}
                        onChangeText={text => handleChangeText(text, index)}
                        onKeyPress={e => handleKeyPress(e, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        className={isDarkMode ? 'otp-input-dark' : 'otp-input-light'}
                        textAlign="center"
                    />
                ))}
            </View>

            {/* Verify Button */}
            {loading ? (
                <View className='loading-container'>
                    <Loading size="48" />
                </View>
            ) : (
                <TouchableOpacity
                    onPress={handleVerify}
                    disabled={otp.some(digit => digit === '')}
                    className={`rounded-lg overflow-hidden ${otp.some(digit => digit === '') ? 'opacity-50' : ''}`}
                >
                    <LinearGradient
                        colors={['#FF7516', '#BA4000']}
                        className="btn-base"
                    >
                        <Text className="btn-text">
                            Verify Code
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default OTPInput;
