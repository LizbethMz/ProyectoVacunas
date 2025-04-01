import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getTemperaturas } from '../api/TemperaturaApi';

const Temperatura = () => {
  const [temperaturasData, setTemperaturasData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTemperaturas();
        setTemperaturasData(data);
      } catch (error) {
        console.error('Error obteniendo datos de temperatura:', error);
      }
    };
    fetchData();
  }, []);

  // Función para formatear la fecha (opcional)
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.header}>Registro de Temperaturas</Text>
      
      <ScrollView contentContainerStyle={styles.list}>
        {temperaturasData.length > 0 ? (
          temperaturasData.map((registro, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.date}>{formatDate(registro.fecha)} a las {registro.hora}</Text>
              <Text style={[
                styles.temperature,
                { color: registro.temperatura > 8 ? '#E74C3C' : registro.temperatura < 2 ? '#3498DB' : '#1ABC9C' }
              ]}>
                {registro.temperatura}°C
              </Text>
              <Text style={styles.details}>Envío: #{registro.num_envio}</Text>
              <Text style={styles.details}>Registro: #{registro.numero}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.details}>No hay registros de temperatura disponibles</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F8F9F9',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2E86C1',
  },
  list: {
    alignItems: 'center',
  },
  row: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ABB2B9',
    width: '100%',
    backgroundColor: '#EAF2F8',
    borderRadius: 10,
    marginVertical: 5,
    paddingHorizontal: 20,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495E',
  },
  temperature: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  details: {
    fontSize: 16,
    color: '#5D6D7E',
    marginTop: 5,
  },
});

export default Temperatura;