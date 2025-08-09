import { useSignUp } from '@clerk/clerk-expo';
import { useRouter, Link } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert, ViewStyle, TextStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow, typography } from '../../styles/theme';

export default function VerifyEmailScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const router = useRouter();

  const inputRefs = Array(6).fill(0).map(() => useRef<TextInput>(null));

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleCodeChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto focus next input
    if (text && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleResendCode = async () => {
    if (!isLoaded || countdown > 0) return;
    
    setResendLoading(true);
    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setCountdown(30);
      Alert.alert('Success', 'Verification code has been resent to your email.');
    } catch (err: any) {
      Alert.alert('Error', err.errors[0].message);
    } finally {
      setResendLoading(false);
    }
  };

  const onVerify = async () => {
    if (!isLoaded) return;
    
    const verificationCode = code.join('');
    if (verificationCode.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit verification code');
      return;
    }
    
    setLoading(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });

      await setActive({ session: completeSignUp.createdSessionId });
      router.replace('/(tabs)');
    } catch (err: any) {
      Alert.alert('Error', err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.headerBrand}>
            <View style={styles.brandPill}>
              <MaterialIcons name="verified" size={18} color={colors.primary} />
              <Text style={styles.brandPillText}>QponAI</Text>
            </View>
            <Text style={styles.title}>Verify your email</Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit verification code to your email address
            </Text>
          </View>

          <View style={styles.card}>
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={inputRefs[index]}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent, index)}
                style={styles.codeInput}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                editable={!loading}
              />
            ))}
          </View>

          <TouchableOpacity 
            onPress={onVerify} 
            style={[styles.button, loading && styles.buttonDisabled]}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Verifying...' : 'Verify Email'}
            </Text>
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              Didn't receive a code? 
            </Text>
            <TouchableOpacity 
              onPress={handleResendCode}
              disabled={resendLoading || countdown > 0}
            >
              <Text style={[
                styles.resendLink,
                (resendLoading || countdown > 0) && styles.resendLinkDisabled
              ]}>
                {resendLoading ? 'Sending...' : countdown > 0 ? `Resend (${countdown}s)` : 'Resend Code'}
              </Text>
            </TouchableOpacity>
          </View>
          </View>

          <View style={styles.footer}>
            <Link href="/login" asChild>
              <TouchableOpacity style={styles.backButton}>
                <MaterialIcons name="arrow-back" size={20} color={colors.primary} />
                <Text style={styles.backButtonText}>Back to login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

type Styles = {
  scrollContainer: ViewStyle;
  container: ViewStyle;
  headerBrand: ViewStyle;
  brandPill: ViewStyle;
  brandPillText: TextStyle;
  title: TextStyle;
  subtitle: TextStyle;
  card: ViewStyle;
  codeContainer: ViewStyle;
  codeInput: TextStyle;
  button: ViewStyle;
  buttonDisabled: ViewStyle;
  buttonText: TextStyle;
  resendContainer: ViewStyle;
  resendText: TextStyle;
  resendLink: TextStyle;
  resendLinkDisabled: TextStyle;
  footer: ViewStyle;
  backButton: ViewStyle;
  backButtonText: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    padding: spacing.xl,
    backgroundColor: colors.bg,
  },
  headerBrand: {
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  brandPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.subtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    marginBottom: spacing.md,
  },
  brandPillText: {
    marginLeft: spacing.xs,
    color: colors.primary,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.subtitle,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.xl,
  },
  card: {
    marginTop: spacing.lg,
    backgroundColor: colors.cardBg,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  codeInput: {
    width: 46,
    height: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
    backgroundColor: colors.subtle,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#A0C4FF',
    shadowOpacity: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  resendText: {
    color: colors.muted,
    fontSize: 14,
  },
  resendLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  resendLinkDisabled: {
    color: '#A0C4FF',
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
});