import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('darkmode');
      if (savedTheme === 'active') {
        setIsDarkMode(true);
      }
    };
    loadTheme();
  }, []);

  const toggleDarkMode = async () => {
    if (isDarkMode) {
      setIsDarkMode(false);
      await AsyncStorage.setItem('darkmode', 'inactive');
    } else {
      setIsDarkMode(true);
      await AsyncStorage.setItem('darkmode', 'active');
    }
  };

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>Settings</Text>
      <TouchableOpacity style={styles.button} onPress={toggleDarkMode}>
        <Text style={styles.buttonText}>Toggle Dark Mode</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightContainer: {
    backgroundColor: '#f7f7f7',
  },
  darkContainer: {
    backgroundColor: '#0b1220',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  lightText: {
    color: '#111827',
  },
  darkText: {
    color: '#e6eef8',
  },
  button: {
    backgroundColor: '#4dabf7',
    padding: 15,
    borderRadius: 10,
    minWidth: 160,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 17,
  },
});
