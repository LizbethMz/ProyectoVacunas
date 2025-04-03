import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { getEnviosPorConductor } from '../api/EnviosApi';

const EnviosAsignados = ({ route }) => {
  const [envios, setEnvios] = useState([]);
  const { conductorId } = route.params;

  useEffect(() => {
    cargarEnvios();
  }, []);

  const cargarEnvios = async () => {
    try {
      const enviosData = await getEnviosPorConductor(conductorId);
      setEnvios(enviosData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los envíos asignados');
    }
  };

  const obtenerColorEstado = (estado) => {
    switch (estado) {
      case 'Preparando carga': return '#3498DB';
      case 'En tránsito': return '#F39C12';
      case 'Entregado': return '#2ECC71';
      case 'Cancelado': return '#E74C3C';
      case 'Retrasado': return '#9B59B6';
      default: return '#95A5A6';
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Mis Envíos Asignados</Text>
      
      {envios.length === 0 ? (
        <Text style={styles.noEnvio}>No tienes envíos asignados actualmente</Text>
      ) : (
        envios.map((envio) => (
          <View key={envio.numero} style={styles.envioCard}>
            <View style={styles.header}>
              <Icon name="truck" size={24} color="#003B75" />
              <Text style={styles.envioTitle}>Envío #{envio.numero}</Text>
              <View style={[styles.statusBadge, { backgroundColor: obtenerColorEstado(envio.estado) }]}>
                <Text style={styles.statusText}>{envio.estado}</Text>
              </View>
            </View>
            
            <View style={styles.details}>
              <View style={styles.detailRow}>
                <Icon name="calendar-alt" size={16} color="#003B75" />
                <Text style={styles.detailText}>Fecha: {envio.fecha_progr}</Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="clock" size={16} color="#003B75" />
                <Text style={styles.detailText}>Salida: {envio.hora_salida}</Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="clock" size={16} color="#003B75" />
                <Text style={styles.detailText}>Llegada: {envio.hora_llegada}</Text>
              </View>
              <View style={styles.detailRow}>
                <Icon name="map-marker-alt" size={16} color="#003B75" />
                <Text style={styles.detailText}>Destino: {envio.destino}</Text>
              </View>
            </View>
          </View>
        ))
      )}
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
  noEnvio: {
    textAlign: 'center',
    color: '#777',
    fontStyle: 'italic',
    marginTop: 20,
  },
  envioCard: {
    backgroundColor: '#EAF2F8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#D6EAF8',
    paddingBottom: 10,
  },
  envioTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#005398',
    marginLeft: 10,
    flex: 1,
  },
  statusBadge: {
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  details: {
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 16,
    color: '#34495E',
    marginLeft: 10,
  },
});

export default EnviosAsignados;