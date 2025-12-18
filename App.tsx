import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator';
import { useEffect } from 'react';
import { getHistoryFiles } from './src/utils/history/historyManager';
import { cleanupHistory } from './src/utils/history/historyCleanup';


export default function App() {
  useEffect(() => {
    getHistoryFiles().then(cleanupHistory);
  }, []);
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}
