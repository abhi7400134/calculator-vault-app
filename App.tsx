import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Alert,
} from 'react-native';
import Calculator from './src/components/Calculator';
import VaultScreen from './src/screens/VaultScreen';
import AuthService from './src/services/AuthService';

type AppState = 'calculator' | 'vault' | 'decoy';

const App = () => {
  const [appState, setAppState] = useState<AppState>('calculator');
  const [isSetup, setIsSetup] = useState(false);

  useEffect(() => {
    checkSetup();
  }, []);

  const checkSetup = async () => {
    const pinSet = await AuthService.isMasterPinSet();
    setIsSetup(pinSet);
  };

  const handleSecretAccess = async (pin: string) => {
    if (!isSetup) {
      // First time setup
      Alert.alert(
        'Setup Master PIN',
        'This will be your master PIN to access the vault',
        [
          {
            text: 'Confirm',
            onPress: async () => {
              await AuthService.setupMasterPin(pin);
              setIsSetup(true);
              setAppState('vault');
              Alert.alert('Success', 'Master PIN set successfully!');
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
      return;
    }

    // Verify PIN
    const result = await AuthService.verifyPin(pin);

    if (result === 'master') {
      setAppState('vault');
    } else if (result === 'decoy') {
      setAppState('decoy');
    } else {
      const attempts = await AuthService.getFailedAttempts();
      Alert.alert(
        'Invalid PIN',
        `Wrong PIN. Failed attempts: ${attempts}`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleBackToCalculator = () => {
    setAppState('calculator');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {appState === 'calculator' && (
        <Calculator onSecretAccess={handleSecretAccess} />
      )}

      {appState === 'vault' && (
        <VaultScreen isDecoy={false} onBack={handleBackToCalculator} />
      )}

      {appState === 'decoy' && (
        <VaultScreen isDecoy={true} onBack={handleBackToCalculator} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default App;
