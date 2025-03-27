import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getIncidentes, createIncidente, updateIncidente, deleteIncidente } from '../api/IncidentesApi';

const Incidentes = () => {
  const [incidentesData, setIncidentesData] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isConsulting, setIsConsulting] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newIncidente, setNewIncidente] = useState({
    codigo: '',
    descripcion: '',
    num_envio: '',
  });

  const fetchData = async () => {
    try {
      const data = await getIncidentes();
      setIncidentesData(data);
    } catch (error) {
      console.error('Error obteniendo datos de incidentes:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegisterOrUpdate = async () => {
    if (editingIndex !== null) {
      try {
        await updateIncidente(newIncidente.codigo, newIncidente);
        fetchData();
        setEditingIndex(null);
      } catch (error) {
        console.error('Error actualizando incidente:', error);
      }
    } else {
      try {
        await createIncidente(newIncidente);
        fetchData();
      } catch (error) {
        console.error('Error registrando incidente:', error);
      }
    }
    setNewIncidente({ codigo: '', descripcion: '', num_envio: '' });
    setIsRegistering(false);
  };

  const handleEdit = (index) => {
    setNewIncidente(incidentesData[index]);
    setEditingIndex(index);
    setIsRegistering(true);
    setIsConsulting(false);
  };

  const handleDelete = async (index) => {
    try {
      const codigo = incidentesData[index].codigo;
      await deleteIncidente(codigo);
      fetchData();
    } catch (error) {
      console.error('Error eliminando incidente:', error);
    }
  };

  const handleConsult = () => {
    fetchData();
    setIsConsulting(true);
    setIsRegistering(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gestión de Incidentes</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleConsult}
      >
        <Text style={styles.buttonText}>Consultar Información</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setIsRegistering(true);
          setIsConsulting(false);
          setEditingIndex(null);
        }}
      >
        <Text style={styles.buttonText}>Registrar Incidente</Text>
      </TouchableOpacity>

      {isConsulting && (
        <View style={styles.infoContainer}>
          <Text style={styles.subTitle}>Información de Incidentes</Text>
          {incidentesData.map((incidente, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Código:</Text> {incidente.codigo}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Descripción:</Text> {incidente.descripcion}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Número de Envío:</Text> {incidente.num_envio}
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(index)}>
                  <Text style={styles.buttonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(index)}>
                  <Text style={styles.buttonText}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {isRegistering && (
        <View style={styles.form}>
          <Text style={styles.subTitle}>{editingIndex !== null ? 'Editar Incidente' : 'Registrar Nuevo Incidente'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Código"
            value={newIncidente.codigo}
            onChangeText={(text) => setNewIncidente({ ...newIncidente, codigo: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Descripción"
            value={newIncidente.descripcion}
            onChangeText={(text) => setNewIncidente({ ...newIncidente, descripcion: text })}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Número de Envío"
            value={newIncidente.num_envio}
            onChangeText={(text) => setNewIncidente({ ...newIncidente, num_envio: text })}
            keyboardType="numeric"
          />
          <Button title={editingIndex !== null ? 'Actualizar' : 'Registrar'} onPress={handleRegisterOrUpdate} />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005398',
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005398',
    marginBottom: 15,
  },
  card: {
    backgroundColor: 'rgb(230, 242, 255)',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  cardText: {
    fontSize: 16,
    color: '#005398',
  },
  label: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'rgb(0, 64, 128)',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    width: '90%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#F0A500',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: '#D7263D',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  form: {
    width: '90%',
    padding: 20,
    backgroundColor: 'rgb(230, 242, 255)',
    borderRadius: 10,
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
});

export default Incidentes;