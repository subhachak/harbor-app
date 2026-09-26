// Home: the portfolio overview members land on after signing in. A bar with a
// time-of-day greeting, a message centre, and a menu; then the total
// portfolio value with its year-to-date change, a Plan Snapshot of each plan,
// a card to plan contributions, and the projected balance at retirement. The
// numbers come from a stand-in service (src/data/overview.ts), so a spinner
// shows first. Statements, Activity, and Profile are in the menu.
// testIDs here come from constants (src/testIds.ts), a common team pattern.
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Screen } from "../components/Screen";
import { PLANS } from "../data/mock";
import { fetchOverview, type Overview } from "../data/overview";
import { useSession } from "../session";
import { HOME } from "../testIds";
import { colors, formatMoney, radius, spacing, type } from "../theme";

const timeOfDay = () => {
  const h = new Date().getHours();
  return h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
};

export default function HomeScreen({ navigation }: any) {
  const { member } = useSession();
  const firstName = member?.name.split(" ")[0] ?? null;
  const greetingPrefix = `Good ${timeOfDay()}`;
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const load = useCallback(() => {
    setError(null);
    setOverview(null);
    fetchOverview()
      .then(setOverview)
      .catch(() =>
        setError(
          "Your account information is unavailable.\nPlease try again later.",
        ),
      );
  }, []);
  useEffect(load, [load]);

  return (
    <Screen testID={HOME.screen} edges={["top"]}>
      <View style={styles.navbar}>
        <Text
          style={styles.greetingText}
          accessibilityRole="text"
          testID={HOME.greeting}
        >
          {firstName != null
            ? `${greetingPrefix} ${firstName}`
            : greetingPrefix}
        </Text>
        <View style={styles.navbarTrailing}>
          <Pressable
            onPress={() => navigation.navigate("Documents")}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel="Message center"
            testID={HOME.messageCenter}
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={colors.navy}
            />
          </Pressable>
          <Pressable
            onPress={() => setMenuOpen(true)}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel="Menu"
            testID={HOME.menu}
          >
            <Ionicons name="menu" size={24} color={colors.navy} />
          </Pressable>
        </View>
      </View>

      {!overview && !error && (
        <View
          style={styles.centered}
          accessibilityLabel="Loading your portfolio"
        >
          <ActivityIndicator
            size="large"
            color={colors.navy}
            testID={HOME.loading}
          />
        </View>
      )}

      {error != null && (
        <View style={styles.centered}>
          <Text style={styles.errorText} testID={HOME.error}>
            {error}
          </Text>
          <Pressable
            onPress={load}
            style={styles.retryButton}
            accessibilityRole="button"
            accessibilityLabel="Retry loading portfolio"
            testID={HOME.retry}
          >
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      )}

      {overview && (
        <View style={styles.sections} testID={HOME.scroll}>
          {/* Total portfolio value */}
          <View style={styles.hero} testID={HOME.balanceCard}>
            <Text style={styles.heroLabel}>Total portfolio value</Text>
            <Text style={styles.heroValue} testID={HOME.balanceAmount}>
              {formatMoney(overview.total)}
            </Text>
            <View style={styles.changeRow}>
              <Ionicons
                name={overview.ytdChange >= 0 ? "arrow-up" : "arrow-down"}
                size={14}
                color={overview.ytdChange >= 0 ? colors.success : colors.danger}
              />
              <Text
                style={[
                  styles.changeText,
                  {
                    color:
                      overview.ytdChange >= 0 ? colors.success : colors.danger,
                  },
                ]}
              >
                {`${formatMoney(overview.ytdChange, { sign: true })} (${overview.ytdPercent.toFixed(1)}%) YTD`}
              </Text>
            </View>
          </View>

          {/* Plan Snapshot */}
          <View style={styles.snapshotHeader} testID={HOME.snapshotHeader}>
            <Text
              style={styles.snapshotTitle}
              accessibilityRole="header"
              testID={HOME.snapshotTitle}
            >
              Plan Snapshot
            </Text>
            <Text style={styles.asOf} testID={HOME.snapshotAsOf}>
              {`As of ${overview.asOf}`}
            </Text>
          </View>
          {PLANS.map((plan) => (
            <Pressable
              key={plan.id}
              onPress={() =>
                navigation.navigate("PlanDetails", { planId: plan.id })
              }
              accessibilityRole="button"
              accessibilityLabel={`${plan.name}, ${plan.kind}, ${formatMoney(plan.balance)}`}
              accessibilityHint="View plan details"
              testID={`employer-plan-card-${plan.id}`}
              style={styles.planCard}
            >
              <View style={styles.planText}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planKind}>{plan.kind}</Text>
              </View>
              <View style={styles.planNumbers}>
                <Text style={styles.planAmount}>
                  {formatMoney(plan.balance)}
                </Text>
                <Text
                  style={[
                    styles.planTrend,
                    {
                      color:
                        plan.ytdReturn >= 0 ? colors.success : colors.danger,
                    },
                  ]}
                >{`${plan.ytdReturn >= 0 ? "+" : ""}${plan.ytdReturn}% YTD`}</Text>
              </View>
            </Pressable>
          ))}

          {/* Contribution planning */}
          <Card>
            <Text style={styles.cardTitle}>Grow your savings</Text>
            <Text style={styles.cardBody}>
              A little more each month adds up by retirement.
            </Text>
            <Button
              shape="pill"
              title="Contribute"
              icon="add-circle-outline"
              onPress={() => navigation.navigate("Contribute")}
              testID={HOME.contributeAction}
            />
          </Card>

          {/* Projected at retirement */}
          <Card testID={HOME.projected}>
            <Text style={styles.cardLabel}>Projected at retirement</Text>
            <Text style={styles.projected}>
              {formatMoney(overview.projectedAtRetirement)}
            </Text>
            <Text style={styles.cardBody}>
              At age 67, if you keep contributing as you do today.
            </Text>
          </Card>
        </View>
      )}

      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable
          style={styles.menuBackdrop}
          onPress={() => setMenuOpen(false)}
        >
          <View style={styles.menu} testID={HOME.navigationMenu}>
            <MenuRow
              testID="overview-navigation-menu-profile"
              title="Profile"
              icon="person-circle-outline"
              onPress={() => {
                setMenuOpen(false);
                navigation.navigate("Profile");
              }}
            />
            <MenuRow
              testID="overview-navigation-menu-plans"
              title="Plans"
              icon="pie-chart-outline"
              onPress={() => {
                setMenuOpen(false);
                navigation.navigate("Plans");
              }}
            />
            <MenuRow
              testID="overview-navigation-menu-activity"
              title="Activity"
              icon="pulse-outline"
              onPress={() => {
                setMenuOpen(false);
                navigation.navigate("Activity");
              }}
            />
            <MenuRow
              testID="overview-navigation-menu-statements"
              title="Statements"
              icon="document-text-outline"
              onPress={() => {
                setMenuOpen(false);
                navigation.navigate("Documents");
              }}
            />
            <Pressable
              onPress={() => setMenuOpen(false)}
              style={styles.menuRow}
              accessibilityRole="button"
              accessibilityLabel="Close menu"
              testID={HOME.menuClose}
            >
              <Ionicons name="close" size={22} color={colors.textMuted} />
              <Text style={[styles.menuText, { color: colors.textMuted }]}>
                Close
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </Screen>
  );
}

