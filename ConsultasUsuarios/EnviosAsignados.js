import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { getEnviosPorConductor } from '../api/EnviosApi';

const EnviosAsignados = ({ route, navigation }) => {
  const [envios, setEnvios] = useState([]);
  const { conductorId } = route.params;

  useEffect(() => {
    cargarEnvios();
  }, []);

  const cargarEnvios = async () => {
    try {
      const enviosData = await getEnviosPorConductor(conductorId);
      console.log('Datos de envíos recibidos:', enviosData);
      setEnvios(Array.isArray(enviosData) ? enviosData : []);
    } catch (error) {
      console.error('Error al cargar envíos:', error);
      setEnvios([]);
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#003B75" />
        </TouchableOpacity>
        <Text style={styles.title}>Mis Envíos Asignados</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {envios.length === 0 ? (
          <Text style={styles.noEnvio}>No tienes envíos asignados actualmente</Text>
        ) : (
          envios.map((envio) => (
            <View key={envio.numero} style={styles.envioCard}>
              <View style={styles.cardHeader}>
                <Icon name="truck" size={24} color="#003B75" />
                <Text style={styles.envioTitle}>Envío #{envio.numero}</Text>
                <View style={[styles.statusBadge, { backgroundColor: obtenerColorEstado(envio.estado) }]}>
                  <Text style={styles.statusText}>{envio.estado || 'Pendiente'}</Text>
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
                  <Icon name="industry" size={16} color="#003B75" />
                  <Text style={styles.detailText}>Origen: {envio.planta_nombre || 'No disponible'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Icon name="map-marker-alt" size={16} color="#003B75" />
                  <Text style={styles.detailText}>Destino: {envio.sucursal_nombre || 'No disponible'}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.routeButton}
                onPress={() => navigation.navigate('MiRuta', { envioId: envio.numero })}
              >
                <Icon name="route" size={16} color="#fff" />
                <Text style={styles.routeButtonText}>Ver Ruta</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005398',
    flex: 1,
  },
  scrollContent: {
    padding: 20,
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
  cardHeader: {
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
  routeButton: {
    backgroundColor: '#005398',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  routeButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: 'bold',
  },
});

export default EnviosAsignados;