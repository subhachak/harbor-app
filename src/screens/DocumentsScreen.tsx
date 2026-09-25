// Statements and documents. WEAK LOCATORS, deliberately: rows carry only an
// accessibilityLabel, no testID. They work, but a label is user-facing copy
// that gets reworded and localized.
// RUNTIME STATE, too: the list comes from a service (src/data/statements.ts),
// so a spinner shows while it loads, and an error with a retry when it fails.
// Which of them is on screen depends on the moment, not on the source.
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Screen } from '../components/Screen';
import type { Document } from '../data/mock';
import { fetchStatements } from '../data/statements';
import { useSession } from '../session';
import { colors, radius, spacing, type } from '../theme';

export default function DocumentsScreen() {
  const { member } = useSession();
  const [documents, setDocuments] = useState<Document[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    setDocuments(null);
    fetchStatements(member?.username ?? '')
      .then(setDocuments)
      .catch((e: Error) => setError(e.message));
  }, [member]);
  useEffect(load, [load]);

  return (
    <Screen testID="documents-screen">
      <Text style={styles.intro}>Statements are available for the last three years.</Text>
      {error ? (
        <View testID="documents-error" style={styles.error}>
          <Text testID="documents-error-text" style={styles.errorText}>
            {error}
          </Text>
          <Button testID="documents-retry-button" title="Try again" variant="secondary" onPress={load} />
        </View>
      ) : !documents ? (
        <ActivityIndicator testID="documents-loading" color={colors.blue} style={styles.loading} />
      ) : (
        <Card>
          {documents.map((d) => (
            <TouchableOpacity
              key={d.id}
              accessibilityLabel={`${d.title} ${d.period}`}
              onPress={() => Alert.alert(d.title, `Opening ${d.period} (simulated).`)}
              style={styles.row}
            >
              <View style={styles.icon}>
                <Ionicons name="document-text" size={20} color={colors.blue} />
              </View>
              <View style={styles.text}>
                <Text style={styles.title}>{d.title}</Text>
                <Text style={styles.period}>{d.period}</Text>
              </View>
              <Ionicons name="download-outline" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { ...type.body, color: colors.textMuted },
  loading: { paddingVertical: spacing.xl },
  error: { gap: spacing.md, padding: spacing.lg, borderRadius: radius.lg, backgroundColor: colors.dangerBg },
  errorText: { ...type.body, color: colors.danger },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  icon: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1 },
  title: { ...type.body, fontWeight: '600', color: colors.text },
  period: { ...type.caption, color: colors.textMuted },
});