function MenuRow({
  testID,
  title,
  icon,
  onPress,
}: {
  testID: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.menuRow}
      accessibilityRole="button"
      accessibilityLabel={title}
      testID={testID}
    >
      <Ionicons name={icon} size={22} color={colors.navy} />
      <Text style={styles.menuText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  greetingText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
    fontWeight: "600",
  },
  navbarTrailing: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl,
    gap: spacing.lg,
  },
  errorText: { ...type.body, color: colors.textMuted, textAlign: "center" },
  retryButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.navy,
  },
  retryText: { ...type.label, color: colors.navy },
  sections: { gap: spacing.lg },
  hero: { gap: spacing.xs, paddingVertical: spacing.md },
  heroLabel: { ...type.label, color: colors.textMuted },
  heroValue: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "700",
    color: colors.navy,
    letterSpacing: -0.5,
  },
  changeRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  changeText: { ...type.label },
  snapshotHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
  snapshotTitle: { ...type.heading, color: colors.text },
  asOf: { ...type.caption, color: colors.textMuted },
  planCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  planText: { flex: 1, gap: 2 },
  planName: { ...type.body, fontWeight: "600", color: colors.text },
  planKind: { ...type.caption, color: colors.textMuted },
  planNumbers: { alignItems: "flex-end", gap: 2 },
  planAmount: { ...type.body, fontWeight: "700", color: colors.text },
  planTrend: { ...type.caption, fontWeight: "600" },
  cardTitle: { ...type.heading, color: colors.text },
  cardLabel: { ...type.label, color: colors.textMuted },
  cardBody: { ...type.body, color: colors.textMuted },
  projected: { fontSize: 28, fontWeight: "700", color: colors.navy },
  menuBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.35)",
    alignItems: "flex-end",
  },
  menu: {
    marginTop: 64,
    marginRight: spacing.lg,
    width: 240,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  menuText: { ...type.body, fontWeight: "600", color: colors.text },
});
