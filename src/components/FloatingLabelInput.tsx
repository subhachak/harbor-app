import React, { forwardRef } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { colors, radius, spacing, type } from '../theme';

// An outlined text field whose label sits in a notch of its border, with an
// optional accessory on the right (a "Not you?" link, a show/hide toggle).
// Uncontrolled like Field: fast input from test automation lands in order.
export const FloatingLabelInput = forwardRef<TextInput, { testID?: string; label: string; suffix?: React.ReactNode } & Omit<TextInputProps, 'testID' | 'style'>>(
  function FloatingLabelInput({ testID, label, suffix, ...input }, ref) {
    return (
      <View style={styles.wrap}>
        <View style={styles.box}>
          <TextInput ref={ref} testID={testID} placeholderTextColor="#94A3B8" style={styles.input} autoCapitalize="none" autoCorrect={false} {...input} />
          {suffix}
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg, paddingTop: 8 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 54,
    paddingLeft: spacing.lg,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  label: { position: 'absolute', top: 0, left: spacing.md, paddingHorizontal: 4, backgroundColor: colors.surface, ...type.caption, color: colors.textMuted },
  input: { flex: 1, ...type.body, fontSize: 16, color: colors.text, paddingVertical: spacing.md },
});
