import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import { loginUser } from './api/AuthApi';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      if (!username.trim() || !password.trim()) {
        Alert.alert('Error', 'Por favor ingrese usuario y contraseña');
        return;
      }

      setLoading(true);

      const result = await loginUser({ username, password });

      if (!result?.success) {
        throw new Error(result?.message || 'Error de autenticación');
      }

      const user = result.data;

      console.log("Usuario autenticado:", user);

      switch(user.rol) {
        case 'admin':
          navigation.reset({
            index: 0,
            routes: [{ name: 'IndexAdmin', params: { user } }]
          });
          break;
        case 'chofer':
          navigation.reset({
            index: 0,
            routes: [{
              name: 'IndexUsuarios',
              params: { 
                user,
                conductorInfo: {
                  num_conductor: user.num_conductor,
                  nombre: user.nombre_conductor
                }
              }
            }]
          });
          break;
        default:
          throw new Error('Rol de usuario no reconocido');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo de la empresa */}
      <Image source={require('./images/Logo_Azul.png')} style={styles.logo} />

      {/* Nombre de la empresa */}
      <Text style={styles.companyName}>MediSafe</Text>

      <Text style={styles.title}>Inicio de Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Ingresar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginTop: -50, 
  },
  logo: {
    width: 300,
    height: undefined,
    aspectRatio: 1, 
    alignSelf: 'center',
    marginBottom: 2,
    resizeMode: 'contain',
  },
  companyName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#005398',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15, 
    textAlign: 'center',
    color: '#005398',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#005398',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  buttonDisabled: {
    backgroundColor: '#7f9bb3',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;