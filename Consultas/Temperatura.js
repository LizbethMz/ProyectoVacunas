import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const data = [
  { id: '1', fecha: '25/08/2019', hora: '10:50 AM', temperatura: '36.4°C (97.5°F)', camion: 'Camión A', ruta: 'Ruta 1' },
  { id: '2', fecha: '26/08/2019', hora: '09:30 AM', temperatura: '36.7°C (98.0°F)', camion: 'Camión B', ruta: 'Ruta 2' },
  { id: '3', fecha: '26/08/2019', hora: '08:24 PM', temperatura: '37.0°C (98.6°F)', camion: 'Camión A', ruta: 'Ruta 1' },
  { id: '4', fecha: '27/08/2019', hora: '07:53 AM', temperatura: '37.3°C (99.1°F)', camion: 'Camión C', ruta: 'Ruta 3' },
];

export default function RegistroTemperatura() {
  const renderRow = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.date}>{item.fecha} - {item.hora}</Text>
      <Text style={styles.temperature}>{item.temperatura}</Text>
      <Text style={styles.details}>Camión: {item.camion} | Ruta: {item.ruta}</Text>
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.header}>Registro de Temperaturas</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderRow}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

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
    color: '#1ABC9C',
    marginTop: 5,
  },
  details: {
    fontSize: 16,
    color: '#5D6D7E',
    marginTop: 5,
  },
});
