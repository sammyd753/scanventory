import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { RootStackParamList, MainTabParamList } from '../../types';
import { colors, typography, spacing, globalStyles } from '../../styles';
import { useAppSelector } from '../../hooks/useRedux';

// Import the barcode scanner with error handling
let BarCodeScanner: any;
try {
  BarCodeScanner = require('expo-barcode-scanner').BarCodeScanner;
} catch (error) {
  console.log('Error loading BarCodeScanner:', error);
}

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Scanner'>,
  NativeStackScreenProps<RootStackParamList>
>;

const ScannerScreen: React.FC<Props> = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const { bins } = useAppSelector(state => state.bins);

  useEffect(() => {
    (async () => {
      if (!BarCodeScanner) {
        setHasPermission(false);
        return;
      }
      try {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      } catch (error) {
        console.log('Error requesting camera permissions:', error);
        setHasPermission(false);
      }
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { type: string; data: string }) => {
    setScanned(true);

    // Check if the scanned QR code matches a bin ID
    const bin = bins.find(bin => bin.id === data);

    if (bin) {
      navigation.navigate('BinDetails', { binId: bin.id });
    } else {
      // If no matching bin is found, you could show an error or create a new bin
      alert(`Bin with ID ${data} not found. Would you like to create a new bin with this ID?`);
    }
  };

  const toggleFlash = () => {
    setFlashOn(!flashOn);
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={styles.text}>No access to camera</Text>
        {BarCodeScanner ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => BarCodeScanner.requestPermissionsAsync()}
          >
            <Text style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
        ) : (
          <View>
            <Text style={styles.text}>
              Barcode scanner is not available on this device or there was an error loading it.
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Bins')}
            >
              <Text style={styles.buttonText}>Go to Bins</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  }

  if (!BarCodeScanner) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={styles.text}>Barcode scanner is not available</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Bins')}
        >
          <Text style={styles.buttonText}>Go to Bins</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        flashMode={flashOn ? BarCodeScanner.Constants.FlashMode.torch : BarCodeScanner.Constants.FlashMode.off}
      />

      <SafeAreaView style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Scan QR Code</Text>
          <TouchableOpacity onPress={toggleFlash} style={styles.flashButton}>
            <Ionicons
              name={flashOn ? 'flash' : 'flash-off'}
              size={24}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.scanArea}>
          <View style={styles.scanFrame} />
          <Text style={styles.scanText}>
            Position the QR code within the frame
          </Text>
        </View>

        {scanned && (
          <TouchableOpacity
            style={styles.scanAgainButton}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.scanAgainText}>Scan Again</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.manualEntryButton}
          onPress={() => {}}
        >
          <Text style={styles.manualEntryText}>Enter Bin ID Manually</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.m,
  },
  headerText: {
    color: colors.white,
    fontSize: typography.fontSizeLarge,
    fontWeight: typography.fontWeightBold,
  },
  flashButton: {
    padding: spacing.s,
  },
  scanArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
    marginBottom: spacing.m,
  },
  scanText: {
    color: colors.white,
    fontSize: typography.fontSizeRegular,
    textAlign: 'center',
    marginHorizontal: spacing.l,
  },
  scanAgainButton: {
    backgroundColor: colors.primary,
    padding: spacing.m,
    margin: spacing.m,
    borderRadius: 8,
    alignItems: 'center',
  },
  scanAgainText: {
    color: colors.white,
    fontSize: typography.fontSizeMedium,
    fontWeight: typography.fontWeightMedium,
  },
  manualEntryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.white,
    padding: spacing.m,
    margin: spacing.m,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  manualEntryText: {
    color: colors.white,
    fontSize: typography.fontSizeMedium,
  },
  text: {
    fontSize: typography.fontSizeMedium,
    color: colors.text,
    textAlign: 'center',
    margin: spacing.l,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.m,
    borderRadius: 8,
    margin: spacing.m,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.fontSizeMedium,
    fontWeight: typography.fontWeightMedium,
  },
});

export default ScannerScreen;
