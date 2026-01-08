import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ImageToPdfScreen from '../screens/PdfToImageScreen';
import HistoryScreen from '../screens/HistoryScreen';
import MergePdfScreen from '../screens/MergePdfScreen';
import BasicOcrScreen from '../screens/BasicOcrScreen';
import SummaryScreen from '../screens/SummaryScreen';
import SettingScreen from '../screens/SettingScreen';
import ScanDocumentScreen from "../screens/ScanDocumentScreen";
const Stack = createNativeStackNavigator();

export default function StackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />

            {/* Normal features */}
            <Stack.Screen name="PdfToImageScreen" component={ImageToPdfScreen} />
            <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
            <Stack.Screen name="MergePdfScreen" component={MergePdfScreen} />
            <Stack.Screen name="BasicOcrScreen" component={BasicOcrScreen} />
            <Stack.Screen name="SettingScreen" component={SettingScreen} />
            <Stack.Screen name="ScanDocumentScreen" component={ScanDocumentScreen} />
            {/* AI Tools */}
            <Stack.Screen name="SummaryScreen" component={SummaryScreen} />
        </Stack.Navigator>
    );
}
