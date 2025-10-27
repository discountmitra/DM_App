import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AuthDebugger() {
  const { authState, logout } = useAuth();

  const checkStorage = async () => {
    const token = await AsyncStorage.getItem('token');
    const user = await AsyncStorage.getItem('user');
    console.log('Storage check:');
    console.log('Token:', token ? 'Present' : 'Missing');
    console.log('User:', user ? 'Present' : 'Missing');
    console.log('Auth State:', authState);
  };

  const clearStorage = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    console.log('Storage cleared');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Auth Debugger</Text>
      <Text style={styles.status}>
        Status: {authState.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
      </Text>
      <Text style={styles.status}>
        Loading: {authState.isLoading ? 'Yes' : 'No'}
      </Text>
      <Text style={styles.status}>
        User: {authState.user?.name || 'None'}
      </Text>
      
      <TouchableOpacity style={styles.button} onPress={checkStorage}>
        <Text style={styles.buttonText}>Check Storage</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={clearStorage}>
        <Text style={styles.buttonText}>Clear Storage</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    margin: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  status: {
    fontSize: 14,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});
