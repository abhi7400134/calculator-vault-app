import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';
import CryptoJS from 'react-native-crypto-js';

const MASTER_PIN_KEY = '@master_pin';
const DECOY_PIN_KEY = '@decoy_pin';
const BIOMETRIC_KEY = '@biometric_enabled';
const FAILED_ATTEMPTS_KEY = '@failed_attempts';

class AuthService {
  private rnBiometrics = new ReactNativeBiometrics();

  // Hash PIN for secure storage
  private hashPin(pin: string): string {
    return CryptoJS.SHA256(pin).toString();
  }

  // Setup master PIN (first time)
  async setupMasterPin(pin: string): Promise<boolean> {
    try {
      const hashedPin = this.hashPin(pin);
      await AsyncStorage.setItem(MASTER_PIN_KEY, hashedPin);
      return true;
    } catch (error) {
      console.error('Error setting up master PIN:', error);
      return false;
    }
  }

  // Setup decoy PIN (optional)
  async setupDecoyPin(pin: string): Promise<boolean> {
    try {
      const hashedPin = this.hashPin(pin);
      await AsyncStorage.setItem(DECOY_PIN_KEY, hashedPin);
      return true;
    } catch (error) {
      console.error('Error setting up decoy PIN:', error);
      return false;
    }
  }

  // Verify PIN
  async verifyPin(pin: string): Promise<'master' | 'decoy' | 'invalid'> {
    try {
      const hashedPin = this.hashPin(pin);
      const masterPin = await AsyncStorage.getItem(MASTER_PIN_KEY);
      const decoyPin = await AsyncStorage.getItem(DECOY_PIN_KEY);

      if (hashedPin === masterPin) {
        await this.resetFailedAttempts();
        return 'master';
      }

      if (decoyPin && hashedPin === decoyPin) {
        await this.resetFailedAttempts();
        return 'decoy';
      }

      await this.incrementFailedAttempts();
      return 'invalid';
    } catch (error) {
      console.error('Error verifying PIN:', error);
      return 'invalid';
    }
  }

  // Check if master PIN is set
  async isMasterPinSet(): Promise<boolean> {
    try {
      const pin = await AsyncStorage.getItem(MASTER_PIN_KEY);
      return pin !== null;
    } catch (error) {
      return false;
    }
  }

  // Biometric authentication
  async isBiometricAvailable(): Promise<boolean> {
    try {
      const { available } = await this.rnBiometrics.isSensorAvailable();
      return available;
    } catch (error) {
      return false;
    }
  }

  async enableBiometric(): Promise<boolean> {
    try {
      await AsyncStorage.setItem(BIOMETRIC_KEY, 'true');
      return true;
    } catch (error) {
      return false;
    }
  }

  async isBiometricEnabled(): Promise<boolean> {
    try {
      const enabled = await AsyncStorage.getItem(BIOMETRIC_KEY);
      return enabled === 'true';
    } catch (error) {
      return false;
    }
  }

  async authenticateWithBiometric(): Promise<boolean> {
    try {
      const { success } = await this.rnBiometrics.simplePrompt({
        promptMessage: 'Authenticate to access vault',
      });
      return success;
    } catch (error) {
      return false;
    }
  }

  // Failed attempts tracking
  private async incrementFailedAttempts(): Promise<void> {
    try {
      const attempts = await this.getFailedAttempts();
      await AsyncStorage.setItem(FAILED_ATTEMPTS_KEY, (attempts + 1).toString());
    } catch (error) {
      console.error('Error incrementing failed attempts:', error);
    }
  }

  private async resetFailedAttempts(): Promise<void> {
    try {
      await AsyncStorage.setItem(FAILED_ATTEMPTS_KEY, '0');
    } catch (error) {
      console.error('Error resetting failed attempts:', error);
    }
  }

  async getFailedAttempts(): Promise<number> {
    try {
      const attempts = await AsyncStorage.getItem(FAILED_ATTEMPTS_KEY);
      return attempts ? parseInt(attempts, 10) : 0;
    } catch (error) {
      return 0;
    }
  }

  // Change PIN
  async changeMasterPin(oldPin: string, newPin: string): Promise<boolean> {
    try {
      const verification = await this.verifyPin(oldPin);
      if (verification !== 'master') {
        return false;
      }
      return await this.setupMasterPin(newPin);
    } catch (error) {
      return false;
    }
  }

  // Reset (for testing - remove in production)
  async resetAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        MASTER_PIN_KEY,
        DECOY_PIN_KEY,
        BIOMETRIC_KEY,
        FAILED_ATTEMPTS_KEY,
      ]);
    } catch (error) {
      console.error('Error resetting auth:', error);
    }
  }
}

export default new AuthService();
