import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { reportarIncidente } from '../apiUsuarios/IncidentesApi';

const ReportarIncidente = ({ route }) => {
  const [descripcion, setDescripcion] = useState('');
  const { envioId } = route.params;

  const handleReportar = async () => {
    if (!descripcion.trim()) {
      Alert.alert('Error', 'Por favor describe el incidente');
      return;
    }

    try {
      await reportarIncidente(envioId, descripcion);
      Alert.alert('Éxito', 'Incidente reportado correctamente');
      setDescripcion('');
    } catch (error) {
      Alert.alert('Error', 'No se pudo reportar el incidente');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Reportar Incidente</Text>
      <Text style={styles.subtitle}>Envío #{envioId}</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Descripción del incidente:</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={5}
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Describe el incidente ocurrido..."
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleReportar}>
        <Icon name="exclamation-triangle" size={20} color="white" />
        <Text style={styles.buttonText}>Reportar Incidente</Text>
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
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#34495E',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#D6EAF8',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 150,
  },
  button: {
    backgroundColor: '#E74C3C',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ReportarIncidente;