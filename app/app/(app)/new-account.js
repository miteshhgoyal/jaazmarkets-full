import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/themeContext';
import api from '../../services/api';

const NewAccountScreen = () => {
    const router = useRouter();
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        accountType: 'Real',
        platform: 'MT5',
        accountClass: 'Standard',
        balance: '',
        leverage: '1:1000',
        spreadType: 'Floating',
    });

    const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

    const handleCreate = async () => {
        if (!form.balance || parseFloat(form.balance) < 0) {
            Alert.alert('Error', 'Enter valid balance');
            return;
        }

        setLoading(true);
        try {
            const balance = parseFloat(form.balance);
            await api.post('/trading/accounts', {
                accountType: form.accountType,
                platform: form.platform,
                accountClass: form.accountClass,
                balance,
                currency: 'USD',
                leverage: form.leverage,
                spreadType: form.spreadType,
                commission: form.accountClass === 'Premium' ? '$3.5 per lot' : '$7 per lot',
                freeMargin: balance,
                equity: balance,
                currentEquity: balance,
                floatingPL: '0.00',
                marginLevel: '∞',
                status: 'active',
            });

            Alert.alert('Success', 'Account created', [
                { text: 'OK', onPress: () => router.back() },
            ]);
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to create');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1" style={{ backgroundColor: theme.bgSecondary }}>
            <SafeAreaView edges={['top']} className="flex-1">
                {/* Header */}
                <View
                    className="px-4 py-3 border-b flex-row items-center justify-between"
                    style={{ borderColor: theme.borderPrimary }}
                >
                    <Text
                        className="text-lg font-bold"
                        style={{ color: theme.textPrimary }}
                    >
                        New Account
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: theme.cardBg }}
                    >
                        <Ionicons name="close" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    <View className="p-4">
                        {/* Type & Platform */}
                        <Card theme={theme}>
                            <Row
                                label="Type"
                                options={['Real', 'Demo']}
                                selected={form.accountType}
                                onSelect={(v) => update('accountType', v)}
                                theme={theme}
                            />
                            <Divider />
                            <Row
                                label="Platform"
                                options={['MT5', 'MT4']}
                                selected={form.platform}
                                onSelect={(v) => update('platform', v)}
                                theme={theme}
                            />
                            <Divider />
                            <Row
                                label="Class"
                                options={['Standard', 'Pro', 'Premium']}
                                selected={form.accountClass}
                                onSelect={(v) => update('accountClass', v)}
                                theme={theme}
                            />
                        </Card>

                        {/* Balance */}
                        <Card theme={theme}>
                            <Text
                                className="text-xs font-semibold uppercase mb-2"
                                style={{ color: theme.textTertiary }}
                            >
                                Balance
                            </Text>
                            <View className="flex-row items-center gap-2">
                                <TextInput
                                    placeholder="0.00"
                                    placeholderTextColor={theme.textTertiary}
                                    value={form.balance}
                                    onChangeText={(v) => update('balance', v)}
                                    keyboardType="decimal-pad"
                                    className="flex-1 rounded-lg px-3 py-2.5 text-base"
                                    style={{
                                        backgroundColor: theme.inputBg,
                                        borderWidth: 1,
                                        borderColor: theme.inputBorder,
                                        color: theme.textPrimary
                                    }}
                                />
                                <View
                                    className="rounded-lg px-4 py-2.5"
                                    style={{
                                        backgroundColor: theme.inputBg,
                                        borderWidth: 1,
                                        borderColor: theme.inputBorder
                                    }}
                                >
                                    <Text
                                        className="font-medium"
                                        style={{ color: theme.textPrimary }}
                                    >
                                        USD
                                    </Text>
                                </View>
                            </View>
                        </Card>

                        {/* Leverage */}
                        <Card theme={theme}>
                            <Text
                                className="text-xs font-semibold uppercase mb-2"
                                style={{ color: theme.textTertiary }}
                            >
                                Leverage
                            </Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View className="flex-row gap-2">
                                    {['1:50', '1:100', '1:200', '1:500', '1:1000', '1:2000'].map((lev) => (
                                        <TouchableOpacity
                                            key={lev}
                                            onPress={() => update('leverage', lev)}
                                            className="px-4 py-2 rounded-lg"
                                            style={{
                                                backgroundColor: form.leverage === lev ? theme.primary : theme.inputBg,
                                                borderWidth: form.leverage === lev ? 0 : 1,
                                                borderColor: theme.inputBorder
                                            }}
                                        >
                                            <Text
                                                className="text-sm font-medium"
                                                style={{
                                                    color: form.leverage === lev ? '#fff' : theme.textSecondary
                                                }}
                                            >
                                                {lev}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                        </Card>

                        {/* Spread */}
                        <Card theme={theme}>
                            <Row
                                label="Spread"
                                options={['Floating', 'Fixed']}
                                selected={form.spreadType}
                                onSelect={(v) => update('spreadType', v)}
                                theme={theme}
                            />
                        </Card>

                        {/* Create Button */}
                        <TouchableOpacity
                            onPress={handleCreate}
                            disabled={loading}
                            className="py-3.5 rounded-lg flex-row items-center justify-center"
                            style={{
                                backgroundColor: theme.primary,
                                opacity: loading ? 0.5 : 1
                            }}
                        >
                            <Ionicons name="add" size={18} color="#fff" />
                            <Text className="text-white font-bold ml-1.5">
                                {loading ? 'Creating...' : 'Create Account'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

// Compact Components
const Card = ({ children, theme }) => (
    <View
        className="rounded-lg p-4 mb-4"
        style={{ backgroundColor: theme.cardBg }}
    >
        {children}
    </View>
);

const Row = ({ label, options, selected, onSelect, theme }) => (
    <View>
        <Text
            className="text-xs font-semibold uppercase mb-2"
            style={{ color: theme.textTertiary }}
        >
            {label}
        </Text>
        <View className="flex-row gap-2">
            {options.map((opt) => (
                <TouchableOpacity
                    key={opt}
                    onPress={() => onSelect(opt)}
                    className="flex-1 py-2 rounded-lg"
                    style={{
                        backgroundColor: selected === opt ? theme.primary : theme.inputBg,
                        borderWidth: selected === opt ? 0 : 1,
                        borderColor: theme.inputBorder
                    }}
                >
                    <Text
                        className="text-center text-sm font-medium"
                        style={{
                            color: selected === opt ? '#fff' : theme.textSecondary
                        }}
                    >
                        {opt}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    </View>
);

const Divider = () => <View className="h-4" />;

export default NewAccountScreen;
