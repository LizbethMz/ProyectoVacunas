import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { cambiarEstadoEnvio } from '../apiUsuarios/EnviosApi';

const CambiarEstado = ({ route }) => {
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('');
  const { envioId } = route.params;

  const estadosDisponibles = [
    { id: 1, nombre: 'Preparando carga', icono: 'box-open' },
    { id: 2, nombre: 'En tránsito', icono: 'truck-moving' },
    { id: 3, nombre: 'Entregado', icono: 'check-circle' },
    { id: 4, nombre: 'Retrasado', icono: 'clock' },
    { id: 5, nombre: 'Cancelado', icono: 'times-circle' },
  ];

  const handleCambiarEstado = async () => {
    if (!estadoSeleccionado) {
      Alert.alert('Error', 'Por favor selecciona un estado');
      return;
    }

    try {
      await cambiarEstadoEnvio(envioId, estadoSeleccionado);
      Alert.alert('Éxito', 'Estado actualizado correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el estado');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cambiar Estado del Envío</Text>
      <Text style={styles.subtitle}>Envío #{envioId}</Text>
      
      <Text style={styles.sectionTitle}>Selecciona el nuevo estado:</Text>
      
      {estadosDisponibles.map((estado) => (
        <TouchableOpacity
          key={estado.id}
          style={[
            styles.estadoOption,
            estadoSeleccionado === estado.nombre && styles.estadoSeleccionado
          ]}
          onPress={() => setEstadoSeleccionado(estado.nombre)}
        >
          <Icon name={estado.icono} size={20} color="#005398" />
          <Text style={styles.estadoText}>{estado.nombre}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleCambiarEstado}
        disabled={!estadoSeleccionado}
      >
        <Icon name="exchange-alt" size={20} color="white" />
        <Text style={styles.buttonText}>Actualizar Estado</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005398',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#003B75',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495E',
    marginBottom: 15,
  },
  estadoOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF2F8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D6EAF8',
  },
  estadoSeleccionado: {
    backgroundColor: '#D6EAF8',
    borderColor: '#005398',
  },
  estadoText: {
    fontSize: 16,
    color: '#003B75',
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#005398',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default CambiarEstado;