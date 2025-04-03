import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { getCamionAsignado } from '../apiUsuarios/CamionApi';

const MiCamion = ({ route }) => {
  const [camion, setCamion] = useState(null);
  const { conductorId } = route.params;

  useEffect(() => {
    const cargarCamion = async () => {
      try {
        const camionData = await getCamionAsignado(conductorId);
        setCamion(camionData);
      } catch (error) {
        console.error('Error al cargar camión:', error);
      }
    };
    cargarCamion();
  }, [conductorId]);

  if (!camion) {
    return (
      <View style={styles.container}>
        <Text>Cargando información del camión...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mi Camión Asignado</Text>
      
      <View style={styles.infoCard}>
        <Icon name="truck" size={30} color="#005398" style={styles.icon} />
        <Text style={styles.infoTitle}>{camion.matricula}</Text>
        <Text style={styles.infoText}>Modelo: {camion.modelo}</Text>
        <Text style={styles.infoText}>Marca: {camion.marca}</Text>
        <Text style={styles.infoText}>Año: {camion.year}</Text>
        <Text style={styles.infoText}>MMA: {camion.MMA} kg</Text>
        <Text style={styles.infoText}>Estado: {camion.estado}</Text>
      </View>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#EAF2F8',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
  },
  icon: {
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#003B75',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#34495E',
    marginBottom: 8,
  },
});

export default MiCamion;