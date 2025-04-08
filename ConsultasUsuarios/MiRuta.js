import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { getRutaAsignada } from '../apiUsuarios/RutasApi';

const MiRuta = ({ route, navigation }) => {
  const [ruta, setRuta] = useState(null);
  const { envioId } = route.params;

  useEffect(() => {
    const cargarRuta = async () => {
      try {
        const rutaData = await getRutaAsignada(envioId);
        setRuta(rutaData);
      } catch (error) {
        console.error('Error al cargar ruta:', error);
      }
    };
    cargarRuta();
  }, [envioId]);

  if (!ruta) {
    return (
      <View style={styles.container}>
        <Text>Cargando información de la ruta...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('EnviosAsignados')}
        >
          <Icon name="arrow-left" size={24} color="#005398" />
        </TouchableOpacity>
        <Text style={styles.title}>Mi Ruta Asignada</Text>
      </View>
      
      <View style={styles.routeCard}>
        <View style={styles.routeStep}>
          <Icon name="industry" size={24} color="#005398" />
          <View style={styles.routeDetails}>
            <Text style={styles.routeTitle}>Origen</Text>
            <Text style={styles.routeText}>{ruta.origen}</Text>
            <Text style={styles.routeAddress}>
              {ruta.calle_origen} {ruta.numero_origen}, {ruta.colonia_origen}
            </Text>
            <Text style={styles.routeAddress}>
              {ruta.cp_origen}, {ruta.pais_origen}
            </Text>
            <Text style={styles.routeTime}>Salida: {ruta.f_salida} a las {ruta.h_salida}</Text>
          </View>
        </View>

        <View style={styles.routeStep}>
          <Icon name="clinic-medical" size={24} color="#005398" />
          <View style={styles.routeDetails}>
            <Text style={styles.routeTitle}>Destino</Text>
            <Text style={styles.routeText}>{ruta.destino}</Text>
            <Text style={styles.routeAddress}>
              {ruta.calle_destino} {ruta.numero_destino}, {ruta.colonia_destino}
            </Text>
            <Text style={styles.routeAddress}>
              {ruta.cp_destino}, {ruta.pais_destino}
            </Text>
            <Text style={styles.routeTime}>Llegada estimada: {ruta.f_llegada} a las {ruta.h_llegada}</Text>
          </View>
        </View>
      </View>

      <View style={styles.distanceCard}>
        <Text style={styles.distanceTitle}>Tiempo estimado</Text>
        <Text style={styles.distanceValue}>{ruta.tiempo_estimado} horas</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005398',
    flex: 1,
    textAlign: 'center',
  },
  routeCard: {
    backgroundColor: '#EAF2F8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
  },
  routeStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  routeDetails: {
    marginLeft: 15,
    flex: 1,
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003B75',
    marginBottom: 3,
  },
  routeText: {
    fontSize: 14,
    color: '#34495E',
    marginBottom: 5,
  },
  routeAddress: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 2,
  },
  routeTime: {
    fontSize: 12,
    color: '#7F8C8D',
    fontStyle: 'italic',
    marginTop: 5,
  },
  distanceCard: {
    backgroundColor: '#DBEDFC',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
  },
  distanceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003B75',
    marginBottom: 5,
  },
  distanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005398',
    marginBottom: 5,
  },
});

export default MiRuta;