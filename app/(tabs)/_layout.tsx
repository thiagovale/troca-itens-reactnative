import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, Text } from 'react-native';

import {Colors} from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getAuth } from 'firebase/auth';
import { router } from 'expo-router';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = React.useState(true);

  getAuth().onAuthStateChanged((user) => {
    setIsLoading(false);
    if (!user) {
      router.replace("/");
    }
  });

  if (isLoading) return <Text style={{ paddingTop: 30 }}>Loading...</Text>;

  return (
    <Tabs
    screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
    }}>
    <Tabs.Screen
        name="index"
        options={{
        title: 'Items list',
        headerRight: () => (
            <Link href="/modal" asChild>
            <Pressable>
                {({ pressed }) => (
                <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
                )}
            </Pressable>
            </Link>
        ),
        }}
    />
    <Tabs.Screen
        name="profile"
        options={{
        title: 'User profile',
        }}
    />
    </Tabs>
  );
}