// Sign in. Laid out the way retirement apps commonly do it (and the way the
// harness sees production apps): a brand mark, a greeting that knows a
// returning member ("Welcome back") and shows their username masked with a
// "Not you?" link, outlined fields with a show/hide toggle, a Sign in button
// that stays disabled until both fields are filled, a biometric button, an
// OR divider, Enroll and Set up access, a forgot link, footer links, and a
// full-screen spinner while signing in. A wrong username is an alert.
//
// Grounding cases here: a greeting whose text is chosen at runtime (both
// branches are in the source), a button disabled in the source with a stub
// handler (Set up access: "not built yet"), a conditionally rendered link
// (Not you?), taps that navigate by route (Enroll, Forgot), and texts with no
// testID (the subtitle, the copyright).
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { FloatingLabelInput } from '../components/FloatingLabelInput';
import { Screen } from '../components/Screen';
import { useSession } from '../session';
import { colors, spacing, type } from '../theme';

const LINKS = {
  contact: 'https://example.com/harbor/contact',
  terms: 'https://example.com/harbor/terms',
  privacy: 'https://example.com/harbor/privacy',
};

export default function LoginScreen({ navigation }: any) {
  const { signIn, lastUsername, signedInBefore } = useSession();
  const masked = lastUsername ? `${lastUsername.substring(0, 5)}*****` : null;

  // Fields are uncontrolled; what they hold is tracked here.
  const [savedUsername, setSavedUsername] = useState<string | null>(lastUsername);
  const [fieldKey, setFieldKey] = useState(0); // a new key clears the username field
  const username = useRef(masked ?? '');
  const password = useRef('');
  const [usernameIsMasked, setUsernameIsMasked] = useState(masked !== null);
  const [filled, setFilled] = useState({ username: masked !== null, password: false });
  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const usernameRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  // Android always offers biometrics (it is also where they are set up);
  // iOS names the sensor.
  const biometricLabel = Platform.OS === 'ios' ? 'Face ID' : 'Biometrics';
  const isReturning = signedInBefore || savedUsername !== null;
  const loginEnabled = filled.username && filled.password && !loading;
  const showNotYouButton = savedUsername !== null && usernameIsMasked;

  const handleUsernameChange = (text: string) => {
    username.current = text;
    if (savedUsername !== null && text !== masked) setSavedUsername(null);
    setUsernameIsMasked(text === masked);
    setFilled((f) => ({ ...f, username: text.trim().length > 0 }));
  };
  const handlePasswordChange = (text: string) => {
    password.current = text;
    setFilled((f) => ({ ...f, password: text.length > 0 }));
  };
  const handleNotYou = () => {
    setSavedUsername(null);
    setUsernameIsMasked(false);
    username.current = '';
    setFilled((f) => ({ ...f, username: false }));
    setFieldKey((k) => k + 1);
    setTimeout(() => usernameRef.current?.focus(), 50);
  };
  const handleLogin = () => {
    if (!loginEnabled) return;
    setLoading(true);
    const name = usernameIsMasked && savedUsername ? savedUsername : username.current;
    setTimeout(() => {
      if (signIn(name)) {
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
        return;
      }
      setLoading(false);
      Alert.alert('', "We couldn't find an account with that username.", [{ text: 'OK' }]);
    }, 800);
  };
  const handleBiometricButton = () => {
    Alert.alert('', `Enter your username and password, then use ${biometricLabel} to enable biometric sign-in.`);
  };
  const open = (url: string, label: string) => Linking.openURL(url).catch(() => Alert.alert('', `Unable to open ${label}. Please try again later.`));

  return (
    <Screen testID="login-screen" edges={['top', 'bottom']} background={colors.surface} style={styles.content}>
      {/* Brand mark */}
      <View style={styles.logoContainer} accessible accessibilityRole="image" accessibilityLabel="Harbor logo">
        <Ionicons name="boat" size={26} color={colors.navy} />
        <Text style={styles.logoText}>Harbor</Text>
      </View>

      {/* Greeting */}
      <View style={styles.headingContainer}>
        <Text style={styles.heading} testID="login-heading">
          {isReturning ? 'Welcome back' : 'Welcome'}
        </Text>
        <Text style={styles.subtitle}>Sign in to manage your retirement accounts.</Text>
      </View>

      <FloatingLabelInput
        key={fieldKey}
        ref={usernameRef}
        label="Username"
        defaultValue={usernameIsMasked && masked ? masked : ''}
        onChangeText={handleUsernameChange}
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
        accessibilityLabel="Username"
        testID="login-username-input"
        textContentType="username"
        suffix={
          showNotYouButton ? (
            <Pressable onPress={handleNotYou} style={styles.accessoryButton} accessibilityRole="button" accessibilityLabel="Not you? Clear username" testID="login-not-you-button">
              <Text style={styles.accessoryText}>Not you?</Text>
            </Pressable>
          ) : undefined
        }
      />

      <FloatingLabelInput
        ref={passwordRef}
        label="Password"
        onChangeText={handlePasswordChange}
        secureTextEntry={hidePassword}
        returnKeyType="go"
        onSubmitEditing={handleLogin}
        accessibilityLabel="Password"
        testID="login-password-input"
        textContentType="password"
        suffix={
          <Pressable
            onPress={() => setHidePassword((h) => !h)}
            style={styles.accessoryButton}
            accessibilityRole="button"
            accessibilityLabel={hidePassword ? 'Show password' : 'Hide password'}
            testID="login-toggle-password-button"
          >
            <Ionicons name={hidePassword ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.textMuted} />
          </Pressable>
        }
      />

      <View style={styles.signInWrapper}>
        <Button shape="pill" title={loading ? 'Signing in...' : 'Sign in'} onPress={handleLogin} disabled={!loginEnabled} testID="login-sign-in-button" />
      </View>

      <View style={styles.biometricWrapper}>
        <Button
          shape="pill"
          variant="secondary"
          title={`Sign in with ${biometricLabel}`}
          icon={Platform.OS === 'ios' ? 'scan-outline' : 'finger-print'}
          onPress={handleBiometricButton}
          testID="login-biometric-button"
        />
      </View>

      <View style={styles.dividerSpacing}>
        <View style={styles.orDividerRow} testID="login-or-divider">
          <View style={styles.orDividerLine} />
          <Text style={styles.orDividerText}>OR</Text>
          <View style={styles.orDividerLine} />
        </View>
      </View>

      <View style={styles.secondaryButtonsRow}>
        <View style={styles.secondaryButtonHalf}>
          <Button shape="pill" variant="secondary" title="Enroll" onPress={() => navigation.navigate('Enrollment')} testID="login-enroll-button" />
        </View>
        <View style={styles.secondaryButtonHalf}>
          <Button
            shape="pill"
            variant="secondary"
            title="Set up access"
            onPress={() => {
              // STUB(HRB-62): Set up access flow — not yet implemented.
            }}
            disabled
            testID="login-setup-access-button"
          />
        </View>
      </View>

      <Pressable
        style={styles.forgotContainer}
        onPress={() => navigation.navigate('AccountRecovery')}
        accessibilityRole="button"
        accessibilityLabel="Forgot username or password"
        testID="login-forgot-button"
      >
        <Text style={styles.forgotText}>Forgot username or password?</Text>
      </Pressable>

      <View style={styles.spacer} />

      <View style={styles.footer}>
        <View style={styles.footerLinksRow}>
          <Pressable onPress={() => open(LINKS.contact, 'Contact')} accessibilityRole="link" accessibilityLabel="Contact" testID="login-footer-contact">
            <Text style={styles.footerLink}>Contact</Text>
          </Pressable>
          <Text style={styles.footerDot}>  |  </Text>
          <Pressable onPress={() => open(LINKS.terms, 'Terms of Use')} accessibilityRole="link" accessibilityLabel="Terms of Use" testID="login-footer-terms">
            <Text style={styles.footerLink}>Terms of Use</Text>
          </Pressable>
          <Text style={styles.footerDot}>  |  </Text>
          <Pressable onPress={() => open(LINKS.privacy, 'Privacy')} accessibilityRole="link" accessibilityLabel="Privacy" testID="login-footer-privacy">
            <Text style={styles.footerLink}>Privacy</Text>
          </Pressable>
        </View>
        <Text style={styles.footerCopyright}>© 2026 Harbor Retirement, Inc. All rights reserved.</Text>
      </View>

      {loading && (
        <View style={styles.loadingOverlay} accessibilityLabel="Signing in" testID="login-loading-overlay">
          <ActivityIndicator size="large" color={colors.navy} testID="login-loading-indicator" />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { gap: 0, flexGrow: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  logoContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginBottom: spacing.xl },
  logoText: { fontSize: 24, fontWeight: '700', color: colors.navy, letterSpacing: 0.5 },
  headingContainer: { marginBottom: spacing.lg, gap: 6 },
  heading: { fontSize: 32, lineHeight: 38, fontWeight: '700', color: colors.navy, letterSpacing: -0.5 },
  subtitle: { fontSize: 16, lineHeight: 24, color: colors.textMuted },
  accessoryButton: { paddingHorizontal: spacing.md, paddingVertical: 14 },
  accessoryText: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  signInWrapper: { marginBottom: spacing.sm },
  biometricWrapper: { marginBottom: spacing.sm },
  dividerSpacing: { marginVertical: spacing.md },
  orDividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  orDividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  orDividerText: { fontSize: 11, fontWeight: '700', letterSpacing: 1, lineHeight: 14, color: colors.textMuted },
  secondaryButtonsRow: { flexDirection: 'row', gap: 10, marginBottom: spacing.sm },
  secondaryButtonHalf: { flex: 1 },
  forgotContainer: { alignItems: 'center', paddingVertical: spacing.sm, marginTop: 4 },
  forgotText: { fontSize: 16, fontWeight: '700', color: colors.blue },
  spacer: { flexGrow: 1, minHeight: spacing.xl },
  footer: { alignItems: 'center', gap: 18 },
  footerLinksRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  footerLink: { fontSize: 14, lineHeight: 20, color: colors.navy },
  footerDot: { ...type.caption, color: colors.textMuted },
  footerCopyright: { fontSize: 12, lineHeight: 16, color: colors.textMuted, textAlign: 'center' },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 0.6)' },
});
