import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { apiRequest, BASE_URL } from '../constants/api';

interface NetworkTest {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  duration?: number;
}

export default function NetworkDebugger() {
  const [tests, setTests] = useState<NetworkTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addTest = (name: string, status: 'pending' | 'success' | 'error', message: string, duration?: number) => {
    setTests(prev => [...prev, { name, status, message, duration }]);
  };

  const runNetworkTests = async () => {
    setIsRunning(true);
    setTests([]);

    // Test 1: Basic connectivity
    addTest('Basic Connectivity', 'pending', 'Testing basic network connectivity...');
    try {
      const start = Date.now();
      const response = await fetch('https://www.google.com', { method: 'HEAD' });
      const duration = Date.now() - start;
      if (response.ok) {
        addTest('Basic Connectivity', 'success', 'Internet connection working', duration);
      } else {
        addTest('Basic Connectivity', 'error', `HTTP ${response.status}`, duration);
      }
    } catch (error) {
      addTest('Basic Connectivity', 'error', `Error: ${error.message}`);
    }

    // Test 2: Backend health check
    addTest('Backend Health', 'pending', 'Testing backend health endpoint...');
    try {
      const start = Date.now();
      const response = await fetch(`${BASE_URL}/health`);
      const duration = Date.now() - start;
      if (response.ok) {
        const data = await response.json();
        addTest('Backend Health', 'success', `Backend responding: ${JSON.stringify(data)}`, duration);
      } else {
        addTest('Backend Health', 'error', `HTTP ${response.status}`, duration);
      }
    } catch (error) {
      addTest('Backend Health', 'error', `Error: ${error.message}`);
    }

    // Test 3: CORS preflight
    addTest('CORS Preflight', 'pending', 'Testing CORS preflight request...');
    try {
      const start = Date.now();
      const response = await fetch(`${BASE_URL}/auth/otp/request`, {
        method: 'OPTIONS',
        headers: {
          'Origin': 'capacitor://localhost',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type,Authorization'
        }
      });
      const duration = Date.now() - start;
      if (response.ok) {
        addTest('CORS Preflight', 'success', 'CORS preflight successful', duration);
      } else {
        addTest('CORS Preflight', 'error', `HTTP ${response.status}`, duration);
      }
    } catch (error) {
      addTest('CORS Preflight', 'error', `Error: ${error.message}`);
    }

    // Test 4: API Request wrapper
    addTest('API Wrapper', 'pending', 'Testing enhanced API request wrapper...');
    try {
      const start = Date.now();
      await apiRequest('/health');
      const duration = Date.now() - start;
      addTest('API Wrapper', 'success', 'API wrapper working correctly', duration);
    } catch (error) {
      addTest('API Wrapper', 'error', `Error: ${error.message}`);
    }

    // Test 5: Auth endpoint (without token)
    addTest('Auth Endpoint', 'pending', 'Testing auth endpoint...');
    try {
      const start = Date.now();
      const response = await fetch(`${BASE_URL}/auth/otp/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: '+1234567890' })
      });
      const duration = Date.now() - start;
      const data = await response.json();
      if (response.status === 404) {
        addTest('Auth Endpoint', 'success', `Auth endpoint working (expected 404 for test phone): ${data.error}`, duration);
      } else {
        addTest('Auth Endpoint', 'error', `Unexpected response: ${response.status}`, duration);
      }
    } catch (error) {
      addTest('Auth Endpoint', 'error', `Error: ${error.message}`);
    }

    setIsRunning(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      case 'pending': return '#FF9800';
      default: return '#9E9E9E';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✓';
      case 'error': return '✗';
      case 'pending': return '⏳';
      default: return '?';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Network Debugger</Text>
      <Text style={styles.subtitle}>Test your app's network connectivity</Text>
      
      <TouchableOpacity 
        style={[styles.button, isRunning && styles.buttonDisabled]} 
        onPress={runNetworkTests}
        disabled={isRunning}
      >
        <Text style={styles.buttonText}>
          {isRunning ? 'Running Tests...' : 'Run Network Tests'}
        </Text>
      </TouchableOpacity>

      <View style={styles.results}>
        {tests.map((test, index) => (
          <View key={index} style={styles.testItem}>
            <View style={styles.testHeader}>
              <Text style={[styles.statusIcon, { color: getStatusColor(test.status) }]}>
                {getStatusIcon(test.status)}
              </Text>
              <Text style={styles.testName}>{test.name}</Text>
              {test.duration && (
                <Text style={styles.duration}>{test.duration}ms</Text>
              )}
            </View>
            <Text style={styles.testMessage}>{test.message}</Text>
          </View>
        ))}
      </View>

      <View style={styles.info}>
        <Text style={styles.infoTitle}>Debugging Tips:</Text>
        <Text style={styles.infoText}>• Check if all tests pass</Text>
        <Text style={styles.infoText}>• Look for CORS or network errors</Text>
        <Text style={styles.infoText}>• Verify backend is accessible</Text>
        <Text style={styles.infoText}>• Check network security policies</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  results: {
    marginBottom: 20,
  },
  testItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  statusIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  testName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  duration: {
    fontSize: 12,
    color: '#666',
  },
  testMessage: {
    fontSize: 14,
    color: '#666',
    marginLeft: 28,
  },
  info: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1976d2',
  },
  infoText: {
    fontSize: 14,
    color: '#1976d2',
    marginBottom: 5,
  },
});
