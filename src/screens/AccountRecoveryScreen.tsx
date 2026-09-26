// Account recovery, reached from "Forgot username or password?" on sign in.
// Two options; each would start its own flow (simulated here).
import React from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { Card } from '../components/Card';
import { ListRow } from '../components/ListRow';
import { Screen } from '../components/Screen';
import { colors, type } from '../theme';

export default function AccountRecoveryScreen() {
  return (
    <Screen testID="account-recovery-screen">
      <Text testID="account-recovery-heading" style={styles.heading}>
        What do you need help with?
      </Text>
      <Text style={styles.subtitle}>We will send a code to the email or phone on your account.</Text>
      <Card>
        <ListRow testID="account-recovery-forgot-username-row" title="Forgot username" icon="person-outline" onPress={() => Alert.alert('Forgot username', 'We sent your username to your email (simulated).')} />
        <ListRow testID="account-recovery-forgot-password-row" title="Forgot password" icon="key-outline" onPress={() => Alert.alert('Forgot password', 'We sent a reset code to your email (simulated).')} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { ...type.title, color: colors.navy },
  subtitle: { ...type.body, color: colors.textMuted },
});
