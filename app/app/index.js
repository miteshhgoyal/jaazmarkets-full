import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function Index() {
    return (
        <SafeAreaView className="flex-1 flex-col bg-primary-300 justify-center items-center gap-4">
            <ActivityIndicator size={"large"} color={"orange"} />
        </SafeAreaView>
    );
}

export default Index;