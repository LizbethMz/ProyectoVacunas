import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getConductores, createConductor, updateConductor, deleteConductor } from '../api/ConductoresApi';

const Conductores = () => {
  const [conductoresData, setConductoresData] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isConsulting, setIsConsulting] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newConductor, setNewConductor] = useState({
    numero: '',
    nombre_pila: '',
    apellidoP: '',
    apellidoM: '',
  });

  const fetchData = async () => {
    try {
      const data = await getConductores();
      setConductoresData(data);
    } catch (error) {
      console.error('Error obteniendo datos de conductores:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRegisterOrUpdate = async () => {
    if (editingIndex !== null) {
      try {
        await updateConductor(newConductor);
        fetchData();
        setEditingIndex(null);
      } catch (error) {
        console.error('Error actualizando conductor:', error);
      }
    } else {
      try {
        await createConductor(newConductor);
        fetchData();
      } catch (error) {
        console.error('Error registrando conductor:', error);
      }
    }
    setNewConductor({ numero: '', nombre_pila: '', apellidoP: '', apellidoM: '' });
    setIsRegistering(false);
  };

  const handleEdit = (index) => {
    setNewConductor(conductoresData[index]);
    setEditingIndex(index);
    setIsRegistering(true);
    setIsConsulting(false);
  };

  const handleDelete = async (index) => {
    try {
      const numero = conductoresData[index].numero;
      await deleteConductor(numero);
      fetchData();
    } catch (error) {
      console.error('Error eliminando conductor:', error);
    }
  };

  const handleConsult = () => {
    fetchData();
    setIsConsulting(true);
    setIsRegistering(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Gestión de Conductores</Text>

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
        <Text style={styles.buttonText}>Registrar Conductor</Text>
      </TouchableOpacity>

      {isConsulting && (
        <View style={styles.infoContainer}>
          <Text style={styles.subTitle}>Información de Conductores</Text>
          {conductoresData.map((conductor, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Número:</Text> {conductor.numero}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Nombre:</Text> {conductor.nombre_pila}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Apellido Paterno:</Text> {conductor.apellidoP}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.label}>Apellido Materno:</Text> {conductor.apellidoM}
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
          <Text style={styles.subTitle}>{editingIndex !== null ? 'Editar Conductor' : 'Registrar Nuevo Conductor'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Número"
            value={newConductor.numero}
            onChangeText={(text) => setNewConductor({ ...newConductor, numero: text })}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={newConductor.nombre_pila}
            onChangeText={(text) => setNewConductor({ ...newConductor, nombre_pila: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Apellido Paterno"
            value={newConductor.apellidoP}
            onChangeText={(text) => setNewConductor({ ...newConductor, apellidoP: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Apellido Materno"
            value={newConductor.apellidoM}
            onChangeText={(text) => setNewConductor({ ...newConductor, apellidoM: text })}
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

export default Conductores;