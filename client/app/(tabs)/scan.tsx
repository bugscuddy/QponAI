import { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { barcodeService } from '../../services/barcodeService';
import { colors, spacing, radius } from '../../styles/theme';

type RootStackParamList = {
  'scan/results': { barcodeData: any };
};

export default function ScanCouponScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const { resetScan } = useLocalSearchParams<{ resetScan?: string }>();
  
  // Reset scan state when resetScan param changes
  useEffect(() => {
    if (resetScan) {
      setScanned(false);
      setIsLoading(false);
    }
  }, [resetScan]);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraType, setCameraType] = useState<'back' | 'front'>('back');
  const navigation = useNavigation<any>();
  const isWeb = Platform.select({ web: true, default: false }) as boolean;

  // On web, camera access via Expo Go isn't supported; show a helpful message
  if (isWeb) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'white', fontSize: 16, textAlign: 'center', padding: 24 }}>
          Barcode scanning is not available on web in this build. Please use a native device.
        </Text>
      </View>
    );
  }

  // Ask for permission when needed
  if (!isWeb && !permission) {
    // Permission hook is loading
    return <View style={styles.container} />;
  }
  
  if (!isWeb && permission && !permission.granted) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'white', fontSize: 16, textAlign: 'center', padding: 24, marginBottom: 16 }}>
          We need your permission to use the camera
        </Text>
        <TouchableOpacity 
          onPress={requestPermission} 
          style={{ 
            paddingHorizontal: 20, 
            paddingVertical: 10, 
            backgroundColor: colors.primary, 
            borderRadius: 8 
          }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = useCallback(async ({ type, data }: { type: string; data: string }) => {
    if (scanned || isLoading) return;
    
    if (!barcodeService.validateBarcode(data)) {
      Alert.alert('Invalid Barcode', 'Please scan a valid product barcode.');
      return;
    }
    
    setScanned(true);
    setIsLoading(true);
    
    try {
      const result = await barcodeService.lookupBarcode(data);
      
      if (result) {
        // Navigate to results screen with the barcode data
        navigation.navigate('scan/results', { barcodeData: result });
      } else {
        Alert.alert('No Matches', 'No matching products or coupons found for this barcode.');
        setScanned(false);
      }
    } catch (error) {
      console.error('Error processing barcode:', error);
      Alert.alert('Error', 'Failed to process barcode. Please try again.');
      setScanned(false);
    } finally {
      setIsLoading(false);
    }
  }, [scanned, isLoading, navigation]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Looking for coupons...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={cameraType}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.topOverlay}>
            <Text style={styles.overlayText}>Position barcode within the frame</Text>
          </View>
          <View style={styles.middleOverlay}>
            <View style={styles.leftOverlay} />
            <View style={styles.centerOverlay}>
              <View style={styles.scanFrame}>
                <View style={[styles.corner, styles.topLeftCorner]} />
                <View style={[styles.corner, styles.topRightCorner]} />
                <View style={[styles.corner, styles.bottomLeftCorner]} />
                <View style={[styles.corner, styles.bottomRightCorner]} />
              </View>
            </View>
            <View style={styles.rightOverlay} />
          </View>
          <View style={styles.bottomOverlay}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={() => setCameraType(current => (current === 'back' ? 'front' : 'back'))}
            >
              <MaterialIcons name="flip-camera-ios" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loadingText: {
    marginTop: spacing.md,
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  topOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    padding: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: radius.md,
  },
  middleOverlay: {
    flex: 2,
    flexDirection: 'row',
  },
  leftOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  centerOverlay: {
    flex: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: colors.primary,
    borderWidth: 4,
  },
  topLeftCorner: {
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  topRightCorner: {
    top: -2,
    right: -2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  bottomLeftCorner: {
    bottom: -2,
    left: -2,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  bottomRightCorner: {
    bottom: -2,
    right: -2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  flipButton: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 50,
  },
});
