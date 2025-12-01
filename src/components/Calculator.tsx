import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Vibration,
} from 'react-native';

const { width } = Dimensions.get('window');

interface CalculatorProps {
  onSecretAccess: (pin: string) => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onSecretAccess }) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [secretMode, setSecretMode] = useState(false);
  const [secretPin, setSecretPin] = useState('');

  const buttons = [
    ['C', '⌫', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  const handlePress = (value: string) => {
    Vibration.vibrate(10);

    // Secret access mode
    if (value === '=' && display !== '0') {
      if (!secretMode) {
        setSecretMode(true);
        setSecretPin('');
        return;
      } else {
        // Check if PIN is entered
        if (secretPin.length >= 4) {
          onSecretAccess(secretPin);
          setSecretMode(false);
          setSecretPin('');
          setDisplay('0');
          return;
        }
      }
    }

    // Collect PIN in secret mode
    if (secretMode && /^\d$/.test(value)) {
      setSecretPin(prev => prev + value);
      return;
    }

    // Normal calculator operations
    if (value === 'C') {
      setDisplay('0');
      setPreviousValue(null);
      setOperation(null);
      setSecretMode(false);
      setSecretPin('');
      return;
    }

    if (value === '⌫') {
      setDisplay(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'));
      return;
    }

    if (['+', '-', '×', '÷', '%'].includes(value)) {
      setPreviousValue(display);
      setOperation(value);
      setDisplay('0');
      return;
    }

    if (value === '=') {
      if (previousValue && operation) {
        const prev = parseFloat(previousValue);
        const current = parseFloat(display);
        let result = 0;

        switch (operation) {
          case '+':
            result = prev + current;
            break;
          case '-':
            result = prev - current;
            break;
          case '×':
            result = prev * current;
            break;
          case '÷':
            result = prev / current;
            break;
          case '%':
            result = prev % current;
            break;
        }

        setDisplay(result.toString());
        setPreviousValue(null);
        setOperation(null);
      }
      return;
    }

    // Number and decimal input
    if (display === '0' && value !== '.') {
      setDisplay(value);
    } else if (value === '.' && display.includes('.')) {
      return;
    } else {
      setDisplay(prev => prev + value);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.displayContainer}>
        <Text style={styles.display} numberOfLines={1} adjustsFontSizeToFit>
          {display}
        </Text>
        {operation && (
          <Text style={styles.operation}>{previousValue} {operation}</Text>
        )}
      </View>

      <View style={styles.buttonsContainer}>
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((button) => (
              <TouchableOpacity
                key={button}
                style={[
                  styles.button,
                  button === '0' && styles.buttonZero,
                  ['+', '-', '×', '÷', '%', '='].includes(button) && styles.buttonOperator,
                  ['C', '⌫'].includes(button) && styles.buttonFunction,
                ]}
                onPress={() => handlePress(button)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.buttonText,
                    ['+', '-', '×', '÷', '%', '='].includes(button) && styles.buttonOperatorText,
                    ['C', '⌫'].includes(button) && styles.buttonFunctionText,
                  ]}
                >
                  {button}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      {secretMode && (
        <View style={styles.secretIndicator}>
          <Text style={styles.secretText}>Enter PIN...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 20,
    backgroundColor: '#000',
  },
  display: {
    fontSize: 64,
    color: '#fff',
    fontWeight: '300',
  },
  operation: {
    fontSize: 24,
    color: '#888',
    marginTop: 10,
  },
  buttonsContainer: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  button: {
    width: width / 4 - 15,
    height: width / 4 - 15,
    borderRadius: (width / 4 - 15) / 2,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  buttonZero: {
    width: width / 2 - 15,
    borderRadius: (width / 4 - 15) / 2,
  },
  buttonOperator: {
    backgroundColor: '#ff9500',
  },
  buttonFunction: {
    backgroundColor: '#a6a6a6',
  },
  buttonText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '400',
  },
  buttonOperatorText: {
    color: '#fff',
    fontWeight: '500',
  },
  buttonFunctionText: {
    color: '#000',
    fontWeight: '500',
  },
  secretIndicator: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(255, 149, 0, 0.8)',
    padding: 10,
    borderRadius: 5,
  },
  secretText: {
    color: '#fff',
    fontSize: 12,
  },
});

export default Calculator;
