import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './LoginScreen';
import IndexAdmin from './indexAdmin';
import IndexUsuarios from './indexUsuarios';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerShown: false
                }}>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="IndexAdmin" component={IndexAdmin} />
                <Stack.Screen name="IndexUsuarios" component={IndexUsuarios} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}