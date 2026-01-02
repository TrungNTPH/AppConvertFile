import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import PdfToTextScreen from '../screens/PdfToTextScreen';
import ImageToPdfScreen from '../screens/ImageToPdfScreen';
import TextToPdfScreen from '../screens/TextToPdfScreen';
import HistoryScreen from '../screens/HistoryScreen';
import MergePdfScreen from '../screens/MergePdfScreen';
import BasicOcrScreen from '../screens/BasicOcrScreen';
import SummaryScreen from '../screens/SummaryScreen';
import FixGrammarScreen from '../screens/FixGrammarScreen';
import SettingScreen from '../screens/SettingScreen';
import ScanDocumentScreen from "../screens/ScanDocumentScreen";
const Stack = createNativeStackNavigator();

export default function StackNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />

            {/* Normal features */}
            <Stack.Screen name="PdfToTextScreen" component={PdfToTextScreen} />
            <Stack.Screen name="ImageToPdfScreen" component={ImageToPdfScreen} />
            <Stack.Screen name="TextToPdfScreen" component={TextToPdfScreen} />
            <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
            <Stack.Screen name="MergePdfScreen" component={MergePdfScreen} />
            <Stack.Screen name="BasicOcrScreen" component={BasicOcrScreen} />
            <Stack.Screen name="SettingScreen" component={SettingScreen} />
            <Stack.Screen name="ScanDocumentScreen" component={ScanDocumentScreen} />
            {/* AI Tools */}
            <Stack.Screen name="SummaryScreen" component={SummaryScreen} />
            <Stack.Screen name="FixGrammarScreen" component={FixGrammarScreen} />
        </Stack.Navigator>
    );
}
